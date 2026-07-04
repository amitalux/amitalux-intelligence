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

const reportMetrics = {
  overallStatus: "Yellow",
  overallSummary:
    "Queue volume is manageable, but two billing cases and one stale CRM conflict need admin attention before the end of day.",
  volumeTotal: 86,
  volumeChange: "Up 18% from yesterday. Most of the increase is chat and billing email.",
  queueTotal: 14,
  queueSummary: "6 open chat conversations, 5 email cases, 2 phone callbacks, 1 admin data review.",
  queueRisk: "Yellow queue",
  csatScore: "91%",
  csatChange: "Down 3 points from last week because billing replies are taking longer.",
  csatRisk: "Watch billing",
  volumeLabel: "86 total"
};

const volumeByChannel = [
  { label: "Chat", count: 34, status: "yellow" },
  { label: "Email", count: 27, status: "yellow" },
  { label: "SMS", count: 16, status: "green" },
  { label: "Phone", count: 9, status: "green" }
];

const queueItems = [
  { name: "Billing questions", count: 6, age: "Oldest: 42 min", status: "red", action: "Route one case to admin." },
  { name: "Order updates", count: 4, age: "Oldest: 18 min", status: "yellow", action: "AI can draft first replies." },
  { name: "Schedule changes", count: 3, age: "Oldest: 9 min", status: "green", action: "Safe for AI assist." },
  { name: "Data review", count: 1, age: "Oldest: 2 hr", status: "red", action: "Admin needs to verify stale CRM stage." }
];

const dashboardCards = [
  { id: "health", label: "Service health", status: "yellow" },
  { id: "volume", label: "Volume", status: "yellow" },
  { id: "queue", label: "Queue pressure", status: "red" },
  { id: "csat", label: "CSAT", status: "yellow" },
  { id: "first-response", label: "First response", status: "green" },
  { id: "agent-load", label: "Agent load", status: "yellow" },
  { id: "escalations", label: "Escalations", status: "red" },
  { id: "automation", label: "Automation", status: "yellow" },
  { id: "data-health", label: "Data health", status: "red" },
  { id: "privacy", label: "Privacy", status: "green" }
];

const dashboardPresets = {
  supervisor: ["health", "queue", "csat", "first-response", "agent-load", "escalations"],
  admin: ["health", "automation", "data-health", "privacy", "queue", "escalations"],
  executive: ["health", "volume", "csat", "queue", "automation", "data-health"]
};

let activeDashboardPreset = "supervisor";
let visibleDashboardCards = [...dashboardPresets.supervisor];

