import { addAutomationTask, addCaseMessage, addHistory, caseRisk, findCustomer, makeDraft, readState, requireRole, resolveAvailableAgent, timestamp, writeState } from "./_shared/amitalux-store.js";

export default async (req, context) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const forbidden = requireRole(req, ["owner", "admin", "agent"]);
  if (forbidden) return forbidden;

  const state = await readState(req);
  const body = await req.json().catch(() => ({}));
  const selected = state.cases.find((item) => item.id === context.params.id);

  if (!selected) {
    return Response.json({ error: "Case not found" }, { status: 404 });
  }

  const customer = findCustomer(state, selected.customerEmail);

  if (selected.status === "Closed" && body.action !== "reopen") {
    return Response.json(await writeState(state, req));
  }

  if (body.action === "analyze") {
    selected.status = "Analyzed";
    selected.reply = makeDraft(customer, selected);
    selected.timeline.push({
      time: timestamp(),
      stage: "AI analysis complete",
      detail: "Backend matched the customer, checked history, detected tone, and created a response draft.",
      status: caseRisk(selected)
    });
    addCaseMessage(selected, "Intelligence AI", selected.reply, "Suggested reply");
    addAutomationTask(state, {
      type: "AI review",
      title: `Review AI plan for ${selected.caseNo}`,
      caseItem: selected,
      customer,
      owner: selected.assignedTo || "Unassigned",
      due: "Now",
      priority: caseRisk(selected),
      detail: "Amitalux Intelligence prepared a draft. A human should verify the promise, tone, and resolution before the reply is sent.",
      nextStep: "Approve the reply only if the action is specific and the customer does not need to repeat the story."
    });
    addHistory(state, customer.name, `AI analyzed ${selected.title}.`, caseRisk(selected));
  }

  if (body.action === "approve") {
    selected.status = "Approved";
    selected.timeline.push({
      time: timestamp(),
      stage: "Reply approved",
      detail: "A human approved the AI response and resolution plan.",
      status: "green"
    });
    addCaseMessage(selected, "Agent", `Approved response for ${selected.caseNo}.`, "Internal");
    addHistory(state, customer.name, `Human approved the reply for ${selected.title}.`, "green");
  }

  if (body.action === "claim") {
    selected.assignedTo = await resolveAvailableAgent(req, body.agentName || "Priya S.", state.agents);
    selected.timeline.push({
      time: timestamp(),
      stage: "Ticket claimed",
      detail: `${selected.assignedTo} claimed ${selected.caseNo} from the shared queue after availability routing.`,
      status: "green"
    });
    addCaseMessage(selected, "Agent", `${selected.assignedTo} claimed this ticket from the shared queue.`, "Internal");
    addHistory(state, customer.name, `${selected.caseNo} claimed by ${selected.assignedTo}.`, "green");
  }

  if (body.action === "send") {
    if (body.reply) {
      selected.reply = body.reply;
    }
    selected.status = "Sent";
    selected.firstResponseAt = selected.firstResponseAt || timestamp();
    state.metrics.sentCount += 1;
    selected.timeline.push({
      time: timestamp(),
      stage: "Reply sent",
      detail: "The approved response was sent and the promise was logged.",
      status: "green"
    });
    addCaseMessage(selected, "Agent", selected.reply || "Approved response sent to customer.", selected.channel);
    addAutomationTask(state, {
      type: "Promise follow-up",
      title: `Confirm promised resolution for ${selected.caseNo}`,
      caseItem: selected,
      customer,
      owner: selected.assignedTo || "Unassigned",
      due: "Today 4:00 PM",
      priority: selected.risk === "red" ? "red" : "yellow",
      detail: "A customer-facing reply was sent. Amitalux Intelligence should confirm that any promised action actually happens.",
      nextStep: "Check whether the promise was completed, then send a clear update if anything changes."
    });
    addHistory(state, customer.name, `Reply sent for ${selected.title}.`, "green");
  }

  if (body.action === "close") {
    selected.status = "Closed";
    selected.closedAt = timestamp();
    state.metrics.handledCount += 1;
    state.metrics.csatScore = Math.min(98, state.metrics.csatScore + (selected.risk === "red" ? 2 : 1));
    selected.timeline.push({
      time: timestamp(),
      stage: "Case closed",
      detail: "The case is resolved, history is updated, and reports reflect the closure.",
      status: "green"
    });
    addCaseMessage(selected, "Agent", `Closed ${selected.caseNo}. Resolution and history are available for audit.`, "Internal");
    addAutomationTask(state, {
      type: "CSAT follow-up",
      title: `Send CSAT check for ${selected.caseNo}`,
      caseItem: selected,
      customer,
      owner: selected.assignedTo || "Unassigned",
      due: "Tomorrow 9:00 AM",
      priority: "green",
      detail: "The case closed. Amitalux Intelligence should check whether the customer feels the issue was truly resolved.",
      nextStep: "Send a short satisfaction check and update memory if the customer still sounds uncertain."
    });
    addHistory(state, customer.name, `${selected.title} was closed. CSAT moved to ${state.metrics.csatScore}%.`, "green");
  }

  return Response.json(await writeState(state, req));
};

export const config = {
  path: "/api/cases/:id/action",
};
