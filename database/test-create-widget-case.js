import casesHandler from "../netlify/functions/cases.js";

const req = new Request("http://localhost/api/cases", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-amitalux-workspace": "demo-business"
  },
  body: JSON.stringify({
    customerName: "Test Customer",
    customerEmail: `test-${Date.now()}@example.com`,
    title: "Website support request",
    channel: "Website chat",
    message: "I need help with an order from the website widget."
  })
});

const response = await casesHandler(req);
const data = await response.json();

if (!response.ok) {
  console.error("Create case failed:", data);
  process.exit(1);
}

console.log("Case created.");
console.log(`Case: ${data.case.case_no}`);
console.log(`Customer: ${data.customer.email}`);