const agentReports = [
  {
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

const csatBreakdown = [
  { label: "Clear answer", score: "96%", status: "green" },
  { label: "Speed", score: "88%", status: "yellow" },
  { label: "Billing confidence", score: "81%", status: "red" },
  { label: "Personal tone", score: "97%", status: "green" }
];

const caseProgression = [
  { stage: "Received", detail: "Email arrived from Maya about late fee.", time: "9:14 AM", status: "green" },
  { stage: "Recognized", detail: "Customer matched by email. Square and Salesforce context attached.", time: "9:14 AM", status: "green" },
  { stage: "Sensed", detail: "AI detected frustration because the customer already asked yesterday.", time: "9:15 AM", status: "yellow" },
  { stage: "Action ready", detail: "Recommended fee reversal, written confirmation, and owner follow-up.", time: "9:16 AM", status: "yellow" },
  { stage: "Pending resolution", detail: "Waiting for admin approval before Amitalux Intelligence sends the final repair message.", time: "Now", status: "red" }
];

const historyEvents = [
  { time: "Today 9:16 AM", customer: "Maya Thompson", event: "AI prepared billing repair response", status: "yellow" },
  { time: "Today 9:12 AM", customer: "Jordan Lee", event: "Schedule question resolved by SMS", status: "green" },
  { time: "Today 8:58 AM", customer: "Sophia Patel", event: "Gift note case reopened for personal repair", status: "yellow" },
  { time: "Yesterday 4:31 PM", customer: "Maya Thompson", event: "Billing review promised by front desk", status: "red" },
  { time: "Yesterday 2:05 PM", customer: "Admin", event: "Salesforce stage conflict detected", status: "red" }
];

const useCases = [
  {
    id: "billing",
    type: "Frustrated customer",
    title: "Late fee after rescheduling",
    status: "Yellow",
    customerEmail: "maya@example.com",
    incomingMessage: "I already asked about this fee yesterday and I still do not have a real answer.",
    summary:
      "Maya arrives through email with a billing issue that already has history. Amitalux Intelligence recognizes the repeat contact, senses frustration, and prevents the agent from making her restart the story.",
    context: "Gold member. Recent Square payment and rescheduled booking are attached to the case.",
    queue: "Billing queue moves to yellow",
    queueDetail: "The case needs same-day ownership because a promise was already made yesterday.",
    action: "Repair response ready",
    actionDetail: "Amitalux Intelligence recommends reversing the fee, confirming it in writing, and logging the promise for follow-up.",
    reply:
      "Hi Maya, I can see why this has been frustrating. You reached out yesterday and you should not have to explain the same fee issue again. I found the rescheduled booking and the billing note. I am going to move this to a real resolution now, starting with a review of the late fee and written confirmation once it is corrected.",
    timeline: [
      { time: "9:14 AM", stage: "Email received", detail: "Customer asks about the fee again.", status: "yellow" },
      { time: "9:14 AM", stage: "Customer matched", detail: "Square payment, booking, and Salesforce owner are attached.", status: "green" },
      { time: "9:15 AM", stage: "Frustration detected", detail: "Amitalux Intelligence sees repeat contact and lack of answer.", status: "yellow" },
      { time: "9:16 AM", stage: "Repair plan", detail: "Fee reversal and written confirmation are recommended.", status: "yellow" },
      { time: "Next", stage: "Admin approval", detail: "A human approves the credit before the final message sends.", status: "red" }
    ],
    learning: [
      { label: "Customer memory", detail: "Maya needs direct answers and same-day confirmation for billing changes.", status: "green" },
      { label: "Process improvement", detail: "Billing promises should trigger an automatic follow-up timer.", status: "yellow" },
      { label: "Report impact", detail: "Billing confidence is marked as a CSAT risk until the case closes.", status: "yellow" }
    ]
  },
  {
    id: "gift",
    type: "Experience repair",
    title: "Gift note missing from order",
    status: "Green",
    customerEmail: "sophia@example.com",
    incomingMessage: "The gift arrived, but the note was missing. It was the whole reason I ordered it.",
    summary:
      "Sophia is not only asking about fulfillment. She is telling the business the emotional purpose of the order was missed. Amitalux Intelligence helps the agent repair the moment personally.",
    context: "First purchase. Square order is attached, but no CRM owner has been assigned.",
    queue: "Order queue stays green",
    queueDetail: "The issue is clear and can be handled quickly with the right repair option.",
    action: "Personal repair suggested",
    actionDetail: "Amitalux Intelligence recommends a handwritten card, a personal apology, and a packing checklist update.",
    reply:
      "Hi Sophia, I am sorry the note was missing. That was not a small detail. It was part of why the gift mattered. I found your order and I can help make this feel more personal. We can send a handwritten card for you and make sure this is added to our packing review so it does not happen again.",
    timeline: [
      { time: "8:58 AM", stage: "Email received", detail: "Customer explains the gift note was missing.", status: "yellow" },
      { time: "8:59 AM", stage: "Order matched", detail: "Square order and gift bundle are attached.", status: "green" },
      { time: "9:00 AM", stage: "Emotion understood", detail: "Amitalux Intelligence classifies the issue as experience repair, not basic fulfillment.", status: "green" },
      { time: "9:02 AM", stage: "Resolution ready", detail: "Handwritten card and personal apology are suggested.", status: "green" }
    ],
    learning: [
      { label: "Customer memory", detail: "Sophia values polished communication when gifts are involved.", status: "green" },
      { label: "Business action", detail: "Packing checklist should require gift-note confirmation.", status: "green" },
      { label: "Report impact", detail: "First-purchase recovery is tracked as a retention opportunity.", status: "green" }
    ]
  },
  {
    id: "stale",
    type: "Admin data risk",
    title: "CRM stage conflicts with Square activity",
    status: "Red",
    customerEmail: "jordan@example.com",
    incomingMessage: "Can you confirm if the 5:30 class moved? I got two different messages.",
    summary:
      "Jordan has a simple schedule question, but Amitalux Intelligence also notices that Square shows active bookings while the CRM says renewal candidate. The customer gets a fast answer while the admin gets a data alert.",
    context: "Active Square booking. Salesforce lifecycle stage may be outdated.",
    queue: "Data review becomes red",
    queueDetail: "The customer can be helped now, but admin must correct the record before renewal messaging.",
    action: "Answer customer and alert admin",
    actionDetail: "Amitalux Intelligence sends a short schedule confirmation and creates a stale-data review task.",
    reply:
      "Hi Jordan, I checked the schedule and the 5:30 class is still on for today. I can see why the two messages were confusing. I am flagging the duplicate schedule notice now so the team can correct it, but you are confirmed for 5:30.",
    timeline: [
      { time: "9:12 AM", stage: "SMS received", detail: "Customer asks about conflicting schedule messages.", status: "yellow" },
      { time: "9:12 AM", stage: "Booking verified", detail: "Square confirms the 5:30 class booking.", status: "green" },
      { time: "9:13 AM", stage: "Customer answered", detail: "Short SMS confirmation is prepared.", status: "green" },
      { time: "9:13 AM", stage: "Data conflict found", detail: "Salesforce stage conflicts with current activity.", status: "red" },
      { time: "Next", stage: "Admin alert", detail: "Lifecycle stage and SMS consent need review.", status: "red" }
    ],
    learning: [
      { label: "Customer memory", detail: "Jordan prefers short SMS replies for same-day schedule questions.", status: "green" },
      { label: "Admin alert", detail: "CRM lifecycle stage needs verification before any renewal campaign.", status: "red" },
      { label: "Report impact", detail: "Data health queue increases and stale-record risk is marked high.", status: "red" }
    ]
  }
];

const liveCases = useCases.map((useCase, index) => ({
  id: useCase.id,
  caseNo: `CL-${String(index + 1).padStart(4, "0")}`,
  title: useCase.title,
  customerEmail: useCase.customerEmail,
  message: useCase.incomingMessage,
  channel: index === 2 ? "SMS" : "Email",
  queue: useCase.queue,
  context: useCase.context,
  reply: useCase.reply,
  status: "Received",
  risk: useCase.status.toLowerCase(),
  sentiment: useCase.type,
  messages: [
    { time: "Now", speaker: "Customer", channel: index === 2 ? "SMS" : "Email", body: useCase.incomingMessage },
    { time: "Draft", speaker: "Intelligence AI", channel: "Suggested reply", body: useCase.reply }
  ],
  timeline: [{ time: "Now", stage: "Received", detail: useCase.summary, status: useCase.status.toLowerCase() }]
}));

let automationTasks = [
  {
    id: "task-maya-confirmation",
    type: "SLA watch",
    title: "Confirm Maya's billing review in writing",
    caseId: "billing",
    customerEmail: "maya@example.com",
    owner: "Priya S.",
    due: "Today 4:00 PM",
    priority: "red",
    status: "Open",
    detail: "A billing promise was already made. Amitalux Intelligence should make sure the customer gets a clear written update today.",
    nextStep: "Review the fee, send confirmation, and log the promise against the case."
  },
  {
    id: "task-jordan-stale",
    type: "Data health",
    title: "Review Jordan's CRM stage before renewal outreach",
    caseId: "stale",
    customerEmail: "jordan@example.com",
    owner: "Admin",
    due: "Today 5:00 PM",
    priority: "red",
    status: "Open",
    detail: "Square shows active bookings while the CRM says renewal candidate. Renewal messaging should wait until this is corrected.",
    nextStep: "Verify Square activity, update Salesforce, and confirm SMS consent."
  },
  {
    id: "task-sophia-repair",
    type: "Experience repair",
    title: "Check that Sophia's handwritten card was offered",
    caseId: "gift",
    customerEmail: "sophia@example.com",
    owner: "Marcus J.",
    due: "Tomorrow 10:00 AM",
    priority: "yellow",
    status: "Open",
    detail: "The issue is emotional, not only fulfillment. Amitalux Intelligence should verify that the personal repair option was not missed.",
    nextStep: "Confirm whether the card was sent and update the packing checklist."
  }
];

const phoneCallStages = [
  {
    status: "Ready",
    tone: "Concerned",
    urgency: "Watch",
    toneWidth: "48%",
    voice: "Neutral",
    voiceEffect: "Customer still guarded",
    voiceWidth: "44%",
    transcript: [
      { speaker: "Customer", text: "I am calling because I still have this late fee and I already asked about it yesterday." },
      { speaker: "Agent", text: "I can look that up for you. Can I confirm the email on the account?" }
    ],
    notes:
      "Customer is calling about a repeated billing issue. They mention they already asked yesterday, so the agent should not make them restart the story.",
    coaching: [
      { label: "Acknowledge repeat effort", detail: "Start by saying the customer should not have to explain the same issue again.", status: "yellow" },
      { label: "Use known context", detail: "Pull the rescheduled booking and billing note before asking another question.", status: "green" }
    ],
    nextAction: "Acknowledge first",
    summary: "Customer called about a late fee after rescheduling and signaled repeat-contact frustration.",
    memory: "Maya becomes more frustrated when asked to repeat details already shared."
  },
  {
    status: "Monitoring",
    tone: "Frustrated",
    urgency: "High priority",
    toneWidth: "84%",
    voice: "Too procedural",
    voiceEffect: "Customer tension increased",
    voiceWidth: "72%",
    transcript: [
      { speaker: "Customer", text: "That is the same thing I was told yesterday. I need someone to actually fix it." },
      { speaker: "Agent", text: "I understand. Let me check the policy and see what options are available." }
    ],
    notes:
      "Customer frustration increased after hearing a process-focused answer. Amitalux Intelligence should coach the agent to move from policy language to ownership and a concrete repair path.",
    coaching: [
      { label: "Shift voice", detail: "Use a calmer, lower-pressure tone and avoid policy-first language.", status: "red" },
      { label: "Take ownership", detail: "Say what will happen now: review the fee, confirm the credit path, and send written confirmation.", status: "yellow" },
      { label: "Protect CSAT", detail: "This call should be marked as billing confidence risk until resolved.", status: "yellow" }
    ],
    nextAction: "Take ownership",
    summary: "Customer reacted negatively to procedural language and asked for a real fix.",
    memory: "For billing calls, Maya responds better to ownership language than policy explanations."
  },
  {
    status: "Stabilizing",
    tone: "Calming",
    urgency: "Recovering",
    toneWidth: "38%",
    voice: "Warm and accountable",
    voiceEffect: "Customer tension decreased",
    voiceWidth: "86%",
    transcript: [
      { speaker: "Agent", text: "You are right. You already asked us to look at this. I found the rescheduled booking and I am going to move the late fee review forward now." },
      { speaker: "Customer", text: "Thank you. I just wanted someone to actually look at it and tell me what happens next." }
    ],
    notes:
      "Agent used ownership language and the customer calmed down. Next step is written confirmation after the fee review, with a follow-up task so the promise is not missed.",
    coaching: [
      { label: "Confirm next step", detail: "Give one clear action and time expectation before ending the call.", status: "green" },
      { label: "Create follow-up", detail: "Log written confirmation as a required follow-up task.", status: "green" },
      { label: "Update memory", detail: "Remember that ownership language reduced frustration during phone support.", status: "green" }
    ],
    nextAction: "Confirm in writing",
    summary: "Agent changed tone, acknowledged prior effort, and customer calmed after hearing a concrete next step.",
    memory: "Maya responds well when the agent acknowledges prior effort and gives one specific next step."
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let activeCustomer = customers[0];
let activeUseCase = useCases[0];
let activeAgentName = agentReports[0].name;
let activeLiveCaseId = liveCases[0].id;
let activeHistoryCaseId = liveCases[0].id;
let activePhoneStage = 0;
let phoneMonitorStarted = false;
let memoryLedger = customers.map((customer) => customer.memoryLine);
let liveHistory = [{ time: "Now", customer: "Amitalux Intelligence", event: "Live demo started with three incoming cases.", status: "green" }];
let handledCount = 0;
let sentCount = 0;
let csatScore = 91;
let backendOnline = false;
let currentWorkspaceId = "demo-business";
let currentRole = "owner";
let roster = {
  agents: {
    "Priya S.": { status: "active", backup: "Elena R.", scheduled_return: null },
    "Elena R.": { status: "ooo", backup: "Marcus J.", scheduled_return: "2026-07-05T17:00:00Z" },
    "Marcus J.": { status: "active", backup: "Priya S.", scheduled_return: null }
  }
};
let latestEmailIntake = null;

function showAppStatus(message, tone = "yellow") {
  let status = $("[data-app-status]");
  if (!status) {
    status = document.createElement("div");
    status.dataset.appStatus = "";
    status.className = "app-status";
    document.body.prepend(status);
  }
  status.textContent = message;
  status.className = `app-status ${tone}`;
  window.setTimeout(() => {
    status.textContent = "";
    status.className = "app-status";
  }, 4200);
}

function timestamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function caseAgeLabel(item) {
  if (item.status === "Closed") return item.closedAt ? `Closed ${item.closedAt}` : "Closed";
  if (item.createdAt) return `Opened ${item.createdAt}`;
  return "Opened in demo";
}

function taskStatusClass(task) {
  if (task.status === "Completed") return "green";
  if (task.priority === "red") return "red";
  if (task.priority === "yellow" || task.status === "Running") return "yellow";
  return "green";
}

function agentAvailability(agentName) {
  return roster.agents?.[agentName] || { status: "active", backup: "Unassigned", scheduled_return: null };
}

function resolveAvailableAgentLocal(agentName) {
  if (!agentName || agentName === "Unassigned") return "Unassigned";
  let current = agentName;
  const visited = new Set();

  while (agentAvailability(current).status === "ooo") {
    if (visited.has(current)) return "Unassigned";
    visited.add(current);
    current = agentAvailability(current).backup || "Unassigned";
  }

  return current;
}

function sanitizeEmailLocal(text) {
  return String(text || "")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_PAYMENT_CARD]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]")
    .replace(/(password|passwd|secret|pwd)\s*[:=]\s*[^\s,;]+/gi, "$1: [REDACTED_CREDENTIAL]");
}

function taskCase(task) {
  return liveCases.find((item) => item.id === task.caseId) || liveCases.find((item) => item.customerEmail === task.customerEmail) || liveCase();
}

function taskCustomer(task) {
  return findCustomer(task.customerEmail || taskCase(task).customerEmail);
}

function dueNowLabel(kind = "follow-up") {
  if (kind === "csat") return "Tomorrow 9:00 AM";
  if (kind === "callback") return "Today 3:00 PM";
  if (kind === "stale") return "Today 5:00 PM";
  return "Today 4:00 PM";
}

function addAutomationTaskLocal(input = {}) {
  const caseItem = input.caseItem || liveCase();
  const customer = input.customer || findCustomer(caseItem.customerEmail);
  const taskType = input.type || "Follow-up";
  const duplicate = automationTasks.find(
    (task) => task.status !== "Completed" && task.caseId === caseItem.id && task.type === taskType
  );

  if (duplicate) return duplicate;

  const task = {
    id: input.id || `task-${Date.now()}-${automationTasks.length}`,
    type: taskType,
    title: input.title || `Follow up on ${caseItem.caseNo}`,
    caseId: caseItem.id,
    customerEmail: customer.email,
    owner: input.owner || caseItem.assignedTo || activeAgentName || "Unassigned",
    due: input.due || dueNowLabel(input.kind),
    priority: input.priority || caseRisk(caseItem),
    status: input.status || "Open",
    detail: input.detail || "Amitalux Intelligence created this task so the next customer promise is not missed.",
    nextStep: input.nextStep || "Review the case, complete the next action, and keep the customer informed.",
    createdAt: timestamp(),
    completedAt: ""
  };

  automationTasks.unshift(task);
  pushHistory(customer.name, `Automation task created: ${task.title}.`, taskStatusClass(task));
  return task;
}

function detectEmotion(message) {
  const text = message.toLowerCase();
  const high = ["still", "again", "real answer", "nobody", "frustrated", "upset", "angry", "third time", "charged"];
  const medium = ["confused", "not sure", "waiting", "help", "issue", "wrong"];
  const highScore = high.filter((word) => text.includes(word)).length;
  const mediumScore = medium.filter((word) => text.includes(word)).length;

  if (highScore >= 2) {
    return {
      label: "Frustrated",
      urgency: "High priority",
      width: "92%",
      reason:
        "The message suggests repeated effort and lack of resolution. Amitalux Intelligence should not send a generic response. The agent should acknowledge the delay and give a concrete action."
    };
  }

  if (highScore || mediumScore >= 2) {
    return {
      label: "Concerned",
      urgency: "Medium priority",
      width: "62%",
      reason:
        "The customer appears unsure and needs clarity. A calm response with one next step is likely enough unless the issue repeats."
    };
  }

  return {
    label: "Neutral",
    urgency: "Normal priority",
    width: "34%",
    reason:
      "The message does not show strong emotional risk. Amitalux Intelligence can answer directly and keep the tone warm."
  };
}

function findCustomer(email) {
  customers.forEach((customer, index) => normalizeCustomer(customer, index));
  return customers.find((customer) => customer.email.toLowerCase() === email.trim().toLowerCase()) || customers[0];
}

function exactCustomer(email) {
  return customers.find((customer) => customer.email.toLowerCase() === String(email).trim().toLowerCase());
}

function customerNumberFor(customer, index = 0) {
  if (customer.customerNo) return customer.customerNo;
  return `CUST-${String(index + 1).padStart(4, "0")}`;
}

function nextCustomerNo() {
  const numbers = customers
    .map((customer) => Number(String(customer.customerNo || "").replace(/\D/g, "")))
    .filter((number) => Number.isFinite(number));
  return `CUST-${String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, "0")}`;
}

function normalizeCustomer(customer, index = 0) {
  customer.customerNo = customerNumberFor(customer, index);
  return customer;
}

function createCustomerRecord(input = {}) {
  const name = (input.name || "New Customer").trim() || "New Customer";
  const email = (input.email || "").trim().toLowerCase();
  const phone = (input.phone || "").trim();
  const channel = (input.channel || "Email").trim() || "Email";
  const firstName = name.split(" ")[0] || "Customer";

  return {
    customerNo: input.customerNo || nextCustomerNo(),
    name,
    email,
    phone,
    tier: "New signup",
    channel,
    value: "New customer",
    consent: `${channel} allowed`,
    memory: `${firstName} just signed up. Confirm preferences before sending sensitive updates.`,
    issue: "New customer signup",
    summary:
      `${name} created a customer profile through the signup flow. Amitalux Intelligence should preserve the record, attach future messages, and avoid making the customer repeat their information.`,
    offered: ["Welcome confirmation can be sent.", "Preferences can be verified."],
    available: ["Create the customer record.", "Send a welcome message.", "Ask one clarifying preference question if needed."],
    square: "Square status: no linked transaction yet.",
    crm: "CRM status: created by Amitalux Intelligence signup flow.",
    memoryLine: `${firstName} is a new customer. Use a warm, clear welcome and verify preferences.`,
    lastVerified: "Today",
    dataHealth: "New record",
    staleRisk: "Low",
    staleReason: "This record was created from the latest customer-provided signup information.",
    adminAction: "No admin action needed unless enrichment fails."
  };
}

function upsertCustomerLocal(input = {}) {
  customers.forEach((customer, index) => normalizeCustomer(customer, index));
  const record = createCustomerRecord(input);
  if (!record.email) return customers[0];

  const existing = exactCustomer(record.email);
  if (existing) {
    Object.assign(existing, {
      ...record,
      customerNo: existing.customerNo || record.customerNo,
      tier: existing.tier === "Gold member" || existing.tier === "Member" ? existing.tier : record.tier,
      value: existing.value && existing.value !== "New customer" ? existing.value : record.value,
      square: existing.square && !existing.square.includes("no linked transaction") ? existing.square : record.square,
      crm: existing.crm && !existing.crm.includes("created by Amitalux Intelligence") ? existing.crm : record.crm
    });
    return existing;
  }

  customers.unshift(record);
  memoryLedger.unshift(record.memoryLine);
  return record;
}

function saveCustomerBackup(record) {
  const backups = JSON.parse(localStorage.getItem("amitaluxIntelligencePendingCustomers") || "[]");
  backups.unshift({ savedAt: new Date().toISOString(), record });
  localStorage.setItem("amitaluxIntelligencePendingCustomers", JSON.stringify(backups.slice(0, 20)));
}

function humanReply(customer, emotion) {
  const rawFirstName = customer.name.split(" ")[0] || "there";
  const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1);
  const rawNextStep = String(customer.available?.[0] || "review the details");
  const nextStep = (rawNextStep.toLowerCase().includes("create the customer record")
    ? "review the details"
    : rawNextStep)
    .replace(/\.$/, "")
    .toLowerCase();

  if (emotion.label === "Frustrated") {
    return `Hi ${firstName}, I am sorry this has taken more effort than it should have. You already asked for help, so I will not make you repeat the story. I am going to ${nextStep} and send you a clear update today.`;
  }

  return `Hi ${firstName}, thanks for reaching out. I am checking this now and will make sure the next step is clear. If another team needs to review it, I will tell you what is happening and when you can expect an update.`;
}

function handoffNote(customer, emotion) {
  return `Customer: ${customer.name}
Customer number: ${customer.customerNo}
Email: ${customer.email}
Preferred channel: ${customer.channel}
Relationship value: ${customer.value}
Emotion detected: ${emotion.label}
Urgency: ${emotion.urgency}

Current issue:
${customer.summary}

Resolutions already offered:
${customer.offered.map((item) => `• ${item}`).join("\n")}

Solutions still available:
${customer.available.map((item) => `• ${item}`).join("\n")}

Business context:
${customer.square}
${customer.crm}

Agent guidance:
Do not ask the customer to repeat the story. Start by acknowledging what already happened. Give one concrete next step and confirm ownership.`;
}

function renderCustomer(customer = activeCustomer) {
  const message = $("[data-message-input]")?.value || "";
  const emotion = detectEmotion(message);
  activeCustomer = customer;

  $("[data-lookup-status]").textContent = "Matched";
  $("[data-customer-name]").textContent = customer.name;
  $("[data-customer-tier]").textContent = customer.tier;
  $("[data-customer-number]").textContent = customer.customerNo;
  $("[data-customer-email]").textContent = customer.email;
  $("[data-channel]").textContent = customer.channel;
  $("[data-value]").textContent = customer.value;
  $("[data-consent]").textContent = customer.consent;
  $("[data-memory]").textContent = customer.memory;
  $("[data-emotion]").textContent = emotion.label;
  $("[data-urgency]").textContent = emotion.urgency;
  $("[data-emotion-reason]").textContent = emotion.reason;
  $("[data-meter]").style.width = emotion.width;
  $("[data-current-issue]").textContent = customer.issue;
  $("[data-issue-summary]").textContent = customer.summary;
  $("[data-offered]").innerHTML = customer.offered.map((item) => `<li>${item}</li>`).join("");
  $("[data-available]").innerHTML = customer.available.map((item) => `<li>${item}</li>`).join("");
  $("[data-handoff-note]").value = handoffNote(customer, emotion);
  $("[data-reply]").value = humanReply(customer, emotion);
}

function renderAgentProfile() {
  const agent = agentReports.find((item) => item.name === activeAgentName) || agentReports[0];
  const availability = agentAvailability(agent.name);
  $("[data-agent-list]").innerHTML = agentReports
    .map(
      (item) => `
        <button class="scenario-button ${item.name === agent.name ? "active" : ""}" data-agent-profile="${item.name}">
          <strong>${item.name}</strong>
          <span>${item.role}</span>
          <p>${item.activeLoad} · ${agentAvailability(item.name).status.toUpperCase()} · ${item.csat} CSAT</p>
        </button>
      `
    )
    .join("");
  $("[data-agent-name]").textContent = agent.name;
  $("[data-agent-role]").textContent = agent.role;
  $("[data-agent-status]").textContent = availability.status === "ooo" ? "ooo" : agent.status;
  $("[data-agent-status]").className = `status-pill ${availability.status === "ooo" ? "yellow" : agent.status}`;
  $("[data-agent-load]").textContent = agent.activeLoad;
  $("[data-agent-availability]").textContent = availability.status === "ooo"
    ? `Out until ${availability.scheduled_return || "not scheduled"}`
    : "Active";
  $("[data-agent-backup-current]").textContent = availability.backup || "Unassigned";
  $("[data-agent-permissions]").textContent = agent.permissions;
  $("[data-agent-tone]").textContent = agent.tone;
  $("[data-agent-coaching]").textContent = agent.coaching;
  $("[data-agent-handled]").textContent = agent.handled;
  $("[data-agent-csat]").textContent = agent.csat;
  $("[data-agent-avg]").textContent = agent.avg;
  $("[data-agent-specialties]").innerHTML = agent.specialties.map((item) => `<li>${item}</li>`).join("");
  $("[data-agent-backup]").innerHTML = agentReports
    .filter((item) => item.name !== agent.name)
    .map((item) => `<option ${availability.backup === item.name ? "selected" : ""}>${item.name}</option>`)
    .join("");
  $("[data-agent-return]").value = availability.scheduled_return || "2026-07-05T17:00:00Z";
}

function renderCustomerProfile(customer = activeCustomer) {
  const selected = liveCase();
  const profileCustomer = findCustomer(selected.customerEmail) || customer;
  $("[data-profile-customer-name]").textContent = profileCustomer.name;
  $("[data-profile-customer-tier]").textContent = profileCustomer.tier;
  $("[data-profile-customer-number]").textContent = profileCustomer.customerNo;
  $("[data-profile-customer-email]").textContent = profileCustomer.email;
  $("[data-profile-customer-channel]").textContent = profileCustomer.channel;
  $("[data-profile-customer-value]").textContent = profileCustomer.value;
  $("[data-profile-customer-consent]").textContent = profileCustomer.consent;
  $("[data-profile-customer-memory]").textContent = profileCustomer.memory;
  $("[data-profile-customer-square]").textContent = profileCustomer.square;
  $("[data-profile-customer-crm]").textContent = profileCustomer.crm;
  $("[data-profile-customer-issue]").textContent = profileCustomer.issue;
  $("[data-profile-customer-risk]").textContent = caseRisk(selected);
  $("[data-profile-customer-risk]").className = `status-pill ${caseRisk(selected)}`;
  $("[data-profile-customer-summary]").textContent = profileCustomer.summary;
  $("[data-profile-offered-count]").textContent = profileCustomer.offered.length;
  $("[data-profile-available-count]").textContent = profileCustomer.available.length;
  $("[data-profile-data-health]").textContent = profileCustomer.dataHealth;
  $("[data-profile-data-detail]").textContent = profileCustomer.staleReason;
  $("[data-profile-offered]").innerHTML = profileCustomer.offered.map((item) => `<li>${item}</li>`).join("");
  $("[data-profile-available]").innerHTML = profileCustomer.available.map((item) => `<li>${item}</li>`).join("");
}

function renderLists() {
  customers.forEach((customer, index) => normalizeCustomer(customer, index));
  $("[data-customer-list]").innerHTML = customers
    .map(
      (customer) => `
        <button class="customer-row" data-customer-email="${customer.email}">
          <strong>${customer.customerNo} · ${customer.name}</strong>
          <span>${customer.tier}</span>
          <p>${customer.email} · ${customer.channel}</p>
        </button>
      `
    )
    .join("");
  $("[data-memory-ledger]").innerHTML = memoryLedger.map((item) => `<li>${item}</li>`).join("");
  $("[data-stale-alerts]").innerHTML = customers
    .map(
      (customer) => `
        <article class="card alert-card ${customer.staleRisk.toLowerCase()}">
          <div class="card-head">
            <div>
              <span>${customer.dataHealth}</span>
              <h3>${customer.name}</h3>
            </div>
            <strong>${customer.staleRisk} risk</strong>
          </div>
          <dl>
            <div><dt>Last verified</dt><dd>${customer.lastVerified}</dd></div>
            <div><dt>Why Amitalux Intelligence flagged it</dt><dd>${customer.staleReason}</dd></div>
            <div><dt>Admin action</dt><dd>${customer.adminAction}</dd></div>
          </dl>
        </article>
      `
    )
    .join("");
}

function statusClass(status) {
  return status.toLowerCase();
}

function caseNumberFor(item, index = 0) {
  if (item.caseNo) return item.caseNo;
  const numeric = String(index + 1).padStart(4, "0");
  return `CL-${numeric}`;
}

function normalizeCase(item, index = 0) {
  item.caseNo = caseNumberFor(item, index);
  item.createdAt = item.createdAt || timestamp();
  item.assignedTo = item.assignedTo || (index === 0 ? activeAgentName : "Unassigned");
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

function addCaseMessage(item, speaker, body, channel = item.channel || "Internal") {
  normalizeCase(item, liveCases.indexOf(item));
  item.messages.push({ time: timestamp(), speaker, channel, body });
}

function messageHeading(message) {
  const channel = String(message.channel || "").toLowerCase();
  if (channel.includes("suggested") || channel.includes("draft")) return "Suggested customer reply";
  if (message.speaker === "Customer") return `Customer ${message.channel || "message"}`;
  if (channel.includes("phone")) return "Phone support note";
  if (channel.includes("internal")) return "Internal team note";
  return `${message.speaker} ${message.channel || "message"}`;
}

function nextCaseNo() {
  const numbers = liveCases
    .map((item) => Number(String(item.caseNo || "").replace(/\D/g, "")))
    .filter((number) => Number.isFinite(number));
  return `CL-${String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, "0")}`;
}

function liveCase() {
  if (!liveCases.length) {
    const customer = customers[0];
    liveCases.push({
      id: `case-${Date.now()}`,
      caseNo: "CL-0001",
      title: "New customer message",
      customerEmail: customer.email,
      message: "I need help with my account.",
      channel: "Chat",
      queue: "General support",
      context: "Fallback case created so the workspace can keep running.",
      reply: "",
      status: "Received",
      risk: "yellow",
      sentiment: "Concerned",
      messages: [{ time: "Now", speaker: "Customer", channel: "Chat", body: "I need help with my account." }],
      timeline: [{ time: "Now", stage: "Received", detail: "A new customer message entered the queue.", status: "yellow" }]
    });
    activeLiveCaseId = liveCases[0].id;
  }
  return normalizeCase(liveCases.find((item) => item.id === activeLiveCaseId) || liveCases[0], liveCases.findIndex((item) => item.id === activeLiveCaseId));
}

function pushHistory(customer, event, status = "green") {
  liveHistory.unshift({ time: "Now", customer, event, status });
}

function caseRisk(item) {
  if (item.status === "Closed") return "green";
  if (item.status === "Sent") return "yellow";
  if (item.risk === "red") return "red";
  if (item.risk === "yellow" || item.status === "Received") return "yellow";
  return "green";
}

function renderWorkbench() {
  const selected = liveCase();
  const openCases = liveCases.filter((item) => item.status !== "Closed");
  const redCases = openCases.filter((item) => caseRisk(item) === "red").length;
  const yellowCases = openCases.filter((item) => caseRisk(item) === "yellow").length;
  const health = redCases ? "Red" : yellowCases ? "Yellow" : "Green";
  const healthClass = statusClass(health);
  const customer = findCustomer(selected.customerEmail);

  $("[data-live-health]").textContent = health;
  $("[data-live-health]").className = `status-pill ${healthClass}`;
  $("[data-live-health-card]").className = `card status-card ${healthClass}`;
  $("[data-live-health-title]").textContent = `${health} customer care health`;
  $("[data-live-health-summary]").textContent =
    openCases.length === 0
      ? "All cases are closed. Queue is clear and the team can review history or reports."
      : `${openCases.length} cases are still open. ${redCases} need urgent attention and ${yellowCases} should be watched.`;
  $("[data-live-open]").textContent = openCases.length;
  $("[data-live-open-detail]").textContent = `${redCases} red, ${yellowCases} yellow, ${openCases.length - redCases - yellowCases} green.`;
  $("[data-live-handled]").textContent = handledCount;
  $("[data-live-handled-detail]").textContent = `${sentCount} replies sent during this demo.`;
  $("[data-live-csat]").textContent = `${csatScore}%`;
  $("[data-live-csat-detail]").textContent = csatScore >= 94 ? "Improving as cases close." : "Still recovering while urgent cases remain open.";
  $("[data-live-queue-label]").textContent = `${openCases.length} open`;

  $("[data-live-cases]").innerHTML = liveCases
    .map((item, index) => normalizeCase(item, index))
    .map(
      (item) => `
        <button class="case-button ${caseRisk(item)} ${item.status === "Closed" ? "closed" : ""} ${item.id === selected.id ? "active" : ""}" data-live-case="${item.id}">
          <strong>${item.caseNo} · ${item.title}</strong>
          <span>${item.status}</span>
          <p>${findCustomer(item.customerEmail).name} · ${item.channel} · ${item.sentiment}</p>
        </button>
      `
    )
    .join("");

  $("[data-live-case-title]").textContent = `${selected.caseNo} · ${selected.title}`;
  $("[data-live-case-status]").textContent = selected.status;
  $("[data-live-case-status]").className = `status-pill ${caseRisk(selected)}`;
  $("[data-live-case-customer]").textContent = `${customer.name} · ${customer.email}`;
  $("[data-live-case-channel]").textContent = selected.channel;
  $("[data-live-case-sentiment]").textContent = selected.sentiment;
  $("[data-live-case-context]").textContent = selected.context;
  $("[data-live-reply]").value = selected.reply;
  $("[data-live-timeline]").innerHTML = selected.timeline
    .map(
      (step) => `
        <article class="timeline-step ${step.status}">
          <span>${step.time}</span>
          <div>
            <strong>${step.stage}</strong>
            <p>${step.detail}</p>
          </div>
        </article>
      `
    )
    .join("");
  $("[data-live-history]").innerHTML = liveHistory
    .map(
      (event) => `
        <article class="history-row ${event.status}">
          <span>${event.time}</span>
          <strong>${event.customer}</strong>
          <p>${event.event}</p>
        </article>
      `
    )
    .join("");
  renderCustomerProfile(customer);
}

function renderConversation(caseItem) {
  if (!caseItem) return "";
  normalizeCase(caseItem, liveCases.indexOf(caseItem));
  const messages = caseItem.messages.filter((message) => message.body);
  return `
    <div class="case-thread-head">
      <span>${caseItem.caseNo}</span>
      <strong>${caseItem.title}</strong>
      <p>${caseItem.status} · ${caseItem.channel}</p>
    </div>
    ${messages
      .map(
        (message) => `
          <article class="message-bubble ${message.speaker === "Customer" ? "customer" : "agent"}">
            <strong>${messageHeading(message)}</strong>
            <span>${message.time}</span>
            <p>${message.body}</p>
          </article>
        `
      )
      .join("")}
  `;
}

function renderCustomerPortal() {
  const emailInput = $("[data-portal-email]");
  const email = emailInput?.value || activeCustomer.email;
  const customerCases = liveCases.filter((item) => item.customerEmail.toLowerCase() === email.toLowerCase());
  const visibleCases = customerCases.length ? customerCases : liveCases.slice(0, 2);
  const pendingBackups = JSON.parse(localStorage.getItem("amitaluxIntelligencePendingCustomers") || "[]");

  $("[data-signup-backup]").textContent = pendingBackups.length
    ? `${pendingBackups.length} backup customer record${pendingBackups.length === 1 ? "" : "s"} saved in this browser for retry.`
    : "If online sync fails, Amitalux Intelligence keeps a backup customer record in this browser so the business can still help the customer.";

  $("[data-customer-thread-count]").textContent = `${visibleCases.length} thread${visibleCases.length === 1 ? "" : "s"}`;
  $("[data-customer-thread]").innerHTML = visibleCases.map((item) => renderConversation(item)).join("");
  $("[data-customer-emails]").innerHTML = visibleCases
    .map((item, index) => normalizeCase(item, index))
    .map(
      (item) => `
        <article class="email-card">
          <span>${item.caseNo} · ${item.status} · ${item.channel}</span>
          <strong>${item.title}</strong>
          <p><strong>Your message:</strong> ${item.message}</p>
          <p><strong>Business response:</strong> ${item.reply && ["Approved", "Sent", "Closed"].includes(item.status) ? item.reply : "A response is being prepared."}</p>
        </article>
      `
    )
    .join("");
}

function renderEmailIntake() {
  const selectedAgent = $("[data-intake-agent]")?.value || "Priya S.";
  $("[data-intake-agent]").innerHTML = agentReports
    .map((agent) => `<option ${selectedAgent === agent.name ? "selected" : ""}>${agent.name}</option>`)
    .join("");

  if (!latestEmailIntake) {
    $("[data-intake-result-label]").textContent = "Waiting";
    $("[data-intake-case]").textContent = "No email processed yet.";
    $("[data-intake-assigned]").textContent = `${selectedAgent} would route to ${resolveAvailableAgentLocal(selectedAgent)}.`;
    $("[data-intake-tone]").textContent = "Not analyzed";
    $("[data-intake-privacy]").textContent = "Sensitive patterns will be redacted before AI analysis.";
    $("[data-intake-summary]").textContent = "Paste or edit an inbound email and process it.";
    return;
  }

  $("[data-intake-result-label]").textContent = latestEmailIntake.status || "Created";
  $("[data-intake-case]").textContent = `${latestEmailIntake.caseNo} · ${latestEmailIntake.title}`;
  $("[data-intake-assigned]").textContent = `${latestEmailIntake.originallyAssignedTo || selectedAgent} routed to ${latestEmailIntake.assignedTo}`;
  $("[data-intake-tone]").textContent = latestEmailIntake.aiAnalysis?.customerTone || latestEmailIntake.sentiment;
  $("[data-intake-privacy]").textContent = latestEmailIntake.message.includes("[REDACTED_]")
    ? "Sensitive values were redacted before analysis."
    : "No supported sensitive patterns were found.";
  $("[data-intake-summary]").textContent = latestEmailIntake.aiAnalysis?.primaryContextSummary || latestEmailIntake.context;
}

function renderAgentPortal() {
  liveCases.forEach((item, index) => normalizeCase(item, index));
  const openCases = liveCases.filter((item) => item.status !== "Closed");
  if (!openCases.find((item) => item.id === activeLiveCaseId) && openCases[0]) {
    activeLiveCaseId = openCases[0].id;
  }
  const selected = openCases.find((item) => item.id === activeLiveCaseId) || openCases[0];
  if (!selected) {
    $("[data-agent-queue-count]").textContent = "0 open";
    $("[data-agent-unassigned]").textContent = "0";
    $("[data-agent-urgent]").textContent = "0";
    $("[data-agent-assigned]").textContent = "0";
    $("[data-agent-cases]").innerHTML = `<article class="empty-state"><strong>No open conversations</strong><p>Closed tickets are available in Closed Cases.</p></article>`;
    $("[data-agent-case-title]").textContent = "No open ticket selected";
    $("[data-agent-case-status]").textContent = "Clear";
    $("[data-agent-case-status]").className = "status-pill green";
    $("[data-agent-case-customer]").textContent = "";
    $("[data-agent-case-owner]").textContent = "";
    $("[data-agent-case-channel]").textContent = "";
    $("[data-agent-case-sentiment]").textContent = "";
    $("[data-agent-case-context]").textContent = "";
    $("[data-agent-conversation]").innerHTML = "";
    $("[data-agent-reply]").value = "";
    return;
  }
  const customer = findCustomer(selected.customerEmail);
  const unassigned = openCases.filter((item) => item.assignedTo === "Unassigned").length;
  const urgent = openCases.filter((item) => caseRisk(item) === "red").length;
  const assigned = openCases.filter((item) => item.assignedTo === activeAgentName).length;

  $("[data-agent-queue-count]").textContent = `${openCases.length} open`;
  $("[data-agent-unassigned]").textContent = unassigned;
  $("[data-agent-urgent]").textContent = urgent;
  $("[data-agent-assigned]").textContent = assigned;
  $("[data-agent-cases]").innerHTML = openCases
    .map(
      (item) => `
        <button class="case-button ${caseRisk(item)} ${item.status === "Closed" ? "closed" : ""} ${item.id === selected.id ? "active" : ""}" data-agent-case="${item.id}">
          <strong>${item.caseNo} · ${item.title}</strong>
          <span>${item.status}</span>
          <p>${findCustomer(item.customerEmail).name} · ${item.channel} · ${item.assignedTo}</p>
          <small>${caseAgeLabel(item)}</small>
        </button>
      `
    )
    .join("");
  $("[data-agent-case-title]").textContent = `${selected.caseNo} · ${selected.title}`;
  $("[data-agent-case-status]").textContent = selected.status;
  $("[data-agent-case-status]").className = `status-pill ${caseRisk(selected)}`;
  $("[data-agent-case-customer]").textContent = `${customer.customerNo} · ${customer.name} · ${customer.email}`;
  $("[data-agent-case-owner]").textContent = selected.assignedTo;
  $("[data-agent-case-channel]").textContent = selected.channel;
  $("[data-agent-case-sentiment]").textContent = selected.sentiment;
  $("[data-agent-case-context]").textContent = selected.context;
  $("[data-agent-conversation]").innerHTML = renderConversation(selected);
  $("[data-agent-reply]").value = ["Sent", "Closed"].includes(selected.status)
    ? ""
    : selected.reply || humanReply(customer, detectEmotion(selected.message));
}

function renderPhoneMonitor() {
  const selected = liveCase();
  const customer = findCustomer(selected.customerEmail);
  const agent = agentReports.find((item) => item.name === activeAgentName) || agentReports[0];
  const stage = phoneCallStages[activePhoneStage] || phoneCallStages[0];
  const status = phoneMonitorStarted ? stage.status : "Ready";

  $("[data-phone-customer]").textContent = customer.name;
  $("[data-phone-status]").textContent = status;
  $("[data-phone-status]").className = `status-pill ${status === "Monitoring" ? "red" : status === "Stabilizing" ? "green" : "yellow"}`;
  $("[data-phone-case]").textContent = selected.title;
  $("[data-phone-agent]").textContent = `${agent.name} · ${agent.role}`;
  $("[data-phone-consent]").textContent = customer.consent.includes("Phone") ? customer.consent : "Demo consent captured before call monitoring";
  $("[data-phone-tone]").textContent = phoneMonitorStarted ? stage.tone : "Waiting for call";
  $("[data-phone-urgency]").textContent = phoneMonitorStarted ? stage.urgency : "Not started";
  $("[data-phone-tone-detail]").textContent = phoneMonitorStarted
    ? "Amitalux Intelligence is reading word choice, repetition, interruptions, and whether the customer calms down or escalates after the agent speaks."
    : "Start the call monitor to simulate tone detection during a live phone conversation.";
  $("[data-phone-tone-meter]").style.width = phoneMonitorStarted ? stage.toneWidth : "12%";
  $("[data-agent-voice]").textContent = phoneMonitorStarted ? stage.voice : "Waiting";
  $("[data-agent-voice-effect]").textContent = phoneMonitorStarted ? stage.voiceEffect : "No call yet";
  $("[data-agent-voice-detail]").textContent = phoneMonitorStarted
    ? "Amitalux Intelligence compares the agent's response style with the customer's next reaction, then coaches the agent toward language that repairs trust."
    : "During a real implementation, this would use call audio transcription, speaker separation, sentiment, pace, and response analysis.";
  $("[data-agent-voice-meter]").style.width = phoneMonitorStarted ? stage.voiceWidth : "18%";
  $("[data-phone-transcript]").innerHTML = stage.transcript
    .map(
      (line) => `
        <article class="message-bubble ${line.speaker === "Customer" ? "customer" : "agent"}">
          <strong>${line.speaker}</strong>
          <p>${line.text}</p>
        </article>
      `
    )
    .join("");
  $("[data-phone-notes]").value = phoneMonitorStarted
    ? stage.notes
    : "Start call monitoring to let Amitalux Intelligence capture notes, tone, agent voice effect, next steps, and memory updates.";
  $("[data-phone-next-action]").textContent = phoneMonitorStarted ? stage.nextAction : "Start monitor";
  $("[data-phone-coaching]").innerHTML = stage.coaching
    .map(
      (item) => `
        <article class="history-row ${item.status}">
          <span>${item.label}</span>
          <strong>${item.status.toUpperCase()}</strong>
          <p>${item.detail}</p>
        </article>
      `
    )
    .join("");
  $("[data-phone-summary]").textContent = phoneMonitorStarted ? stage.summary : "No call summary yet.";
  $("[data-phone-memory]").textContent = phoneMonitorStarted ? stage.memory : "No memory update yet.";
}

function renderSupervisorPortal() {
  const openCases = liveCases.filter((item) => item.status !== "Closed");
  const redCases = openCases.filter((item) => caseRisk(item) === "red");
  const yellowCases = openCases.filter((item) => caseRisk(item) === "yellow");
  const escalations = openCases.filter((item) => ["red", "yellow"].includes(caseRisk(item)));
  const openTasks = automationTasks.filter((task) => task.status !== "Completed");
  const health = redCases.length ? "Red" : yellowCases.length ? "Yellow" : "Green";
  const healthClass = statusClass(health);
  const priorityCase = escalations[0] || openCases[0] || liveCases[0];

  $("[data-supervisor-health]").textContent = health;
  $("[data-supervisor-health]").className = `status-pill ${healthClass}`;
  $("[data-supervisor-health-card]").className = `card status-card ${healthClass}`;
  $("[data-supervisor-health-title]").textContent = `${health} service health`;
  $("[data-supervisor-health-summary]").textContent = openCases.length
    ? `${openCases.length} open conversations. ${redCases.length} red, ${yellowCases.length} yellow, ${openCases.length - redCases.length - yellowCases.length} green.`
    : "The queue is clear and all customer-facing conversations are closed.";
  $("[data-supervisor-open]").textContent = openCases.length;
  $("[data-supervisor-open-detail]").textContent = `${sentCount} replies sent, ${handledCount} handled in this demo.`;
  $("[data-supervisor-response]").textContent = agentReports[0]?.avg || "4m 20s";
  $("[data-supervisor-response-detail]").textContent = redCases.length ? "Urgent cases need fast first response." : "Response time is within target.";
  $("[data-supervisor-csat]").textContent = `${csatScore}%`;
  $("[data-supervisor-csat-detail]").textContent = csatScore >= 94 ? "Customer sentiment is improving." : "Watch open escalations before CSAT drops.";
  $("[data-supervisor-queue-label]").textContent = `${openCases.length} open`;
  $("[data-supervisor-queue]").innerHTML = openCases.length
    ? openCases
        .map((item, index) => normalizeCase(item, index))
        .map(
          (item) => `
            <article class="queue-row ${caseRisk(item)}">
              <div><strong>${item.caseNo} · ${item.title}</strong><p>${findCustomer(item.customerEmail).name} · ${item.assignedTo || "Unassigned"}</p></div>
              <div><strong>${item.status}</strong><p>${item.channel}</p></div>
            </article>
          `
        )
        .join("")
    : `<article class="empty-state"><strong>No open conversations</strong><p>The supervisor queue is clear.</p></article>`;
  $("[data-supervisor-escalation-label]").textContent = `${escalations.length} watch`;
  $("[data-supervisor-escalations]").innerHTML = escalations.length
    ? escalations
        .map(
          (item) => `
            <article class="queue-row ${caseRisk(item)}">
              <div><strong>${item.caseNo} · ${findCustomer(item.customerEmail).name}</strong><p>${item.context || item.message}</p></div>
              <div><strong>${caseRisk(item).toUpperCase()}</strong><p>${item.sentiment}</p></div>
            </article>
          `
        )
        .join("")
    : `<article class="empty-state"><strong>No escalations</strong><p>Nothing needs supervisor intervention right now.</p></article>`;
  $("[data-supervisor-agents]").innerHTML = agentReports
    .map(
      (agent) => `
        <article class="agent-row ${agent.status}">
          <div><strong>${agent.name}</strong><p>${agent.role} · ${agent.activeLoad}</p></div>
          <dl>
            <div><dt>Handled</dt><dd>${agent.handled}</dd></div>
            <div><dt>CSAT</dt><dd>${agent.csat}</dd></div>
            <div><dt>Avg reply</dt><dd>${agent.avg}</dd></div>
          </dl>
        </article>
      `
    )
    .join("");
  $("[data-supervisor-csat-risk]").textContent = reportMetrics.csatRisk;
  $("[data-supervisor-csat-breakdown]").innerHTML = csatBreakdown
    .map(
      (item) => `
        <div class="score-row">
          <div class="bar-label"><strong>${item.label}</strong><span>${item.score}</span></div>
          <div class="bar-track"><span class="${item.status}" style="width: ${item.score}"></span></div>
        </div>
      `
    )
    .join("");
  $("[data-supervisor-case-status]").textContent = priorityCase?.status || "Clear";
  $("[data-supervisor-case-progression]").innerHTML = priorityCase?.timeline?.length
    ? priorityCase.timeline
        .map(
          (step) => `
            <article class="timeline-step ${step.status}">
              <span>${step.time}</span>
              <div><strong>${step.stage}</strong><p>${step.detail}</p></div>
            </article>
          `
        )
        .join("")
    : `<article class="empty-state"><strong>No active progression</strong><p>Case timelines appear here as work happens.</p></article>`;
  $("[data-supervisor-task-label]").textContent = `${openTasks.length} open`;
  $("[data-supervisor-tasks]").innerHTML = openTasks.length
    ? openTasks.slice(0, 5)
        .map(
          (task) => `
            <article class="queue-row ${taskStatusClass(task)}">
              <div><strong>${task.title}</strong><p>${taskCustomer(task).name} · ${taskCase(task).caseNo}</p></div>
              <div><strong>${task.owner}</strong><p>${task.due}</p></div>
            </article>
          `
        )
        .join("")
    : `<article class="empty-state"><strong>No open promises</strong><p>Follow-up tasks are complete.</p></article>`;
}

function renderAdminPortal() {
  const openCases = liveCases.filter((item) => item.status !== "Closed");
  const redCases = openCases.filter((item) => caseRisk(item) === "red").length;
  const yellowCases = openCases.filter((item) => caseRisk(item) === "yellow").length;
  const health = redCases ? "Red" : yellowCases ? "Yellow" : "Green";
  const healthClass = statusClass(health);

  $("[data-admin-health]").textContent = health;
  $("[data-admin-health]").className = `status-pill ${healthClass}`;
  $("[data-admin-health-card]").className = `card status-card ${healthClass}`;
  $("[data-admin-health-title]").textContent = `${health} workspace health`;
  $("[data-admin-health-summary]").textContent =
    openCases.length === 0
      ? "The workspace is quiet. Admin controls, audit logs, and automations are available."
      : `${openCases.length} open conversations are affecting system load. ${redCases} urgent, ${yellowCases} watch.`;
  $("[data-admin-open]").textContent = openCases.length;
  $("[data-admin-open-detail]").textContent = `${redCases} red, ${yellowCases} yellow, ${openCases.length - redCases - yellowCases} green.`;
  const openTasks = automationTasks.filter((task) => task.status !== "Completed");
  $("[data-admin-handled]").textContent = openTasks.length;
  $("[data-admin-handled-detail]").textContent = "Open automation tasks and system follow-ups.";
  $("[data-admin-csat]").textContent = "On";
  $("[data-admin-csat-detail]").textContent = "Sensitive patterns are scrubbed before AI analysis.";
  $("[data-admin-queue-label]").textContent = `${openCases.length} open`;
  $("[data-admin-queue]").innerHTML = openCases
    .map((item, index) => normalizeCase(item, index))
    .map(
      (item) => `
        <article class="queue-row ${caseRisk(item)}">
          <div><strong>${item.caseNo} · ${item.title}</strong><p>${findCustomer(item.customerEmail).name} · ${item.channel}</p></div>
          <div><strong>${item.status}</strong><p>${item.sentiment}</p></div>
        </article>
      `
    )
    .join("");
  $("[data-admin-agents]").innerHTML = [
    { name: "Agent", role: "Handles assigned customer conversations", handled: "Reply", csat: "View", avg: "Limited", status: "green" },
    { name: "Supervisor", role: "Manages queues, escalations, coaching, and CSAT", handled: "Coach", csat: "Report", avg: "Team", status: "yellow" },
    { name: "Admin", role: "Controls privacy, integrations, data health, and workspace settings", handled: "Govern", csat: "Audit", avg: "Full", status: "green" }
  ]
    .map(
      (role) => `
        <article class="agent-row ${role.status}">
          <div><strong>${role.name}</strong><p>${role.role}</p></div>
          <dl>
            <div><dt>Cases</dt><dd>${role.handled}</dd></div>
            <div><dt>Reports</dt><dd>${role.csat}</dd></div>
            <div><dt>Access</dt><dd>${role.avg}</dd></div>
          </dl>
        </article>
      `
    )
    .join("");
  $("[data-admin-stale]").innerHTML = customers
    .filter((customer) => customer.staleRisk !== "Low")
    .map(
      (customer) => `
        <article class="queue-row ${customer.staleRisk.toLowerCase() === "high" ? "red" : "yellow"}">
          <div><strong>${customer.name}</strong><p>${customer.staleReason}</p></div>
          <div><strong>${customer.staleRisk}</strong><p>${customer.adminAction}</p></div>
        </article>
      `
    )
    .join("");
  $("[data-admin-automation-label]").textContent = `${openTasks.length} open`;
  $("[data-admin-automation]").innerHTML = openTasks.length
    ? openTasks.slice(0, 4)
        .map((task) => `
          <article class="queue-row ${taskStatusClass(task)}">
            <div><strong>${task.title}</strong><p>${taskCustomer(task).name} · ${taskCase(task).caseNo}</p></div>
            <div><strong>${task.status}</strong><p>${task.due}</p></div>
          </article>
        `)
        .join("")
    : `<article class="empty-state"><strong>No open tasks</strong><p>Automation tasks are complete.</p></article>`;
  $("[data-admin-history]").innerHTML = liveHistory
    .slice(0, 8)
    .map(
      (event) => `
        <article class="history-row ${event.status}">
          <span>${event.time}</span>
          <strong>${event.customer}</strong>
          <p>${event.event}</p>
        </article>
      `
    )
    .join("");
}

function renderAutomations() {
  const openTasks = automationTasks.filter((task) => task.status !== "Completed");
  const completedTasks = automationTasks.filter((task) => task.status === "Completed");
  const highTasks = openTasks.filter((task) => task.priority === "red");
  const runningTasks = openTasks.filter((task) => task.status === "Running");
  const health = highTasks.length ? "Red" : openTasks.length ? "Yellow" : "Green";
  const healthClass = statusClass(health);

  $("[data-automation-health]").textContent = health;
  $("[data-automation-health]").className = `status-pill ${healthClass}`;
  $("[data-automation-health-card]").className = `card status-card ${healthClass}`;
  $("[data-automation-health-title]").textContent = `${health} automation health`;
  $("[data-automation-health-summary]").textContent = openTasks.length
    ? `${openTasks.length} tasks are open. ${highTasks.length} are high priority and ${runningTasks.length} are currently running.`
    : "All automation tasks are complete. The team can review completed history or keep working the case queue.";
  $("[data-automation-open]").textContent = openTasks.length;
  $("[data-automation-open-detail]").textContent = `${runningTasks.length} running, ${openTasks.length - runningTasks.length} waiting.`;
  $("[data-automation-high]").textContent = highTasks.length;
  $("[data-automation-done]").textContent = completedTasks.length;
  $("[data-automation-queue-label]").textContent = `${openTasks.length} open`;

  $("[data-automation-list]").innerHTML = openTasks.length
    ? openTasks
        .map((task) => {
          const caseItem = taskCase(task);
          const customer = taskCustomer(task);
          return `
            <article class="queue-row ${taskStatusClass(task)}">
              <div>
                <strong>${task.title}</strong>
                <p>${task.type} · ${caseItem.caseNo} · ${customer.customerNo} · ${customer.name}</p>
                <p>${task.detail}</p>
                <p><strong>Next:</strong> ${task.nextStep}</p>
              </div>
              <div class="row-actions">
                <strong>${task.status}</strong>
                <p>Owner: ${task.owner}</p>
                <p>Due: ${task.due}</p>
                <button class="inline-link" data-run-automation="${task.id}">Run task</button>
                <button class="inline-link" data-complete-automation="${task.id}">Complete task</button>
                <button class="inline-link" data-automation-case="${caseItem.id}">Open case</button>
                <button class="inline-link" data-automation-customer="${customer.email}">Open customer</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<article class="empty-state"><strong>No open automation tasks</strong><p>New tasks will appear when a reply is sent, a case closes, phone notes are saved, or stale data is detected.</p></article>`;

  $("[data-automation-completed]").innerHTML = completedTasks.length
    ? completedTasks
        .slice(0, 6)
        .map((task) => `
          <article class="history-row green">
            <span>${task.completedAt || "Completed"}</span>
            <strong>${task.title}</strong>
            <p>${task.type} · ${taskCustomer(task).name} · ${taskCase(task).caseNo}</p>
          </article>
        `)
        .join("")
    : `<article class="empty-state"><strong>No completed tasks yet</strong><p>Complete a task to show how Amitalux Intelligence preserves the automation audit trail.</p></article>`;
}

function historyCase() {
  liveCases.forEach((item, index) => normalizeCase(item, index));
  return liveCases.find((item) => item.id === activeHistoryCaseId) || liveCase();
}

function renderClosedConversations() {
  liveCases.forEach((item, index) => normalizeCase(item, index));
  const closedCases = liveCases.filter((item) => item.status === "Closed");
  $("[data-closed-count]").textContent = `${closedCases.length} closed`;
  $("[data-closed-cases]").innerHTML = closedCases.length
    ? closedCases
        .map(
          (item) => `
            <article class="queue-row green">
              <div>
                <strong>${item.caseNo} · ${item.title}</strong>
                <p>${findCustomer(item.customerEmail).customerNo} · ${findCustomer(item.customerEmail).name} · ${caseAgeLabel(item)}</p>
              </div>
              <div class="row-actions">
                <strong>${item.assignedTo}</strong>
                <button class="inline-link" data-case-history="${item.id}">Open history</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<article class="empty-state"><strong>No closed cases yet</strong><p>When an agent closes a case, it moves here instead of staying in the active queue.</p></article>`;
}

function renderTicketHistory() {
  const selected = historyCase();
  const customer = findCustomer(selected.customerEmail);
  $("[data-history-case-title]").textContent = `${selected.caseNo} · ${selected.title}`;
  $("[data-history-case-summary]").textContent = "This page keeps the long audit trail out of the agent workspace while preserving every case event.";
  $("[data-history-case-status]").textContent = selected.status;
  $("[data-history-case-status]").className = `status-pill ${caseRisk(selected)}`;
  $("[data-history-case-no]").textContent = selected.caseNo;
  $("[data-history-customer]").textContent = `${customer.customerNo} · ${customer.name} · ${customer.email}`;
  $("[data-history-created]").textContent = selected.createdAt || "Unknown";
  $("[data-history-first-response]").textContent = selected.firstResponseAt || "Not sent yet";
  $("[data-history-closed]").textContent = selected.closedAt || "Still open";
  $("[data-history-conversation]").innerHTML = renderConversation(selected);
  $("[data-history-timeline]").innerHTML = selected.timeline
    .map(
      (step) => `
        <article class="timeline-step ${step.status}">
          <span>${step.time}</span>
          <div>
            <strong>${step.stage}</strong>
            <p>${step.detail}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function syncReportsFromWorkbench() {
  const openCases = liveCases.filter((item) => item.status !== "Closed");
  const redCases = openCases.filter((item) => caseRisk(item) === "red").length;
  const yellowCases = openCases.filter((item) => caseRisk(item) === "yellow").length;
  reportMetrics.overallStatus = redCases ? "Red" : yellowCases ? "Yellow" : "Green";
  reportMetrics.overallSummary =
    openCases.length === 0
      ? "The live queue is clear. Cases handled in the workbench are reflected in history and CSAT."
      : `${openCases.length} cases remain open after live workbench activity. ${redCases} are red and ${yellowCases} are yellow.`;
  reportMetrics.queueTotal = openCases.length;
  reportMetrics.queueSummary = `${openCases.length} active cases, ${sentCount} replies sent, ${handledCount} handled in the current demo.`;
  reportMetrics.csatScore = `${csatScore}%`;
  reportMetrics.csatChange = csatScore >= 94 ? "Improving after case closures." : "Needs attention until urgent cases close.";
  historyEvents.splice(0, historyEvents.length, ...liveHistory.slice(0, 5));
}

function updateSelectedCase(mutator) {
  const selected = liveCase();
  const customer = findCustomer(selected.customerEmail);
  mutator(selected, customer);
  syncReportsFromWorkbench();
  renderWorkbench();
  renderReports();
  renderCustomDashboard();
  renderSupervisorPortal();
  renderAdminPortal();
  renderLists();
  renderAgentProfile();
  renderCustomerProfile(customer);
}

function applyBackendState(state) {
  if (!state) return;
  if (Array.isArray(state.customers)) customers.splice(0, customers.length, ...state.customers);
  customers.forEach((customer, index) => normalizeCustomer(customer, index));
  if (Array.isArray(state.agents)) agentReports.splice(0, agentReports.length, ...state.agents);
  if (Array.isArray(state.cases)) liveCases.splice(0, liveCases.length, ...state.cases);
  if (Array.isArray(state.tasks)) automationTasks.splice(0, automationTasks.length, ...state.tasks);
  if (state.roster?.agents) roster = state.roster;
  if (Array.isArray(state.history)) liveHistory = state.history;
  if (state.metrics) {
    handledCount = state.metrics.handledCount || 0;
    sentCount = state.metrics.sentCount || 0;
    csatScore = state.metrics.csatScore || 91;
  }
  if (!liveCases.find((item) => item.id === activeLiveCaseId) && liveCases[0]) {
    activeLiveCaseId = liveCases[0].id;
  }
  memoryLedger = customers.map((customer) => customer.memoryLine);
  syncReportsFromWorkbench();
}

function renderEverything() {
  renderCustomDashboard();
  renderCustomerPortal();
  renderEmailIntake();
  renderAgentPortal();
  renderClosedConversations();
  renderTicketHistory();
  renderPhoneMonitor();
  renderAutomations();
  renderSupervisorPortal();
  renderAdminPortal();
  renderWorkbench();
  renderReports();
  renderCustomer(activeCustomer);
  renderLists();
  renderUseCase(activeUseCase);
  renderAgentProfile();
  renderCustomerProfile(activeCustomer);
}

async function loadBackendState() {
  try {
    const response = await fetch("/api/state", { headers: workspaceHeaders() });
    if (!response.ok) throw new Error("Backend unavailable");
    const state = await response.json();
    backendOnline = true;
    applyBackendState(state);
  } catch (error) {
    backendOnline = false;
  }
  renderEverything();
}

async function postBackendAction(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...workspaceHeaders() },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error("Backend action failed");
  const state = await response.json();
  backendOnline = true;
  applyBackendState(state);
  renderEverything();
}

function workspaceHeaders() {
  return {
    "x-amitalux-workspace": currentWorkspaceId,
    "x-amitalux-role": currentRole
  };
}

async function performCaseAction(action, payload = {}) {
  if (backendOnline) {
    try {
      await postBackendAction(`/api/cases/${liveCase().id}/action`, { action, ...payload });
      return;
    } catch (error) {
      backendOnline = false;
      showAppStatus("Online sync paused. The demo is still working in this browser.", "yellow");
    }
  }

  const actionButton = {
    analyze: "[data-run-ai]",
    approve: "[data-approve-reply]",
    send: "[data-send-reply]",
    close: "[data-close-case]"
  }[action];

  if (actionButton) $(actionButton)?.click();
}

async function createDraftWithApi(selected, customer) {
  try {
    const response = await fetch("/api/ai-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...workspaceHeaders() },
      body: JSON.stringify({ case: selected, customer })
    });

    if (!response.ok) throw new Error("Draft API unavailable");
    return await response.json();
  } catch (error) {
    return {
      reply: selected.reply,
      plan: ["Using local demo draft because the Netlify API is not running in this browser context."],
      source: "local-browser-fallback"
    };
  }
}

function renderReports() {
  $("[data-overall-status]").textContent = reportMetrics.overallStatus;
  $("[data-overall-status]").className = `status-pill ${statusClass(reportMetrics.overallStatus)}`;
  $("[data-health-card]").className = `card status-card ${statusClass(reportMetrics.overallStatus)}`;
  $("[data-overall-summary]").textContent = reportMetrics.overallSummary;
  $("[data-volume-total]").textContent = reportMetrics.volumeTotal;
  $("[data-volume-change]").textContent = reportMetrics.volumeChange;
  $("[data-queue-total]").textContent = reportMetrics.queueTotal;
  $("[data-queue-summary]").textContent = reportMetrics.queueSummary;
  $("[data-queue-risk]").textContent = reportMetrics.queueRisk;
  $("[data-csat-score]").textContent = reportMetrics.csatScore;
  $("[data-csat-change]").textContent = reportMetrics.csatChange;
  $("[data-csat-risk]").textContent = reportMetrics.csatRisk;
  $("[data-volume-label]").textContent = reportMetrics.volumeLabel;

  $("[data-volume-chart]").innerHTML = volumeByChannel
    .map(
      (item) => `
        <div class="bar-row">
          <div class="bar-label"><strong>${item.label}</strong><span>${item.count}</span></div>
          <div class="bar-track"><span class="${item.status}" style="width: ${(item.count / reportMetrics.volumeTotal) * 100}%"></span></div>
        </div>
      `
    )
    .join("");

  $("[data-queue-list]").innerHTML = queueItems
    .map(
      (item) => `
        <article class="queue-row ${item.status}">
          <div><strong>${item.name}</strong><p>${item.age}</p></div>
          <div><strong>${item.count}</strong><p>${item.action}</p></div>
        </article>
      `
    )
    .join("");

  $("[data-agent-report]").innerHTML = agentReports
    .map(
      (agent) => `
        <article class="agent-row ${agent.status}">
          <div><strong>${agent.name}</strong><p>${agent.role}</p></div>
          <dl>
            <div><dt>Handled</dt><dd>${agent.handled}</dd></div>
            <div><dt>CSAT</dt><dd>${agent.csat}</dd></div>
            <div><dt>Avg reply</dt><dd>${agent.avg}</dd></div>
          </dl>
        </article>
      `
    )
    .join("");

  $("[data-csat-breakdown]").innerHTML = csatBreakdown
    .map(
      (item) => `
        <div class="score-row">
          <div class="bar-label"><strong>${item.label}</strong><span>${item.score}</span></div>
          <div class="bar-track"><span class="${item.status}" style="width: ${item.score}"></span></div>
        </div>
      `
    )
    .join("");

  $("[data-case-status]").textContent = "Needs approval";
  $("[data-case-progression]").innerHTML = caseProgression
    .map(
      (step) => `
        <article class="timeline-step ${step.status}">
          <span>${step.time}</span>
          <div>
            <strong>${step.stage}</strong>
            <p>${step.detail}</p>
          </div>
        </article>
      `
    )
    .join("");

  $("[data-history-table]").innerHTML = historyEvents
    .map(
      (event) => `
        <article class="history-row ${event.status}">
          <span>${event.time}</span>
          <strong>${event.customer}</strong>
          <p>${event.event}</p>
        </article>
      `
    )
    .join("");
}

function dashboardMetric(card) {
  const openCases = liveCases.filter((item) => item.status !== "Closed");
  const redCases = openCases.filter((item) => caseRisk(item) === "red");
  const yellowCases = openCases.filter((item) => caseRisk(item) === "yellow");
  const openTasks = automationTasks.filter((task) => task.status !== "Completed");
  const staleCustomers = customers.filter((customer) => customer.staleRisk !== "Low");
  const topLoad = agentReports.reduce((winner, agent) => {
    const load = Number(String(agent.activeLoad || "0").match(/\d+/)?.[0] || 0);
    const winnerLoad = Number(String(winner.activeLoad || "0").match(/\d+/)?.[0] || 0);
    return load > winnerLoad ? agent : winner;
  }, agentReports[0]);

  const metrics = {
    health: {
      value: redCases.length ? "Red" : yellowCases.length ? "Yellow" : "Green",
      detail: openCases.length ? `${openCases.length} open conversations need monitoring.` : "All conversations are closed.",
      status: redCases.length ? "red" : yellowCases.length ? "yellow" : "green"
    },
    volume: {
      value: reportMetrics.volumeTotal,
      detail: reportMetrics.volumeChange,
      status: "yellow"
    },
    queue: {
      value: openCases.length,
      detail: `${redCases.length} red, ${yellowCases.length} yellow, ${openCases.length - redCases.length - yellowCases.length} green.`,
      status: redCases.length ? "red" : yellowCases.length ? "yellow" : "green"
    },
    csat: {
      value: `${csatScore}%`,
      detail: csatScore >= 94 ? "Improving after recent resolutions." : "Watch escalations before sentiment drops.",
      status: csatScore >= 94 ? "green" : "yellow"
    },
    "first-response": {
      value: agentReports[0]?.avg || "4m 20s",
      detail: redCases.length ? "Prioritize urgent first replies." : "Within target for current queue.",
      status: redCases.length ? "yellow" : "green"
    },
    "agent-load": {
      value: topLoad?.activeLoad || "0 active cases",
      detail: `${topLoad?.name || "Team"} has the heaviest current load.`,
      status: "yellow"
    },
    escalations: {
      value: redCases.length,
      detail: redCases.length ? "Supervisor review recommended now." : "No urgent escalation in the queue.",
      status: redCases.length ? "red" : "green"
    },
    automation: {
      value: openTasks.length,
      detail: "Open follow-ups, promises, and system tasks.",
      status: openTasks.some((task) => task.priority === "red") ? "red" : openTasks.length ? "yellow" : "green"
    },
    "data-health": {
      value: staleCustomers.length,
      detail: staleCustomers.length ? "Customer records need admin verification." : "No stale records in review.",
      status: staleCustomers.some((customer) => customer.staleRisk === "High") ? "red" : staleCustomers.length ? "yellow" : "green"
    },
    privacy: {
      value: "On",
      detail: "Sensitive patterns are scrubbed before AI analysis.",
      status: "green"
    }
  };

  return metrics[card.id] || { value: "Ready", detail: "Metric available.", status: card.status };
}

function renderCustomDashboard() {
  const controls = $("[data-dashboard-controls]");
  const grid = $("[data-dashboard-grid]");
  if (!controls || !grid) return;

  $("[data-dashboard-count]").textContent = `${visibleDashboardCards.length} visible`;
  $$("[data-dashboard-preset]").forEach((button) => {
    button.classList.toggle("active", button.dataset.dashboardPreset === activeDashboardPreset);
  });

  controls.innerHTML = dashboardCards
    .map(
      (card) => `
        <label class="dashboard-toggle">
          <input type="checkbox" data-dashboard-card="${card.id}" ${visibleDashboardCards.includes(card.id) ? "checked" : ""} />
          <span>${card.label}</span>
        </label>
      `
    )
    .join("");

  grid.innerHTML = dashboardCards
    .filter((card) => visibleDashboardCards.includes(card.id))
    .map((card) => {
      const metric = dashboardMetric(card);
      return `
        <article class="dashboard-metric ${metric.status}">
          <div>
            <span>${card.label}</span>
            <strong>${metric.value}</strong>
          </div>
          <p>${metric.detail}</p>
        </article>
      `;
    })
    .join("");
}

function setView(view) {
  const nav = $(`[data-view="${view}"]`);
  if (!nav) return;
  $$(".nav").forEach((button) => button.classList.toggle("active", button === nav));
  $$(".view").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === view));
  $("[data-title]").textContent = nav.textContent.trim();
}

function renderUseCase(useCase = activeUseCase) {
  activeUseCase = useCase;
  const status = statusClass(useCase.status);
  const customer = findCustomer(useCase.customerEmail);

  $("[data-use-case-list]").innerHTML = useCases
    .map(
      (scenario) => `
        <button class="scenario-button ${scenario.id === useCase.id ? "active" : ""}" data-use-case="${scenario.id}">
          <strong>${scenario.title}</strong>
          <span>${scenario.type}</span>
          <p>${scenario.summary}</p>
        </button>
      `
    )
    .join("");

  $("[data-use-case-type]").textContent = useCase.type;
  $("[data-use-case-title]").textContent = useCase.title;
  $("[data-use-case-status]").textContent = useCase.status;
  $("[data-use-case-status]").className = `status-pill ${status}`;
  $("[data-use-case-summary]").textContent = useCase.summary;
  $("[data-use-case-customer]").textContent = customer.name;
  $("[data-use-case-context]").textContent = useCase.context;
  $("[data-use-case-queue]").textContent = useCase.queue;
  $("[data-use-case-queue-detail]").textContent = useCase.queueDetail;
  $("[data-use-case-action]").textContent = useCase.action;
  $("[data-use-case-action-detail]").textContent = useCase.actionDetail;
  $("[data-use-case-reply]").value = useCase.reply;
  $("[data-use-case-timeline]").innerHTML = useCase.timeline
    .map(
      (step) => `
        <article class="timeline-step ${step.status}">
          <span>${step.time}</span>
          <div>
            <strong>${step.stage}</strong>
            <p>${step.detail}</p>
          </div>
        </article>
      `
    )
    .join("");
  $("[data-use-case-learning]").innerHTML = useCase.learning
    .map(
      (item) => `
        <article class="history-row ${item.status}">
          <span>${item.label}</span>
          <strong>${item.status.toUpperCase()}</strong>
          <p>${item.detail}</p>
        </article>
      `
    )
    .join("");
}

function runUseCase(useCase) {
  const customer = findCustomer(useCase.customerEmail);
  $("[data-email-input]").value = useCase.customerEmail;
  $("[data-message-input]").value = useCase.incomingMessage;
  renderCustomer(customer);
  renderUseCase(useCase);
}

async function handleAppClick(event) {
  const nav = event.target.closest("[data-view]");
  if (nav) {
    event.preventDefault();
    setView(nav.dataset.view);
  }

  const demoJump = event.target.closest("[data-demo-jump]");
  if (demoJump) {
    event.preventDefault();
    setView(demoJump.dataset.demoJump);
  }

  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) {
    event.preventDefault();
    setView(viewLink.dataset.viewLink);
  }

  const presetButton = event.target.closest("[data-dashboard-preset]");
  if (presetButton) {
    event.preventDefault();
    activeDashboardPreset = presetButton.dataset.dashboardPreset;
    visibleDashboardCards = [...(dashboardPresets[activeDashboardPreset] || dashboardPresets.supervisor)];
    renderCustomDashboard();
  }

  const dashboardCardInput = event.target.closest("[data-dashboard-card]");
  if (dashboardCardInput) {
    const cardId = dashboardCardInput.dataset.dashboardCard;
    activeDashboardPreset = "custom";
    visibleDashboardCards = dashboardCardInput.checked
      ? [...new Set([...visibleDashboardCards, cardId])]
      : visibleDashboardCards.filter((id) => id !== cardId);
    renderCustomDashboard();
  }

  const taskRunButton = event.target.closest("[data-run-automation]");
  if (taskRunButton) {
    const task = automationTasks.find((item) => item.id === taskRunButton.dataset.runAutomation);
    if (task) {
      if (backendOnline) {
        try {
          await postBackendAction(`/api/tasks/${task.id}/action`, { action: "run" });
          return;
        } catch (error) {
          backendOnline = false;
          showAppStatus("Online sync paused. The automation task is running in this browser.", "yellow");
        }
      }
      const caseItem = taskCase(task);
      const customer = taskCustomer(task);
      task.status = "Running";
      caseItem.timeline.push({
        time: timestamp(),
        stage: "Automation task running",
        detail: `${task.title}. Next step: ${task.nextStep}`,
        status: taskStatusClass(task)
      });
      addCaseMessage(caseItem, "Intelligence automation", `${task.title}. ${task.nextStep}`, "Internal task");
      pushHistory(customer.name, `Automation task running: ${task.title}.`, taskStatusClass(task));
      showAppStatus("Automation task is running and linked to the case.", "green");
      renderEverything();
    }
  }

  const taskCompleteButton = event.target.closest("[data-complete-automation]");
  if (taskCompleteButton) {
    const task = automationTasks.find((item) => item.id === taskCompleteButton.dataset.completeAutomation);
    if (task) {
      if (backendOnline) {
        try {
          await postBackendAction(`/api/tasks/${task.id}/action`, { action: "complete" });
          return;
        } catch (error) {
          backendOnline = false;
          showAppStatus("Online sync paused. The task completion was saved in this browser.", "yellow");
        }
      }
      const caseItem = taskCase(task);
      const customer = taskCustomer(task);
      task.status = "Completed";
      task.completedAt = timestamp();
      caseItem.timeline.push({
        time: timestamp(),
        stage: "Automation task completed",
        detail: `${task.title} was completed and kept with the case history.`,
        status: "green"
      });
      addCaseMessage(caseItem, "Intelligence automation", `Completed task: ${task.title}.`, "Internal task");
      pushHistory(customer.name, `Automation task completed: ${task.title}.`, "green");
      showAppStatus("Automation task completed and logged.", "green");
      renderEverything();
    }
  }

  const taskCaseButton = event.target.closest("[data-automation-case]");
  if (taskCaseButton) {
    activeHistoryCaseId = taskCaseButton.dataset.automationCase;
    setView("ticket-history");
    renderTicketHistory();
  }

  const taskCustomerButton = event.target.closest("[data-automation-customer]");
  if (taskCustomerButton) {
    activeCustomer = findCustomer(taskCustomerButton.dataset.automationCustomer);
    setView("customer-profile");
    renderCustomerProfile(activeCustomer);
  }

  const historyButton = event.target.closest("[data-case-history]");
  if (historyButton) {
    activeHistoryCaseId = historyButton.dataset.caseHistory;
    setView("ticket-history");
    renderTicketHistory();
  }

  if (event.target.matches("[data-open-ticket-history]")) {
    activeHistoryCaseId = liveCase().id;
    setView("ticket-history");
    renderTicketHistory();
  }

  if (event.target.matches("[data-open-customer-profile]")) {
    const selected = liveCase();
    activeCustomer = findCustomer(selected.customerEmail);
    setView("customer-profile");
    renderCustomerProfile(activeCustomer);
  }

  if (event.target.matches("[data-detect]")) {
    renderCustomer(findCustomer($("[data-email-input]").value));
  }

  if (event.target.matches("[data-handoff]")) {
    const emotion = detectEmotion($("[data-message-input]").value);
    $("[data-handoff-type]").textContent = emotion.label === "Frustrated" ? "Phone recommended" : "Chat ready";
    $("[data-handoff-note]").value = handoffNote(activeCustomer, emotion);
  }

  const customerButton = event.target.closest("[data-customer-email]");
  if (customerButton) {
    const customer = findCustomer(customerButton.dataset.customerEmail);
    $("[data-email-input]").value = customer.email;
    renderCustomer(customer);
  }

  const useCaseButton = event.target.closest("[data-use-case]");
  if (useCaseButton) {
    const useCase = useCases.find((scenario) => scenario.id === useCaseButton.dataset.useCase);
    if (useCase) runUseCase(useCase);
  }

  const liveCaseButton = event.target.closest("[data-live-case]");
  if (liveCaseButton) {
    activeLiveCaseId = liveCaseButton.dataset.liveCase;
    const selected = liveCase();
    const customer = findCustomer(selected.customerEmail);
    $("[data-email-input]").value = customer.email;
    $("[data-message-input]").value = selected.message;
    renderCustomer(customer);
    renderWorkbench();
    renderAgentPortal();
    renderPhoneMonitor();
    renderCustomerPortal();
  }

  const agentCaseButton = event.target.closest("[data-agent-case]");
  if (agentCaseButton) {
    activeLiveCaseId = agentCaseButton.dataset.agentCase;
    const selected = liveCase();
    const customer = findCustomer(selected.customerEmail);
    $("[data-email-input]").value = customer.email;
    $("[data-message-input]").value = selected.message;
    renderCustomer(customer);
    renderAgentPortal();
    renderPhoneMonitor();
    renderCustomerProfile(customer);
  }

  if (event.target.matches("[data-claim-case]")) {
    const selected = liveCase();
    if (backendOnline) {
      await postBackendAction(`/api/cases/${selected.id}/action`, { action: "claim", agentName: activeAgentName });
      return;
    }
    selected.assignedTo = activeAgentName;
    selected.timeline.push({
      time: timestamp(),
      stage: "Ticket claimed",
      detail: `${activeAgentName} claimed ${selected.caseNo} from the shared queue.`,
      status: "green"
    });
    addCaseMessage(selected, "Agent", `${activeAgentName} claimed this ticket from the shared queue.`, "Internal");
    pushHistory(findCustomer(selected.customerEmail).name, `${selected.caseNo} claimed by ${activeAgentName}.`, "green");
    renderEverything();
  }

  const agentButton = event.target.closest("[data-agent-profile]");
  if (agentButton) {
    activeAgentName = agentButton.dataset.agentProfile;
    renderAgentProfile();
    renderPhoneMonitor();
  }

  if (event.target.matches("[data-set-agent-ooo]")) {
    const backupAgentId = $("[data-agent-backup]").value;
    const scheduledReturn = $("[data-agent-return]").value.trim();
    if (backendOnline) {
      try {
        await postBackendAction("/api/toggle-ooo", {
          agentId: activeAgentName,
          goOutOfOffice: true,
          backupAgentId,
          scheduledReturn
        });
        $("[data-ooo-status]").textContent = "Saved";
        return;
      } catch (error) {
        backendOnline = false;
        showAppStatus("Online sync paused. OOO status changed in this browser.", "yellow");
      }
    }
    roster.agents[activeAgentName] = {
      status: "ooo",
      backup: backupAgentId,
      scheduled_return: scheduledReturn || null
    };
    pushHistory(activeAgentName, `${activeAgentName} is out of office. New work routes to ${backupAgentId}.`, "yellow");
    $("[data-ooo-status]").textContent = "Saved locally";
    renderEverything();
  }

  if (event.target.matches("[data-set-agent-active]")) {
    if (backendOnline) {
      try {
        await postBackendAction("/api/toggle-ooo", {
          agentId: activeAgentName,
          goOutOfOffice: false
        });
        $("[data-ooo-status]").textContent = "Active";
        return;
      } catch (error) {
        backendOnline = false;
        showAppStatus("Online sync paused. Agent was set active in this browser.", "yellow");
      }
    }
    roster.agents[activeAgentName] = {
      ...agentAvailability(activeAgentName),
      status: "active",
      scheduled_return: null
    };
    pushHistory(activeAgentName, `${activeAgentName} is active again and can receive assigned work.`, "green");
    $("[data-ooo-status]").textContent = "Active locally";
    renderEverything();
  }

  if (event.target.matches("[data-process-email]")) {
    const senderEmail = $("[data-intake-sender]").value.trim().toLowerCase();
    const rawEmailBody = $("[data-intake-body]").value.trim();
    const defaultAssignedAgent = $("[data-intake-agent]").value;
    if (!rawEmailBody) return;

    $("[data-email-intake-status]").textContent = "Processing";

    if (backendOnline) {
      try {
        await postBackendAction("/api/process-inbound-email", {
          senderEmail,
          rawEmailBody,
          defaultAssignedAgent
        });
        latestEmailIntake = liveCases[0];
        $("[data-email-intake-status]").textContent = "Created";
        renderEmailIntake();
        return;
      } catch (error) {
        backendOnline = false;
        showAppStatus("Online sync paused. Email was processed in this browser.", "yellow");
      }
    }

    const sanitizedBody = sanitizeEmailLocal(rawEmailBody);
    const assignedTo = resolveAvailableAgentLocal(defaultAssignedAgent);
    const customer = upsertCustomerLocal({
      name: senderEmail.split("@")[0] || "Email Customer",
      email: senderEmail,
      channel: "Email",
      issue: "Inbound email parsed by Amitalux Intelligence"
    });
    const newCase = {
      id: `email-${Date.now()}`,
      caseNo: nextCaseNo(),
      title: "Customer email",
      customerEmail: customer.email,
      message: sanitizedBody,
      channel: "Email",
      queue: `${assignedTo} email queue`,
      context: "AI tone: urgent_escalation. Summary: Inbound email was scrubbed and routed by the local demo fallback.",
      reply: "",
      status: "Received",
      risk: sanitizedBody.toLowerCase().includes("still") ? "red" : "yellow",
      sentiment: "urgent_escalation",
      createdAt: timestamp(),
      firstResponseAt: "",
      closedAt: "",
      assignedTo,
      originallyAssignedTo: defaultAssignedAgent,
      aiAnalysis: {
        customerTone: "urgent_escalation",
        primaryContextSummary: "Inbound email was scrubbed, parsed, and routed with the browser fallback.",
        relevantTechnicalData: { orderId: "", errorCodes: [] },
        source: "browser-fallback"
      },
      messages: [{ time: timestamp(), speaker: "Customer", channel: "Email", body: sanitizedBody }],
      timeline: [
        { time: timestamp(), stage: "Email received", detail: "Inbound email entered Amitalux Intelligence intake.", status: "yellow" },
        { time: timestamp(), stage: "Privacy scrubbed", detail: "Sensitive patterns were redacted before AI analysis.", status: "green" },
        { time: timestamp(), stage: "OOO routing checked", detail: `${defaultAssignedAgent} resolved to ${assignedTo}.`, status: assignedTo === defaultAssignedAgent ? "green" : "yellow" }
      ]
    };
    liveCases.unshift(newCase);
    latestEmailIntake = newCase;
    activeLiveCaseId = newCase.id;
    addAutomationTaskLocal({
      type: "Email first response",
      title: `Respond to parsed email ${newCase.caseNo}`,
      caseItem: newCase,
      customer,
      owner: assignedTo,
      due: "Next 5 minutes",
      priority: newCase.risk,
      detail: "AI parsed the inbound email and created a routed case.",
      nextStep: "Review the structured analysis, confirm the routing, and send a personal first reply."
    });
    pushHistory(customer.name, `Inbound email parsed and routed to ${assignedTo}.`, newCase.risk);
    $("[data-email-intake-status]").textContent = "Created locally";
    syncReportsFromWorkbench();
    renderEverything();
  }

  if (event.target.matches("[data-start-phone-monitor]")) {
    phoneMonitorStarted = true;
    activePhoneStage = 0;
    const selected = liveCase();
    const customer = findCustomer(selected.customerEmail);
    selected.channel = "Phone";
    selected.timeline.push({
      time: "Now",
      stage: "Phone monitor started",
      detail: "Amitalux Intelligence began listening with consent, capturing live notes, tone, and agent voice impact.",
      status: "yellow"
    });
    addCaseMessage(selected, "Intelligence AI", "Phone monitor started with customer consent. Live notes, tone, and agent voice response are now attached to this case.", "Phone");
    pushHistory(customer.name, "Phone AI monitor started for live customer call.", "yellow");
    renderEverything();
  }

  if (event.target.matches("[data-advance-phone-call]")) {
    phoneMonitorStarted = true;
    activePhoneStage = Math.min(phoneCallStages.length - 1, activePhoneStage + 1);
    const stage = phoneCallStages[activePhoneStage];
    const selected = liveCase();
    const customer = findCustomer(selected.customerEmail);
    selected.timeline.push({
      time: "Now",
      stage: `Phone tone: ${stage.tone}`,
      detail: `${stage.voiceEffect}. Recommended action: ${stage.nextAction}.`,
      status: activePhoneStage === 1 ? "red" : "green"
    });
    addCaseMessage(selected, "Intelligence AI", `${stage.notes} Recommended action: ${stage.nextAction}.`, "Phone monitor");
    pushHistory(customer.name, `Phone AI detected ${stage.tone.toLowerCase()} tone and coached agent voice.`, activePhoneStage === 1 ? "red" : "green");
    renderEverything();
  }

  if (event.target.matches("[data-save-call-notes]")) {
    phoneMonitorStarted = true;
    const stage = phoneCallStages[activePhoneStage];
    const selected = liveCase();
    const customer = findCustomer(selected.customerEmail);
    const memoryUpdate = `Phone call: ${stage.memory}`;

    customer.memory = memoryUpdate;
    customer.memoryLine = memoryUpdate;
    customer.summary = `${customer.summary} Latest phone note: ${stage.summary}`;
    selected.context = `${selected.context} Phone AI summary: ${stage.summary}`;
    selected.timeline.push({
      time: "Now",
      stage: "Call notes saved",
      detail: "Phone summary, customer tone, agent voice response, and memory update were attached to the customer profile.",
      status: "green"
    });
    addCaseMessage(selected, "Intelligence AI", `Saved call summary: ${stage.summary} Memory update: ${stage.memory}`, "Phone summary");
    addAutomationTaskLocal({
      type: "Phone follow-up",
      title: `Send written call summary for ${selected.caseNo}`,
      caseItem: selected,
      customer,
      owner: selected.assignedTo || activeAgentName,
      due: dueNowLabel("callback"),
      priority: activePhoneStage === 1 ? "red" : "yellow",
      detail: "The phone call produced a customer promise. Amitalux Intelligence should make sure the customer receives a written summary.",
      nextStep: "Send the call summary, confirm the next step, and keep the note with the customer profile."
    });
    if (!memoryLedger.includes(memoryUpdate)) memoryLedger.unshift(memoryUpdate);
    pushHistory(customer.name, "Phone call notes saved to customer profile.", "green");
    showAppStatus("Phone notes saved to the customer profile.", "green");
    syncReportsFromWorkbench();
    renderEverything();
  }

  if (event.target.matches("[data-run-ai]")) {
    if (backendOnline) {
      await postBackendAction(`/api/cases/${liveCase().id}/action`, { action: "analyze" });
      return;
    }
    const selected = liveCase();
    const customer = findCustomer(selected.customerEmail);
    const draft = await createDraftWithApi(selected, customer);
    updateSelectedCase((current, currentCustomer) => {
      if (current.status === "Closed") return;
      current.status = "Analyzed";
      current.reply = draft.reply;
      current.timeline.push({
        time: timestamp(),
        stage: "AI analysis complete",
        detail: `Amitalux Intelligence matched the customer, read the message, detected emotion, checked history, and prepared a response through ${draft.source}.`,
        status: caseRisk(current)
      });
      addCaseMessage(current, "Intelligence AI", draft.reply, "Suggested reply");
      addAutomationTaskLocal({
        type: "AI review",
        title: `Review AI plan for ${current.caseNo}`,
        caseItem: current,
        customer: currentCustomer,
        owner: current.assignedTo || activeAgentName,
        due: "Now",
        priority: caseRisk(current),
        detail: "Amitalux Intelligence prepared a draft. A human should verify the promise, tone, and resolution before the reply is sent.",
        nextStep: "Approve the reply only if the action is specific and the customer does not need to repeat the story."
      });
      pushHistory(currentCustomer.name, `AI analyzed ${current.title}.`, caseRisk(current));
    });
  }

  if (event.target.matches("[data-agent-run-ai]")) {
    await performCaseAction("analyze");
  }

  if (event.target.matches("[data-approve-reply]")) {
    if (backendOnline) {
      await postBackendAction(`/api/cases/${liveCase().id}/action`, { action: "approve" });
      return;
    }
    updateSelectedCase((selected, customer) => {
      if (selected.status === "Closed") return;
      selected.status = "Approved";
      selected.timeline.push({
        time: timestamp(),
        stage: "Reply approved",
        detail: "A human approved the AI response and resolution plan.",
        status: "green"
      });
      addCaseMessage(selected, "Agent", `Approved response for ${selected.caseNo}.`, "Internal");
      pushHistory(customer.name, `Human approved the reply for ${selected.title}.`, "green");
    });
  }

  if (event.target.matches("[data-agent-approve]")) {
    await performCaseAction("approve");
  }

  if (event.target.matches("[data-send-reply]")) {
    if (backendOnline) {
      await postBackendAction(`/api/cases/${liveCase().id}/action`, { action: "send" });
      return;
    }
    updateSelectedCase((selected, customer) => {
      if (selected.status === "Closed") return;
      selected.status = "Sent";
      sentCount += 1;
      selected.firstResponseAt = selected.firstResponseAt || timestamp();
      selected.timeline.push({
        time: timestamp(),
        stage: "Reply sent",
        detail: "Amitalux Intelligence sent the approved response and logged the promise in the customer record.",
        status: "green"
      });
      addCaseMessage(selected, "Agent", selected.reply || "Approved response sent to customer.", selected.channel);
      addAutomationTaskLocal({
        type: "Promise follow-up",
        title: `Confirm promised resolution for ${selected.caseNo}`,
        caseItem: selected,
        customer,
        owner: selected.assignedTo || activeAgentName,
        due: dueNowLabel("follow-up"),
        priority: selected.risk === "red" ? "red" : "yellow",
        detail: "A customer-facing reply was sent. Amitalux Intelligence should confirm that any promised action actually happens.",
        nextStep: "Check whether the promise was completed, then send a clear update if anything changes."
      });
      pushHistory(customer.name, `Reply sent for ${selected.title}.`, "green");
      if (!memoryLedger.includes(customer.memoryLine)) memoryLedger.unshift(customer.memoryLine);
    });
  }

  if (event.target.matches("[data-agent-send]")) {
    const selected = liveCase();
    const editedReply = $("[data-agent-reply]")?.value;
    if (editedReply) selected.reply = editedReply;
    await performCaseAction("send", { reply: editedReply });
  }

  if (event.target.matches("[data-close-case]")) {
    if (backendOnline) {
      await postBackendAction(`/api/cases/${liveCase().id}/action`, { action: "close" });
      return;
    }
    updateSelectedCase((selected, customer) => {
      if (selected.status === "Closed") return;
      selected.status = "Closed";
      handledCount += 1;
      selected.closedAt = timestamp();
      csatScore = Math.min(98, csatScore + (selected.risk === "red" ? 2 : 1));
      selected.timeline.push({
        time: timestamp(),
        stage: "Case closed",
        detail: "The case is resolved, the history is updated, and reports now reflect the closure.",
        status: "green"
      });
      addCaseMessage(selected, "Agent", `Closed ${selected.caseNo}. Resolution and history are available for audit.`, "Internal");
      addAutomationTaskLocal({
        type: "CSAT follow-up",
        title: `Send CSAT check for ${selected.caseNo}`,
        caseItem: selected,
        customer,
        owner: selected.assignedTo || activeAgentName,
        due: dueNowLabel("csat"),
        priority: "green",
        detail: "The case closed. Amitalux Intelligence should check whether the customer feels the issue was truly resolved.",
        nextStep: "Send a short satisfaction check and update memory if the customer still sounds uncertain."
      });
      pushHistory(customer.name, `${selected.title} was closed. CSAT moved to ${csatScore}%.`, "green");
    });
  }

  if (event.target.matches("[data-agent-close]")) {
    await performCaseAction("close");
  }

  if (event.target.matches("[data-new-case]")) {
    if (backendOnline) {
      await postBackendAction("/api/cases", {});
      activeLiveCaseId = liveCases[0]?.id || activeLiveCaseId;
      renderEverything();
      return;
    }
    const newId = `new-${Date.now()}`;
    liveCases.unshift({
      id: newId,
      caseNo: nextCaseNo(),
      title: "New confused customer message",
      customerEmail: "maya@example.com",
      message: "I am not sure what happened with my account. Can someone help me today?",
      channel: "Chat",
      queue: "General support",
      context: "Existing customer. Account history is available and needs a calm first response.",
      reply:
        "Hi Maya, I can help with this today. I am checking your account history now so we can answer the real question clearly and avoid making you repeat anything.",
      status: "Received",
      risk: "yellow",
      sentiment: "Concerned",
      createdAt: timestamp(),
      firstResponseAt: "",
      closedAt: "",
      assignedTo: "Unassigned",
      messages: [{ time: "Now", speaker: "Customer", channel: "Chat", body: "I am not sure what happened with my account. Can someone help me today?" }],
      timeline: [{ time: "Now", stage: "Received", detail: "A new chat message entered the queue.", status: "yellow" }]
    });
    activeLiveCaseId = newId;
    pushHistory("Maya Thompson", "New chat case entered the queue.", "yellow");
    addAutomationTaskLocal({
      type: "First response SLA",
      title: "Respond to new chat within 10 minutes",
      caseItem: liveCases[0],
      customer: findCustomer(liveCases[0].customerEmail),
      owner: "Unassigned",
      due: "Next 10 minutes",
      priority: "yellow",
      detail: "A new customer message entered the queue and needs a fast first response.",
      nextStep: "Assign the case, run AI analysis, and send a personal first reply."
    });
    syncReportsFromWorkbench();
    renderWorkbench();
    renderReports();
  }

  if (event.target.matches("[data-create-customer-record]")) {
    const name = $("[data-signup-name]").value.trim();
    const email = $("[data-signup-email]").value.trim().toLowerCase();
    const phone = $("[data-signup-phone]").value.trim();
    const channel = $("[data-signup-channel]").value;

    if (!email) {
      showAppStatus("Email is required to create a customer record.", "red");
      return;
    }

    $("[data-signup-status]").textContent = "Saving";

    if (backendOnline) {
      try {
        await postBackendAction("/api/customers", { name, email, phone, channel });
        const savedCustomer = exactCustomer(email) || findCustomer(email);
        activeCustomer = savedCustomer;
        $("[data-portal-email]").value = email;
        $("[data-signup-status]").textContent = "Saved online";
        showAppStatus("Customer record created and synced online.", "green");
        renderEverything();
        return;
      } catch (error) {
        backendOnline = false;
        showAppStatus("Online sync failed. A backup customer record was created in this browser.", "yellow");
      }
    }

    const localCustomer = upsertCustomerLocal({ name, email, phone, channel });
    saveCustomerBackup(localCustomer);
    activeCustomer = localCustomer;
    $("[data-portal-email]").value = email;
    $("[data-signup-status]").textContent = "Backup saved";
    pushHistory(localCustomer.name, "Customer record created with browser backup because online sync was unavailable.", "yellow");
    syncReportsFromWorkbench();
    renderEverything();
  }

  if (event.target.matches("[data-submit-customer-message]")) {
    const email = $("[data-portal-email]").value.trim() || "maya@example.com";
    const channel = $("[data-portal-channel]").value;
    const message = $("[data-portal-message]").value.trim();
    if (!message) return;

    $("[data-customer-send-status]").textContent = "Sending";

    if (backendOnline) {
      try {
        await postBackendAction("/api/cases", {
          customerEmail: email,
          channel,
          message,
          title: `${channel} customer message`
        });
        activeLiveCaseId = liveCases[0]?.id || activeLiveCaseId;
        renderEverything();
      } catch (error) {
        backendOnline = false;
        showAppStatus("Online sync paused. The message was added to this browser demo.", "yellow");
      }
    }

    if (!backendOnline) {
      const messageCustomer = exactCustomer(email) || upsertCustomerLocal({ email, channel, issue: `${channel} customer message` });
      const newId = `customer-${Date.now()}`;
      liveCases.unshift({
        id: newId,
        caseNo: nextCaseNo(),
        title: `${channel} customer message`,
        customerEmail: email,
        message,
        channel,
        queue: "Customer portal",
        context: "Customer submitted this directly through the customer-facing portal.",
        reply: "",
        status: "Received",
        risk: "yellow",
        sentiment: "Concerned",
        createdAt: timestamp(),
        firstResponseAt: "",
        closedAt: "",
        assignedTo: "Unassigned",
        messages: [{ time: timestamp(), speaker: "Customer", channel, body: message }],
        timeline: [{ time: timestamp(), stage: "Received", detail: "Customer submitted a new portal message.", status: "yellow" }]
      });
      activeLiveCaseId = newId;
      pushHistory(messageCustomer.name, "Customer submitted a new portal message.", "yellow");
      addAutomationTaskLocal({
        type: "First response SLA",
        title: `Respond to ${messageCustomer.name}'s new message`,
        caseItem: liveCases[0],
        customer: messageCustomer,
        owner: "Unassigned",
        due: "Next 10 minutes",
        priority: "yellow",
        detail: "A customer submitted a new message from the customer portal.",
        nextStep: "Claim the ticket, analyze context, and send a personal reply."
      });
      syncReportsFromWorkbench();
      renderEverything();
    }

    $("[data-customer-send-status]").textContent = "Sent";
    $("[data-portal-message]").value = "";
  }
}

document.addEventListener("click", (event) => {
  handleAppClick(event).catch((error) => {
    console.error(error);
    showAppStatus("That action hit an error, but Amitalux Intelligence is still running. Try the button again.", "red");
  });
});

$("[data-message-input]")?.addEventListener("input", () => renderCustomer(activeCustomer));
$("[data-portal-email]")?.addEventListener("input", () => renderCustomerPortal());
syncReportsFromWorkbench();
loadBackendState().catch((error) => {
  console.error(error);
  backendOnline = false;
  renderEverything();
});
