import { hasSupabaseConfig, supabaseAdmin } from "./_shared/supabase-db.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-amitalux-workspace, x-amitalux-role",
  "Access-Control-Max-Age": "86400"
};

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init.headers || {})
    }
  });
}

function slugify(value) {
  return String(value || "demo-business")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "demo-business";
}

function customerNumber(count) {
  return `CUST-${String(count + 1).padStart(4, "0")}`;
}

function caseNumber(count) {
  return `CASE-${String(count + 1).padStart(5, "0")}`;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!hasSupabaseConfig()) {
    return json({ error: "Supabase is not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "").trim();

  if (!message) {
    return json({ error: "Message is required" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const workspaceSlug = slugify(req.headers.get("x-amitalux-workspace") || body.workspace || "demo-business");
  const channel = body.channel || "Website chat";
  const title = body.title || "Website support request";
  const customerEmail = String(body.customerEmail || "website-customer@example.com").trim().toLowerCase();
  const customerName = String(body.customerName || customerEmail.split("@")[0] || "Website Customer").trim();

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, slug, name, status")
    .eq("slug", workspaceSlug)
    .single();

  if (workspaceError || !workspace) {
    return json({ error: `Workspace not found: ${workspaceSlug}` }, { status: 404 });
  }

  const { count: customerCount } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.id);

  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("email", customerEmail)
    .maybeSingle();

  let customer = existingCustomer;

  if (!customer) {
    const { data: insertedCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({
        workspace_id: workspace.id,
        customer_no: customerNumber(customerCount || 0),
        name: customerName,
        email: customerEmail,
        phone: body.customerPhone || null,
        preferred_channel: channel,
        consent: "Website message submitted",
        memory: "Customer first contacted the business through the installed website widget.",
        summary: message.slice(0, 240),
        data_health: "New record",
        stale_risk: "Low"
      })
      .select("*")
      .single();

    if (customerError) {
      return json({ error: customerError.message }, { status: 500 });
    }

    customer = insertedCustomer;
  }

  const { count: caseCount } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.id);

  const { data: insertedCase, error: caseError } = await supabase
    .from("cases")
    .insert({
      workspace_id: workspace.id,
      case_no: caseNumber(caseCount || 0),
      customer_id: customer.id,
      title,
      channel,
      status: "Received",
      risk: "yellow",
      sentiment: "Concerned",
      message,
      context: "Customer submitted this from an installed Amitalux Intelligence website widget."
    })
    .select("*")
    .single();

  if (caseError) {
    return json({ error: caseError.message }, { status: 500 });
  }

  await supabase.from("messages").insert({
    workspace_id: workspace.id,
    case_id: insertedCase.id,
    customer_id: customer.id,
    speaker: "Customer",
    channel,
    body: message,
    visibility: "customer"
  });

  await supabase.from("automation_tasks").insert({
    workspace_id: workspace.id,
    case_id: insertedCase.id,
    customer_id: customer.id,
    owner: "Unassigned",
    task_type: "First response SLA",
    title: `Respond to ${customer.name}'s website message`,
    status: "Open",
    priority: "yellow",
    due_label: "Next 10 minutes",
    detail: "A customer submitted a message from the installed website widget.",
    next_step: "Claim the ticket, analyze context, and send a personal reply."
  });

  await supabase.from("audit_events").insert({
    workspace_id: workspace.id,
    actor: "website-widget",
    event: `New website support case ${insertedCase.case_no} created.`,
    status: "yellow",
    metadata: {
      case_id: insertedCase.id,
      customer_id: customer.id,
      channel
    }
  });

  return json({
    ok: true,
    workspace,
    customer,
    case: insertedCase,
    cases: [
      {
        id: insertedCase.id,
        caseNo: insertedCase.case_no,
        title: insertedCase.title,
        customerEmail: customer.email,
        message: insertedCase.message,
        channel: insertedCase.channel,
        status: insertedCase.status,
        risk: insertedCase.risk,
        sentiment: insertedCase.sentiment,
        createdAt: insertedCase.created_at
      }
    ]
  });
};

export const config = {
  path: "/api/cases"
};
