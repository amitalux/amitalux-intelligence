const retailWorkspace = "retailer-demo";

const customerOrders = [
  {
    id: "NV-1049",
    status: "In transit",
    date: "June 28, 2026",
    total: "$432.00",
    delivery: "Expected July 2",
    summary: "Two-piece living room order with expedited shipping. Carrier scan is late and the customer already asked for an update.",
    issueMessage: "I need help with order NV-1049. The tracking has not updated and I already asked yesterday. Can someone give me a real delivery update today?",
    timeline: ["June 28: Order placed with expedited shipping.", "June 29: Packed at North & Vale warehouse.", "June 30: Carrier pickup confirmed.", "Today: Carrier scan is 24 hours late."],
    items: [
      { name: "Modular sofa cover", detail: "Vale collection, warm flax", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=240&q=80" },
      { name: "Walnut bedside table", detail: "Single drawer, walnut", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=240&q=80" }
    ]
  },
  {
    id: "NV-1188",
    status: "Delivered",
    date: "June 25, 2026",
    total: "$184.00",
    delivery: "Delivered June 30",
    summary: "Brass reading lamp was delivered, but the customer reported a cracked shade and uploaded photos.",
    issueMessage: "I need help with order NV-1188. The brass reading lamp arrived damaged and I need a replacement timing update.",
    timeline: ["June 25: Order placed.", "June 29: Delivered.", "Today: Damage photos uploaded.", "Next: Support should confirm replacement options."],
    items: [
      { name: "Brass reading lamp", detail: "Gift-ready packaging", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=240&q=80" }
    ]
  },
  {
    id: "NV-0997",
    status: "Return started",
    date: "June 18, 2026",
    total: "$126.00",
    delivery: "Delivered June 21",
    summary: "Return is inside policy window, but the label link is failing with an expired-link message.",
    issueMessage: "I need help with order NV-0997. The return label says expired even though I started the return today.",
    timeline: ["June 18: Order placed.", "June 21: Delivered.", "Today: Return started.", "Today: Label link returned an expired error."],
    items: [
      { name: "Modular sofa cover", detail: "Vale collection, charcoal", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=240&q=80" }
    ]
  },
  {
    id: "NV-1216",
    status: "Action needed",
    date: "June 30, 2026",
    total: "$310.00",
    delivery: "Delivered July 1",
    summary: "Packing mismatch. Customer ordered a linen task chair but received a side table. Gift timing risk is high.",
    issueMessage: "I need help with order NV-1216. I ordered the linen task chair but received the wrong item, and this is a gift.",
    timeline: ["June 30: Order placed.", "July 1: Delivered.", "Today: Customer reported wrong item.", "Next: Support should check replacement inventory and timing."],
    items: [
      { name: "Linen task chair", detail: "Ordered item, not received", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=240&q=80" }
    ]
  }
];

const knowledgeArticles = [
  {
    id: "delayed-order",
    category: "shipping",
    title: "Track a delayed order",
    summary: "Use this when a delivery scan is late, the carrier has not updated, or expedited shipping missed its expected date.",
    keywords: ["shipping", "late", "tracking", "carrier", "delivery", "expedited"],
    steps: ["Check your order number and carrier tracking link.", "If the carrier has not scanned the package in 24 hours, North & Vale can start a carrier trace.", "If expedited shipping missed the promised window, support can review the shipping charge.", "For event-sensitive orders, include the event date so the support team can prioritize the reply."],
    escalation: "Contact us if the tracking has not changed for 24 hours, the delivery is for an event, or you already asked for help and still do not have a clear answer.",
    message: "I read the delayed order article, but I still need help. My order tracking has not updated and I need a clear delivery answer."
  },
  {
    id: "damaged-item",
    category: "orders",
    title: "Report a damaged item",
    summary: "Use this when an item arrives cracked, scratched, stained, or otherwise damaged in transit.",
    keywords: ["damaged", "cracked", "broken", "replacement", "photo"],
    steps: ["Keep the item and packaging until support confirms the next step.", "Take one photo of the item and one photo of the outside packaging.", "Include the order number and whether you prefer a replacement, refund, or store credit.", "If the item is needed by a certain date, include that timing in the message."],
    escalation: "Contact us when photos are ready or when replacement timing matters. Support should not ask you to repeat what the photos already show.",
    message: "I read the damaged item article and have photos ready. I need a replacement decision and timing confirmation."
  },
  {
    id: "wrong-item",
    category: "orders",
    title: "Wrong item received",
    summary: "Use this when your packing slip and delivered item do not match, or a gift order arrived incorrectly.",
    keywords: ["wrong item", "gift", "packing", "mismatch", "exchange"],
    steps: ["Compare the item received with the order confirmation.", "Keep the packaging until support confirms whether a return is needed.", "Tell us if this was a gift or time-sensitive purchase.", "Support can check inventory, arrange a replacement, and decide whether the incorrect item needs to be returned."],
    escalation: "Contact us if the order was a gift, the replacement is time sensitive, or the wrong item blocks use of the purchase.",
    message: "I read the wrong item article. I received the wrong product and this is time sensitive."
  },
  {
    id: "return-label",
    category: "returns",
    title: "Fix a return label that will not open",
    summary: "Use this when a return label says expired, fails to load, or sends you back to the return start page.",
    keywords: ["return", "label", "expired", "refund", "exchange"],
    steps: ["Confirm the order is inside the return window.", "Try opening the label in a new browser tab.", "If the link says expired on the same day, support can generate a fresh label.", "If you want an exchange instead of a refund, include the replacement item."],
    escalation: "Contact us if the label error repeats or the return window is close to ending.",
    message: "I read the return label article, but my label still says expired. Please send a fresh return label."
  },
  {
    id: "change-address",
    category: "account",
    title: "Change a shipping address after checkout",
    summary: "Use this when the address is wrong or you need to redirect an order before it ships.",
    keywords: ["address", "account", "shipping", "checkout", "redirect"],
    steps: ["Check whether the order has shipped.", "If it has not shipped, support may be able to update the address.", "If it has shipped, the carrier may require a redirect request.", "Never send full payment card numbers when asking for an address change."],
    escalation: "Contact us right away if the address is wrong and the order has not shipped.",
    message: "I read the address change article and need help updating the shipping address before the order ships."
  },
  {
    id: "payment-hold",
    category: "account",
    title: "Understand duplicate charges or payment holds",
    summary: "Use this when a pending authorization appears twice or a charge looks higher than expected.",
    keywords: ["payment", "charged", "duplicate", "hold", "card", "billing"],
    steps: ["Check whether the charge is pending or posted.", "Pending holds usually fall off automatically after the bank settles the order.", "Do not send your full card number to support.", "If two posted charges appear, support can review the order and payment history."],
    escalation: "Contact us if two charges have posted, if the amount is wrong, or if a billing promise was already made.",
    message: "I read the duplicate charge article. I still need help reviewing a billing issue on my order."
  }
];

function $(selector) {
  return document.querySelector(selector);
}

function normalizeSearchTerm(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word === "returns") return "return";
      if (word === "labels") return "label";
      if (word === "orders") return "order";
      if (word === "charges") return "charge";
      if (word.endsWith("s") && word.length > 4) return word.slice(0, -1);
      return word;
    })
    .join(" ");
}

function postJson(path, body) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-amitalux-workspace": retailWorkspace,
      "x-amitalux-role": "owner"
    },
    body: JSON.stringify(body)
  }).then((response) => {
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  });
}
