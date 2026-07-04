import { makeDraft } from "./_shared/amitalux-store.js";

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const customer = body.customer || {};
    const caseData = body.case || {};

    return Response.json({
      reply: makeDraft(customer, caseData),
      plan: [
        "Match customer identity and consent.",
        "Review current issue and prior resolution attempts.",
        "Choose the next best action.",
        "Log the promise and update history."
      ],
      source: "netlify-function-simulated-ai"
    });
  } catch (error) {
    return Response.json({ error: "Could not create draft" }, { status: 400 });
  }
};

export const config = {
  path: "/api/ai-draft",
};
