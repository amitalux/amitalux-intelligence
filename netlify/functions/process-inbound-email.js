import {
  addAutomationTask,
  addHistory,
  nextCaseNo,
  readState,
  resolveAvailableAgent,
  timestamp,
  upsertCustomer,
  writeState
} from "./_shared/amitalux-store.js";
import { sanitizeEmailPayload } from "./_shared/sanitizer.js";

function localEmailAnalysis(text) {
  const lower = text.toLowerCase();
  const urgent = ["urgent", "angry", "again", "still", "refund", "charged", "nobody", "manager"].some((word) => lower.includes(word));
  const satisfied = ["thank you", "thanks", "great", "resolved"].some((word) => lower.includes(word));
  const orderMatch = text.match(/\b(?:order|invoice|receipt)[\s#:]*([a-z0-9-]+)/i);
  const errorCodes = [...text.matchAll(/\b(?:err|error|code)[\s#:]*([a-z0-9-]+)/gi)].map((match) => match[1]);

  return {
    customerTone: urgent ? "urgent_escalation" : satisfied ? "satisfied" : lower.includes("again") || lower.includes("still") ? "frustrated" : "neutral",
    primaryContextSummary: text.slice(0, 220) || "Inbound support email received.",
    relevantTechnicalData: {
      orderId: orderMatch?.[1] || "",
      errorCodes
    },
    source: "local-privacy-safe-parser"
  };
}

async function analyzeEmailWithAi(rawEmailBody) {
  const sanitizedBody = sanitizeEmailPayload(rawEmailBody);
  const apiKey = process.env.OPENAI_API_KEY || (typeof Netlify !== "undefined" && Netlify.env?.get ? Netlify.env.get("OPENAI_API_KEY") : "");

  if (!apiKey) {
    return { analysis: localEmailAnalysis(sanitizedBody), sanitizedBody };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Extract structural entities, customer emotional tone, and concise summaries from raw customer support emails."
          },
          { role: "user", content: sanitizedBody }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "email_analysis_schema",
            strict: true,
            schema: {
              type: "object",
              properties: {
                customerTone: {
                  type: "string",
                  enum: ["frustrated", "neutral", "satisfied", "urgent_escalation"]
                },
                primaryContextSummary: { type: "string" },
                relevantTechnicalData: {
                  type: "object",
                  properties: {
                    orderId: { type: "string" },
                    errorCodes: { type: "array", items: { type: "string" } }
                  },
                  required: ["orderId", "errorCodes"],
                  additionalProperties: false
                }
              },
              required: ["customerTone", "primaryContextSummary", "relevantTechnicalData"],
              additionalProperties: false
            }
          }
        }
      })
    });

    if (!response.ok) throw new Error("AI provider unavailable");
    const data = await response.json();
    return {
      analysis: { ...JSON.parse(data.choices[0].message.content), source: "openai-structured-schema" },
      sanitizedBody
    };
  } catch (error) {
    return { analysis: localEmailAnalysis(sanitizedBody), sanitizedBody };
  }
}

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const state = await readState(req);
  const body = await req.json().catch(() => ({}));
  const rawEmailBody = body.rawEmailBody || body.message || "";
  const senderEmail = String(body.senderEmail || body.customerEmail || "maya@example.com").trim().toLowerCase();
  const defaultAssignedAgent = body.defaultAssignedAgent || "Priya S.";
  const { analysis, sanitizedBody } = await analyzeEmailWithAi(rawEmailBody);
  const finalAssignedAgent = await resolveAvailableAgent(req, defaultAssignedAgent, state.agents);
  const { customer } = upsertCustomer(state, {
    name: body.customerName || senderEmail.split("@")[0] || "Email Customer",
    email: senderEmail,
    channel: "Email",
    issue: analysis.primaryContextSummary
  });
  const id = `email-${Date.now()}`;
  const priority = analysis.customerTone === "urgent_escalation" ? "red" : analysis.customerTone === "frustrated" ? "yellow" : "green";

  const newCase = {
    id,
    caseNo: nextCaseNo(state),
    title: body.title || "Customer email",
    customerEmail: customer.email,
    message: sanitizedBody,
    channel: "Email",
    queue: finalAssignedAgent === "Unassigned" ? "Unassigned email queue" : `${finalAssignedAgent} email queue`,
    context: `AI tone: ${analysis.customerTone}. Summary: ${analysis.primaryContextSummary}`,
    reply: "",
    status: "Received",
    risk: priority,
    sentiment: analysis.customerTone,
    createdAt: timestamp(),
    firstResponseAt: "",
    closedAt: "",
    assignedTo: finalAssignedAgent,
    originallyAssignedTo: defaultAssignedAgent,
    aiAnalysis: analysis,
    messages: [{ time: timestamp(), speaker: "Customer", channel: "Email", body: sanitizedBody }],
    timeline: [
      { time: timestamp(), stage: "Email received", detail: "Inbound email entered Amitalux Intelligence intake.", status: priority },
      { time: timestamp(), stage: "Privacy scrubbed", detail: "Payment card, SSN, and credential patterns were redacted before AI analysis.", status: "green" },
      { time: timestamp(), stage: "OOO routing checked", detail: `${defaultAssignedAgent} resolved to ${finalAssignedAgent}.`, status: finalAssignedAgent === defaultAssignedAgent ? "green" : "yellow" }
    ]
  };

  state.cases.unshift(newCase);
  addAutomationTask(state, {
    type: "Email first response",
    title: `Respond to parsed email ${newCase.caseNo}`,
    caseItem: newCase,
    customer,
    owner: finalAssignedAgent,
    due: priority === "red" ? "Next 5 minutes" : "Next 10 minutes",
    priority,
    detail: `AI classified the email as ${analysis.customerTone}.`,
    nextStep: "Review the structured analysis, confirm the routing, and send a personal first reply."
  });
  addHistory(state, customer.name, `Inbound email parsed and routed to ${finalAssignedAgent}.`, priority);

  return Response.json(await writeState(state, req));
};

export const config = {
  path: "/api/process-inbound-email",
};
