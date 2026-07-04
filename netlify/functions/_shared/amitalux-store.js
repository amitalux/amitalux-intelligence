import { getStore } from "@netlify/blobs";

const fallbackWorkspaceId = "demo-business";

export function timestamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function getWorkspaceId(req) {
  const headerWorkspace = req?.headers?.get("x-amitalux-workspace");
  const envWorkspace =
    typeof Netlify !== "undefined" && Netlify.env?.get
      ? Netlify.env.get("AMITALUX_DEFAULT_WORKSPACE")
      : process.env.AMITALUX_DEFAULT_WORKSPACE;
  return slugify(headerWorkspace || envWorkspace || fallbackWorkspaceId);
}

export function getUserRole(req) {
  const role = req?.headers?.get("x-amitalux-role") || "owner";
  return ["owner", "admin", "agent", "viewer"].includes(role) ? role : "viewer";
}

export function requireRole(req, allowedRoles) {
  const role = getUserRole(req);
  if (!allowedRoles.includes(role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

function agentId(agent) {
  return agent?.agentId || agent?.name || "Unassigned";
}

function defaultRoster(agents = []) {
  const names = agents.map((agent) => agentId(agent));
  return {
    agents: Object.fromEntries(
      names.map((name, index) => [
        name,
        {
          status: index === 1 ? "ooo" : "active",
          backup: names[(index + 1) % names.length] || "Unassigned",
          scheduled_return: index === 1 ? "2026-07-05T17:00:00Z" : null
        }
      ])
    )
  };
}

async function readRoster(req, agents = []) {
  const store = getStore({ name: "amitalux-roster", consistency: "strong" });
  const rosterKey = `registry:${getWorkspaceId(req)}:roster`;
  const existing = await store.get(rosterKey, { type: "json" });
  const seed = defaultRoster(agents);
  const roster = existing?.agents ? existing : seed;

  agents.forEach((agent) => {
    const id = agentId(agent);
    if (!roster.agents[id]) {
      roster.agents[id] = {
        status: "active",
        backup: seed.agents[id]?.backup || "Unassigned",
        scheduled_return: null
      };
    }
  });

  await store.setJSON(rosterKey, roster);
  return roster;
}

async function writeRoster(req, roster = { agents: {} }) {
  const store = getStore({ name: "amitalux-roster", consistency: "strong" });
  const rosterKey = `registry:${getWorkspaceId(req)}:roster`;
  await store.setJSON(rosterKey, roster);
  return roster;
}

function attachRosterToAgents(agents = [], roster = { agents: {} }) {
  return agents.map((agent) => {
    const availability = roster.agents[agentId(agent)] || {};
    return {
      ...agent,
      agentId: agentId(agent),
      availabilityStatus: availability.status || "active",
      backupAgentId: availability.backup || "Unassigned",
      scheduledReturn: availability.scheduled_return || null
    };
  });
}

export function initialState() {
  const customers = [
    {
      customerNo: "CUST-0001",
      name: "Maya Thompson",
      email: "maya@example.com",
      tier: "Gold member",
      channel: "Text updates",
      value: "$1,240 lifetime spend",
      consent: "Email and SMS allowed",
      memory: "Needs clear confirmation when money or scheduling changes.",
      issue: "Late fee after rescheduling",
      summary:
        "Maya rescheduled because of a family emergency and was still charged a late fee. She contacted the business yesterday and feels she did not receive a real answer.",
      offered: ["Billing review was promised by today.", "A general apology was already sent.", "Front desk said they would check the account."],
      available: ["Reverse the late fee now.", "Send written confirmation of the credit.", "Offer a small membership credit if the promise was missed.", "Escalate to the owner if she asks again."],
      square: "Last Square payment: $185 membership payment. Booking was rescheduled yesterday.",
      crm: "Salesforce owner: Priya S. Lifecycle stage: active member.",
      memoryLine: "Maya prefers direct answers and same-day confirmation for billing concerns.",
      lastVerified: "18 days ago",
      dataHealth: "Healthy",
      staleRisk: "Low",
      staleReason: "Recent payment, booking, and consent activity match the current profile.",
      adminAction: "No admin action needed."
    },
    {
      customerNo: "CUST-0002",
      name: "Sophia Patel",
      email: "sophia@example.com",
      tier: "First purchase",
      channel: "Email",
      value: "$96 first order",
      consent: "Email allowed",
      memory: "Values polished communication when gift details are involved.",
      issue: "Gift note missing",
      summary:
        "Sophia ordered a gift bundle and the note was missing. The product arrived, but the emotional purpose of the purchase was missed.",
      offered: ["A standard apology was sent.", "Support offered to check with fulfillment."],
      available: ["Mail a handwritten card.", "Add a future gift credit.", "Send a personal apology from the business.", "Update the packing checklist."],
      square: "Square order: $96 gift bundle.",
      crm: "CRM stage: first purchase. Owner: unassigned.",
      memoryLine: "Sophia responds best to personal repair, not generic apology.",
      lastVerified: "94 days ago",
      dataHealth: "Review needed",
      staleRisk: "Medium",
      staleReason: "The customer has no assigned owner, no recent preference check, and an unresolved fulfillment note.",
      adminAction: "Ask an admin to verify contact details, assign an owner, and close the fulfillment note."
    },
    {
      customerNo: "CUST-0003",
      name: "Jordan Lee",
      email: "jordan@example.com",
      tier: "Member",
      channel: "SMS",
      value: "$740 lifetime spend",
      consent: "Email and SMS allowed",
      memory: "Needs fast schedule confirmation before class times.",
      issue: "Class time confusion",
      summary:
        "Jordan is checking whether the 5:30 class moved after seeing a different time in the app. The issue is simple but time sensitive.",
      offered: ["No resolution offered yet."],
      available: ["Confirm the class time.", "Send SMS confirmation.", "Check the waitlist alert.", "Flag the schedule notification issue."],
      square: "Square booking: Pilates 5:30 PM today.",
      crm: "Salesforce owner: Elena R. Lifecycle stage: renewal candidate.",
      memoryLine: "Jordan prefers short, specific SMS replies for same-day schedule questions.",
      lastVerified: "126 days ago",
      dataHealth: "Stale data alert",
      staleRisk: "High",
      staleReason: "The CRM says renewal candidate, but the most recent Square booking is active. The lifecycle stage may be outdated.",
      adminAction: "Alert admin to confirm lifecycle stage, booking status, and SMS consent before the next renewal message."
    }
  ];

  const agents = [
    {
      agentId: "Priya S.",
      name: "Priya S.",
      role: "Billing lead",
      handled: 19,
      csat: "94%",
      avg: "4m 20s",
      status: "green",
      specialties: ["Billing repair", "Membership credits", "High-frustration cases"],
      tone: "Direct, calm, accountable",
      activeLoad: "3 active cases",
      permissions: "Can approve credits up to $250",
      coaching: "Keep explanations short when the customer already repeated the story."
    },
    {
      agentId: "Elena R.",
      name: "Elena R.",
      role: "Retention",
      handled: 15,
      csat: "89%",
      avg: "6m 10s",
      status: "yellow",
      specialties: ["Renewals", "Schedule confusion", "Win-back moments"],
      tone: "Warm, concise, reassuring",
      activeLoad: "5 active cases",
      permissions: "Can update lifecycle stage and renewal notes",
      coaching: "Review stale CRM signals before sending renewal messages."
    },
    {
      agentId: "Marcus J.",
      name: "Marcus J.",
      role: "Front desk",
      handled: 22,
      csat: "96%",
      avg: "3m 45s",
      status: "green",
      specialties: ["First replies", "Order updates", "Simple schedule answers"],
      tone: "Friendly, fast, plainspoken",
      activeLoad: "2 active cases",
      permissions: "Can send replies and create follow-up tasks",
      coaching: "Escalate billing promises instead of holding them at front desk."
    }
  ];

  const cases = [
    makeCase("billing", "Late fee after rescheduling", "maya@example.com", "I already asked about this fee yesterday and I still do not have a real answer.", "Email", "Billing queue moves to yellow", "Gold member. Recent Square payment and rescheduled booking are attached to the case.", "Yellow", "Frustrated customer"),
    makeCase("gift", "Gift note missing from order", "sophia@example.com", "The gift arrived, but the note was missing. It was the whole reason I ordered it.", "Email", "Order queue stays green", "First purchase. Square order is attached, but no CRM owner has been assigned.", "Green", "Experience repair"),
    makeCase("stale", "CRM stage conflicts with Square activity", "jordan@example.com", "Can you confirm if the 5:30 class moved? I got two different messages.", "SMS", "Data review becomes red", "Active Square booking. Salesforce lifecycle stage may be outdated.", "Red", "Admin data risk")
  ];

  const tasks = [
    makeAutomationTask({
      id: "task-maya-confirmation",
      type: "SLA watch",
      title: "Confirm Maya's billing review in writing",
      caseId: "billing",
      customerEmail: "maya@example.com",
      owner: "Priya S.",
      due: "Today 4:00 PM",
      priority: "red",
      detail: "A billing promise was already made. Amitalux Intelligence should make sure the customer gets a clear written update today.",
      nextStep: "Review the fee, send confirmation, and log the promise against the case."
    }),
    makeAutomationTask({
      id: "task-jordan-stale",
      type: "Data health",
      title: "Review Jordan's CRM stage before renewal outreach",
      caseId: "stale",
      customerEmail: "jordan@example.com",
      owner: "Admin",
      due: "Today 5:00 PM",
      priority: "red",
      detail: "Square shows active bookings while the CRM says renewal candidate. Renewal messaging should wait until this is corrected.",
      nextStep: "Verify Square activity, update Salesforce, and confirm SMS consent."
    }),
    makeAutomationTask({
      id: "task-sophia-repair",
      type: "Experience repair",
      title: "Check that Sophia's handwritten card was offered",
      caseId: "gift",
      customerEmail: "sophia@example.com",
      owner: "Marcus J.",
      due: "Tomorrow 10:00 AM",
      priority: "yellow",
      detail: "The issue is emotional, not only fulfillment. Amitalux Intelligence should verify that the personal repair option was not missed.",
      nextStep: "Confirm whether the card was sent and update the packing checklist."
    })
  ];

  return {
    workspace: {
      id: fallbackWorkspaceId,
      name: "Demo Business",
      plan: "beta",
      status: "active"
    },
    customers,
    agents,
    cases,
    tasks,
    history: [{ time: "Now", customer: "Amitalux Intelligence", event: "Backend workspace initialized.", status: "green" }],
    metrics: { handledCount: 0, sentCount: 0, csatScore: 91 }
  };
}

export async function readState(req) {
  const stateKey = `workspace:${getWorkspaceId(req)}`;
  const store = getStore({ name: "amitalux-state", consistency: "strong" });
  const existing = await store.get(stateKey, { type: "json" });
  if (existing) {
    existing.customers = (existing.customers || []).map((customer, index) => normalizeCustomerRecord(customer, index));
    existing.cases = (existing.cases || []).map((item, index) => normalizeCaseRecord(item, index));
    existing.tasks = Array.isArray(existing.tasks) && existing.tasks.length
      ? existing.tasks.map((task, index) => normalizeAutomationTask(task, index))
      : initialState().tasks.map((task, index) => normalizeAutomationTask(task, index));
    existing.roster = await readRoster(req, existing.agents || []);
    existing.agents = attachRosterToAgents(existing.agents || [], existing.roster);
    return existing;
  }
  const seed = initialState();
  seed.workspace.id = getWorkspaceId(req);
  seed.roster = await readRoster(req, seed.agents);
  seed.agents = attachRosterToAgents(seed.agents, seed.roster);
  seed.customers = seed.customers.map((customer, index) => normalizeCustomerRecord(customer, index));
  seed.cases = seed.cases.map((item, index) => normalizeCaseRecord(item, index));
  seed.tasks = seed.tasks.map((task, index) => normalizeAutomationTask(task, index));
  await store.setJSON(stateKey, seed);
  return seed;
}

export async function writeState(state, req) {
  const stateKey = `workspace:${getWorkspaceId(req)}`;
  const store = getStore({ name: "amitalux-state", consistency: "strong" });
  state.workspace = state.workspace || {};
  state.workspace.id = getWorkspaceId(req);
  if (state.roster) {
    await writeRoster(req, state.roster);
    state.agents = attachRosterToAgents(state.agents || [], state.roster);
  }
  state.customers = (state.customers || []).map((customer, index) => normalizeCustomerRecord(customer, index));
  state.cases = (state.cases || []).map((item, index) => normalizeCaseRecord(item, index));
  state.tasks = (state.tasks || []).map((task, index) => normalizeAutomationTask(task, index));
  await store.setJSON(stateKey, state);
  return state;
}

export function findCustomer(state, email) {
  state.customers = (state.customers || []).map((customer, index) => normalizeCustomerRecord(customer, index));
  return state.customers.find((customer) => customer.email.toLowerCase() === String(email).toLowerCase()) || state.customers[0];
}

export function nextCustomerNo(state) {
  const numbers = (state.customers || [])
    .map((customer) => Number(String(customer.customerNo || "").replace(/\D/g, "")))
    .filter((number) => Number.isFinite(number));
  return `CUST-${String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, "0")}`;
}

export function normalizeCustomerRecord(customer, index = 0) {
  customer.customerNo = customer.customerNo || `CUST-${String(index + 1).padStart(4, "0")}`;
  return customer;
}

export function createCustomerRecord(input = {}) {
  const name = String(input.name || "New Customer").trim() || "New Customer";
  const email = String(input.email || "").trim().toLowerCase();
  const phone = String(input.phone || "").trim();
  const preferredChannel = String(input.channel || input.preferredChannel || "Email").trim() || "Email";
  const firstName = name.split(" ")[0] || "Customer";

  return {
    customerNo: input.customerNo,
    name,
    email,
    phone,
    tier: input.tier || "New signup",
    channel: preferredChannel,
    value: input.value || "New customer",
    consent: input.consent || `${preferredChannel} allowed`,
    memory: input.memory || `${firstName} just signed up. Confirm preferences before sending sensitive updates.`,
    issue: input.issue || "New customer signup",
    summary:
      input.summary ||
      `${name} created a customer profile through the signup flow. Amitalux Intelligence should preserve the record, attach future messages, and avoid making the customer repeat their information.`,
    offered: input.offered || ["Welcome confirmation can be sent.", "Preferences can be verified."],
    available: input.available || ["Create the customer record.", "Send a welcome message.", "Ask one clarifying preference question if needed."],
    square: input.square || "Square status: no linked transaction yet.",
    crm: input.crm || "CRM status: created by Amitalux Intelligence signup flow.",
    memoryLine: input.memoryLine || `${firstName} is a new customer. Use a warm, clear welcome and verify preferences.`,
    lastVerified: "Today",
    dataHealth: "New record",
    staleRisk: "Low",
    staleReason: "This record was created from the latest customer-provided signup information.",
    adminAction: "No admin action needed unless enrichment fails."
  };
}

export function upsertCustomer(state, input = {}) {
  state.customers = (state.customers || []).map((customer, index) => normalizeCustomerRecord(customer, index));
  const incoming = createCustomerRecord(input);
  if (!incoming.email) {
    return { customer: state.customers[0], created: false };
  }
  incoming.customerNo = incoming.customerNo || nextCustomerNo(state);

  const existing = state.customers.find((customer) => customer.email.toLowerCase() === incoming.email);
  if (existing) {
    Object.assign(existing, {
      ...incoming,
      customerNo: existing.customerNo || incoming.customerNo,
      name: incoming.name === "New Customer" ? existing.name : incoming.name,
      tier: existing.tier === "Gold member" || existing.tier === "Member" ? existing.tier : incoming.tier,
      value: existing.value && existing.value !== "New customer" ? existing.value : incoming.value,
      square: existing.square && !existing.square.includes("no linked transaction") ? existing.square : incoming.square,
      crm: existing.crm && !existing.crm.includes("created by Amitalux Intelligence") ? existing.crm : incoming.crm
    });
    return { customer: existing, created: false };
  }

  state.customers.unshift(incoming);
  return { customer: incoming, created: true };
}

export function caseRisk(item) {
  if (item.status === "Closed") return "green";
  if (item.status === "Sent") return "yellow";
  if (item.risk === "red") return "red";
  if (item.risk === "yellow" || item.status === "Received") return "yellow";
  return "green";
}

export function makeDraft(customer, caseData) {
  const rawFirstName = String(customer.name || "there").split(" ")[0];
  const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);
  const issue = String(caseData.title || customer.issue || "your request");
  const message = String(caseData.message || "").toLowerCase();
  const sentiment = String(caseData.sentiment || "").toLowerCase();
  const rawAvailable = Array.isArray(customer.available) && customer.available.length
    ? String(customer.available[0])
    : "review the details";
  const available = (rawAvailable.toLowerCase().includes("create the customer record")
    ? "review the details"
    : rawAvailable)
    .replace(/\.$/, "")
    .toLowerCase();
  const needsCare = sentiment.includes("frustrated")
    || sentiment.includes("risk")
    || message.includes("still")
    || message.includes("again")
    || message.includes("nobody")
    || message.includes("real answer");

  if (needsCare) {
    return `Hi ${firstName}, I am sorry this has taken more effort than it should have. I can see you have already tried to get this handled, so I will not make you start over. I am going to ${available} and send you a clear update today.`;
  }

  if (issue.toLowerCase().includes("customer message") || issue.toLowerCase().includes("customer email")) {
    return `Hi ${firstName}, thanks for reaching out. I am checking this now and will make sure you get a clear answer instead of being passed around. I will follow up with the next step as soon as I confirm the details.`;
  }

  return `Hi ${firstName}, thanks for reaching out. I am checking ${issue.toLowerCase()} now and will keep the next step clear. You will hear back with what we found and what happens next.`;
}

export function addHistory(state, customer, event, status = "green") {
  state.history.unshift({ time: "Now", customer, event, status });
}

function taskStatusClass(task) {
  if (task.status === "Completed") return "green";
  if (task.priority === "red") return "red";
  if (task.priority === "yellow" || task.status === "Running") return "yellow";
  return "green";
}

function makeAutomationTask(input = {}) {
  return {
    id: input.id || `task-${Date.now()}`,
    type: input.type || "Follow-up",
    title: input.title || "Customer follow-up",
    caseId: input.caseId || "billing",
    customerEmail: input.customerEmail || "maya@example.com",
    owner: input.owner || "Unassigned",
    due: input.due || "Today 4:00 PM",
    priority: input.priority || "yellow",
    status: input.status || "Open",
    detail: input.detail || "Amitalux Intelligence created this task so the next customer promise is not missed.",
    nextStep: input.nextStep || "Review the case, complete the next action, and keep the customer informed.",
    createdAt: input.createdAt || timestamp(),
    completedAt: input.completedAt || ""
  };
}

export function normalizeAutomationTask(task, index = 0) {
  return makeAutomationTask({
    ...task,
    id: task.id || `task-${index + 1}`,
    status: task.status || "Open",
    priority: task.priority || "yellow"
  });
}

export function addAutomationTask(state, input = {}) {
  const selected = input.caseItem || (state.cases || []).find((item) => item.id === input.caseId) || (state.cases || [])[0];
  const customer = input.customer || findCustomer(state, input.customerEmail || selected?.customerEmail);
  if (!selected || !customer) return null;

  state.tasks = (state.tasks || []).map((task, index) => normalizeAutomationTask(task, index));
  const duplicate = state.tasks.find(
    (task) => task.status !== "Completed" && task.caseId === selected.id && task.type === (input.type || "Follow-up")
  );

  if (duplicate) return duplicate;

  const task = makeAutomationTask({
    ...input,
    id: input.id || `task-${Date.now()}-${state.tasks.length}`,
    caseId: selected.id,
    customerEmail: customer.email,
    owner: input.owner || selected.assignedTo || "Unassigned",
    priority: input.priority || caseRisk(selected)
  });

  state.tasks.unshift(task);
  addHistory(state, customer.name, `Automation task created: ${task.title}.`, taskStatusClass(task));
  return task;
}

export async function resolveAvailableAgent(req, assignedAgentId, agents = []) {
  if (!assignedAgentId || assignedAgentId === "Unassigned") return "Unassigned";
  const roster = await readRoster(req, agents);
  let currentAgent = assignedAgentId;
  const visited = new Set();

  while (roster.agents[currentAgent] && roster.agents[currentAgent].status === "ooo") {
    if (visited.has(currentAgent)) return "Unassigned";
    visited.add(currentAgent);
    currentAgent = roster.agents[currentAgent].backup || "Unassigned";
  }

  return currentAgent;
}

export async function setAgentAvailability(state, req, input = {}) {
  const roster = await readRoster(req, state.agents || []);
  const agent = input.agentId || input.agentName;
  if (!agent) return null;

  if (!roster.agents[agent]) {
    roster.agents[agent] = { status: "active", backup: null, scheduled_return: null };
  }

  if (input.goOutOfOffice) {
    roster.agents[agent].status = "ooo";
    roster.agents[agent].backup = input.backupAgentId || roster.agents[agent].backup || "Unassigned";
    roster.agents[agent].scheduled_return = input.scheduledReturn || input.scheduled_return || null;
  } else {
    roster.agents[agent].status = "active";
    roster.agents[agent].scheduled_return = null;
  }

  state.roster = await writeRoster(req, roster);
  state.agents = attachRosterToAgents(state.agents || [], state.roster);
  addHistory(
    state,
    agent,
    input.goOutOfOffice
      ? `${agent} is out of office. New assigned work routes to ${roster.agents[agent].backup || "Unassigned"}.`
      : `${agent} is active again and can receive assigned work.`,
    input.goOutOfOffice ? "yellow" : "green"
  );
  return roster.agents[agent];
}

export function updateAutomationTask(state, taskId, action) {
  state.tasks = (state.tasks || []).map((task, index) => normalizeAutomationTask(task, index));
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return null;

  const selected = (state.cases || []).find((item) => item.id === task.caseId);
  const customer = findCustomer(state, task.customerEmail || selected?.customerEmail);

  if (action === "run") {
    task.status = "Running";
    if (selected) {
      selected.timeline.push({
        time: timestamp(),
        stage: "Automation task running",
        detail: `${task.title}. Next step: ${task.nextStep}`,
        status: taskStatusClass(task)
      });
      addCaseMessage(selected, "Intelligence automation", `${task.title}. ${task.nextStep}`, "Internal task");
    }
    addHistory(state, customer.name, `Automation task running: ${task.title}.`, taskStatusClass(task));
  }

  if (action === "complete") {
    task.status = "Completed";
    task.completedAt = timestamp();
    if (selected) {
      selected.timeline.push({
        time: timestamp(),
        stage: "Automation task completed",
        detail: `${task.title} was completed and kept with the case history.`,
        status: "green"
      });
      addCaseMessage(selected, "Intelligence automation", `Completed task: ${task.title}.`, "Internal task");
    }
    addHistory(state, customer.name, `Automation task completed: ${task.title}.`, "green");
  }

  return task;
}

function makeCase(id, title, customerEmail, message, channel, queue, context, riskLabel, sentiment) {
  const caseNo = {
    billing: "CL-0001",
    gift: "CL-0002",
    stale: "CL-0003"
  }[id] || id;
  return {
    id,
    caseNo,
    title,
    customerEmail,
    message,
    channel,
    queue,
    context,
    reply: "",
    status: "Received",
    risk: riskLabel.toLowerCase(),
    sentiment,
    createdAt: timestamp(),
    firstResponseAt: "",
    closedAt: "",
    assignedTo: id === "billing" ? "Priya S." : "Unassigned",
    messages: [
      { time: timestamp(), speaker: "Customer", channel, body: message }
    ],
    timeline: [{ time: timestamp(), stage: "Received", detail: message, status: riskLabel.toLowerCase() }]
  };
}

export function nextCaseNo(state) {
  const numbers = (state.cases || [])
    .map((item) => Number(String(item.caseNo || "").replace(/\D/g, "")))
    .filter((number) => Number.isFinite(number));
  return `CL-${String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, "0")}`;
}

export function normalizeCaseRecord(item, index = 0) {
  item.caseNo = item.caseNo || `CL-${String(index + 1).padStart(4, "0")}`;
  item.createdAt = item.createdAt || timestamp();
  item.assignedTo = item.assignedTo || (index === 0 ? "Priya S." : "Unassigned");
  item.firstResponseAt = item.firstResponseAt || (["Sent", "Closed"].includes(item.status) ? timestamp() : "");
  item.closedAt = item.closedAt || (item.status === "Closed" ? timestamp() : "");
  item.messages = Array.isArray(item.messages) && item.messages.length
    ? item.messages
    : [
        { time: "Created", speaker: "Customer", channel: item.channel || "Chat", body: item.message || "Customer message received." },
        ...(item.reply ? [{ time: "Draft", speaker: "Intelligence AI", channel: "Suggested reply", body: item.reply }] : [])
      ];
  return item;
}

export function addCaseMessage(item, speaker, body, channel = item.channel || "Internal") {
  normalizeCaseRecord(item);
  item.messages.push({ time: timestamp(), speaker, channel, body });
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || fallbackWorkspaceId;
}
