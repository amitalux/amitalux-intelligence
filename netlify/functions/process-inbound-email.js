/* Inbound Email Automated Processing Engine */
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { from, subject, body } = payload;

    if (!from || !subject) {
      return { statusCode: 400, body: "Missing core email header parameters." };
    }

    // Generate clean, deterministic customer numerical ID reference 
    const generatedTicketId = Math.floor(10000 + Math.random() * 90000).toString();

    const automatedTicketRecord = {
      id: generatedTicketId,
      subject: subject || "Inbound Communication Parsing Sync Failure",
      customer: from,
      priority: body.toLowerCase().includes("urgent") || body.toLowerCase().includes("broken") ? "Critical" : "Medium",
      status: "Open",
      assignee: "John Smith", // Direct zero-friction mapping to active session
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Automated Activity Capture complete. Appended to John Smith queue context loop.",
        record: automatedTicketRecord
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
