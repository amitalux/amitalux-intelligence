/* Amitalux Intelligence CRM Core Platform Engine */
const backendState = {
  currentConsole: "Agent", 
  currentTab: "Tickets",    
  activeFilter: "all",
  pageSize: 10,
  currentPage: 1,
  cases: [],
  customers: [],
  tasks: [],
  selectedTicket: null,
  loaded: false
};

const consoleMenus = {
  Admin: ["Dashboard", "User Onboarding", "User Offboarding", "Integrations", "Automation Rules", "Compliance Purge", "Tasks", "Permissions", "Settings"],
  Agent: ["Dashboard", "Tickets", "Create Contact", "Escalate Ticket", "Tasks"],
  Sales: ["Dashboard", "Pipeline Tickets", "Sales Pipeline", "Tasks"],
  Supervisor: ["Dashboard", "Live Queue", "Resolve Escalation", "QA Evaluation", "Agent Performance", "Tasks", "Permissions"]
};

const workflowSteps = {
  "User Onboarding": ["Admin opens User Management panel", "Click 'Add User' and complete profile form", "Assign role: Agent / Supervisor / Admin", "Set team and queue assignments", "Send welcome email with temp credentials", "Force password reset on first login"],
  "User Offboarding": ["Locate user in directory, click 'Deactivate'", "System re-assigns open tickets", "Session tokens invalidated", "Audit log entry created", "30-day data retention window begins"],
  "Integrations": ["Navigate to Integrations > Add New", "Select connector (Email / SMS / CRM sync / ERP)", "Enter credentials and authorize", "Map data fields between systems", "Set sync frequency and conflict rules", "Activate integration"],
  "Automation Rules": ["Open Automation > Rules > New Rule", "Define trigger event (ticket created, field changed, etc.)", "Set conditions (filters, field values, time windows)", "Add actions (assign, tag, escalate, notify)", "Set priority order vs. other rules", "Test rule on sample data", "Activate rule"],
  "Compliance Purge": ["Receive GDPR / CCPA deletion request", "Search records by customer identifier", "Admin reviews records for legal hold flags", "Execute purge on eligible records", "Generate compliance certificate", "Log completion in audit trail"],
  "Create Contact": ["Search for existing contact profile", "If no match, open blank contact layout form", "Enter required name, channel, and company fields", "Add optional rich text custom attributes", "Save record to main CRM data registries", "Link contact record directly to open cases", "Execute backend system deduplication checks"],
  "Escalate Ticket": ["Determine structural escalation dependency requirement", "Select appropriate taxonomy reason code parameter", "Log custom handoff context data summary notes", "Raise record execution priority metadata states", "Log compliance immutable event trail profile", "Verify reading authority configurations remain active"],
  "Live Queue": ["Supervisor mounts live status tracking panel", "Review volume depths, handle times, and count metrics", "Identify at-risk items matching target criteria", "Rebalance queue routing layers manually with overrides", "Broadcast real-time push alert parameters to operators", "Log monitoring actions into internal logs registry"],
  "Resolve Escalation": ["Receive notification alert item from tracking engine", "Load complete interaction trace logs history", "Assess user sentiment scoring array variables", "Leverage tools to communicate with client or coach", "Commit definitive structural resolution properties", "Log procedural root cause attribution metrics", "Flag node to trigger quality compliance checks"],
  "QA Evaluation": ["Isolate targeted transaction data entry channel node", "Render context matching strict grading parameters", "Provide numerical scoring values across operational vectors", "Populate contextual coaching action field strings", "Submit verified validation metrics securely to index", "Recalculate running statistical trend metrics profile", "Generate immediate secondary learning tasks if required"],
  "Agent Performance": ["Access target team member profile workspace link", "Aggregate baseline KPIs: AHT, CSAT, FCR, and SLAs", "Render team standard overlay performance variables", "Isolate specific professional development opportunities", "Log review execution timeline metrics securely to disk", "Establish rigid future performance criteria matrices"]
};

async function loadBackendData() {
  try {
    const res = await fetch('/api/state');
    const state = await res.json();
    const rawCases = state.cases || [];
    backendState.cases = rawCases.map(c => ({
      id: c.id || c.ticket_id || "40291",
      subject: c.subject || c.ticket_subject || "Access Token Synchronization Failure",
      customer: c.customer || c.customer_email || "acme_corp@enterprise.com",
      priority: c.priority || "Critical",
      status: c.status || "Open",
      assignee: c.assignee || "John Smith",
      created: c.created || "May 13, 10:30 AM"
    }));
    backendState.loaded = true;
  } catch (e) {
    console.log("Using baseline arrays.");
  }
  
  if (backendState.cases.length === 0 || backendState.cases.every(c => typeof c.id === 'string' && isNaN(c.id))) {
    backendState.cases = [
      {id:"40291", subject:"Late fee after rescheduling", customer:"maya@example.com", priority:"High", status:"Open", assignee:"John Smith", created:"Jul 4, 2026"},
      {id:"40292", subject:"Gift note missing from order", customer:"sophia@example.com", priority:"Medium", status:"Open", assignee:"John Smith", created:"Jul 4, 2026"},
      {id:"40293", subject:"CRM stage conflicts with Square activity", customer:"jordan@example.com", priority:"Critical", status:"Open", assignee:"John Smith", created:"Jul 4, 2026"},
      {id:"40105", subject:"Payment processing timeout loop", customer:"kurt@example.com", priority:"High", status:"Closed", assignee:"John Smith", created:"Jul 2, 2026"},
      {id:"40106", subject:"Webhooks dropping delivery verification headers", customer:"elena@example.com", priority:"Low", status:"Closed", assignee:"John Smith", created:"Jul 2, 2026"},
      {id:"40107", subject:"Password recovery token expiration sync drift", customer:"marcus@example.com", priority:"Medium", status:"Closed", assignee:"John Smith", created:"Jul 1, 2026"}
    ];
    for (let i = 1; i <= 30; i++) {
      backendState.cases.push({
        id: (40110 + i).toString(),
        subject: `Archived resolution batch reference tracking case context index #${i}`,
        customer: `archive.user.${i}@enterprise.com`,
        priority: i % 3 === 0 ? "Critical" : "Low",
        status: "Closed",
        assignee: "John Smith",
        created: "Jun 28, 2026"
      });
    }
  }
  render();
}

function render() {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    document.body.innerHTML = `<div id="app" style="display:flex; min-height:100vh; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f8fafc; color:#0f172a;"></div>`;
    return render();
  }

  const activeTabsList = consoleMenus[backendState.currentConsole] || consoleMenus.Agent;
  const sidebarHtml = `
    <aside style="width:260px; background:#0f172a; color:#f8fafc; padding:24px 16px; display:flex; flex-direction:column; justify-content:space-between; border-right:1px solid #1e293b; flex-shrink:0;">
      <div>
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:32px; padding-left:8px;">
          <div style="width:28px; height:28px; background:#2563eb; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:white; font-size:0.9rem;">A</div>
          <h2 style="margin:0; font-size:1.15rem; font-weight:700; color:white;">Amitalux Support</h2>
        </div>
        <div style="margin-bottom:28px;">
          <span style="font-size:0.68rem; font-weight:800; text-transform:uppercase; color:#475569; letter-spacing:0.05em; display:block; margin-bottom:8px; padding-left:8px;">Active Console Scope</span>
          <select id="consoleScopeSelector" style="width:100%; height:36px; background:#1e293b; border:1px solid #334155; border-radius:6px; color:white; padding:0 8px; font-weight:600; font-size:0.85rem; cursor:pointer;">
            <option value="Agent" ${backendState.currentConsole==='Agent'?'selected':''}>🎧 Agent Workspace</option>
            <option value="Sales" ${backendState.currentConsole==='Sales'?'selected':''}>💼 Sales Console</option>
            <option value="Admin" ${backendState.currentConsole==='Admin'?'selected':''}>⚙️ Admin Configuration</option>
            <option value="Supervisor" ${backendState.currentConsole==='Supervisor'?'selected':''}>📊 Supervisor Terminal</option>
          </select>
        </div>
        <nav style="display:flex; flex-direction:column; gap:4px;">
          <span style="font-size:0.68rem; font-weight:800; text-transform:uppercase; color:#475569; letter-spacing:0.05em; display:block; margin-bottom:8px; padding-left:8px;">Workspace Tracks</span>
          ${activeTabsList.map(tab => {
            const isActive = backendState.currentTab === tab;
            return `
              <button data-sidebar-tab="${tab}" style="text-align:left; background:${isActive?'#2563eb':'transparent'}; color:${isActive?'white':'#94a3b8'}; border:none; padding:10px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:0.88rem; display:flex; align-items:center; gap:10px;">
                <span>${tab === 'Tickets' || tab === 'Live Queue' ? '📋' : tab === 'Dashboard' ? '📊' : '⚡'}</span>
                ${tab}
              </button>
            `;
          }).join('')}
        </nav>
      </div>
      <div style="border-top:1px solid #1e293b; padding-top:16px; display:flex; align-items:center; gap:12px;">
        <div style="width:36px; height:36px; background:#2563eb; border-radius:999px; display:flex; align-items:center; justify-content:center; font-weight:bold; color:white;">JS</div>
        <div>
          <h4 style="margin:0; font-size:0.85rem; color:white;">John Smith</h4>
          <span style="font-size:0.72rem; color:#64748b;">System ${backendState.currentConsole}</span>
        </div>
      </div>
    </aside>
  `;

  let workspaceBodyHtml = "";
  if (backendState.currentTab === "Dashboard") {
    if (backendState.currentConsole === "Agent") {
      const openCount = backendState.cases.filter(c => c.assignee === "John Smith" && c.status === "Open").length;
      const criticalCount = backendState.cases.filter(c => c.assignee === "John Smith" && c.status === "Open" && c.priority === "Critical").length;
      const closedCount = backendState.cases.filter(c => c.assignee === "John Smith" && c.status === "Closed").length;

      workspaceBodyHtml = `
        <h1 style="font-size:1.75rem; font-weight:700; color:#0f172a; margin:0 0 4px 0;">Welcome back, John! 👋</h1>
        <p style="margin:0 0 24px 0; color:#64748b; font-size:0.92rem;">Your personalized support metrics overview profile.</p>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px;">
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;"><span style="font-size:0.85rem; color:#64748b; font-weight:600;">My Open Tickets</span><h2 style="margin:8px 0; font-size:1.85rem;">${openCount}</h2><span style="color:#2563eb; font-size:0.75rem; font-weight:600;">Active Queue Scope</span></div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;"><span style="font-size:0.85rem; color:#64748b; font-weight:600;">My Critical Issues</span><h2 style="margin:8px 0; font-size:1.85rem;">${criticalCount}</h2><span style="color:#dc2626; font-size:0.75rem; font-weight:600;">⚠️ Immediate Priority</span></div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;"><span style="font-size:0.85rem; color:#64748b; font-weight:600;">My Closed (This Month)</span><h2 style="margin:8px 0; font-size:1.85rem;">${closedCount}</h2><span style="color:#16a34a; font-size:0.75rem; font-weight:600;">▲ Real-time Performance</span></div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;"><span style="font-size:0.85rem; color:#64748b; font-weight:600;">Personal CSAT Score</span><h2 style="margin:8px 0; font-size:1.85rem;">4.92</h2><span style="color:#16a34a; font-size:0.75rem; font-weight:600;">★ Top 2% of Team</span></div>
        </div>
      `;
    } else {
      const globalOpen = backendState.cases.filter(c => c.status === "Open").length;
      const globalCritical = backendState.cases.filter(c => c.priority === "Critical").length;
      const globalClosed = backendState.cases.filter(c => c.status === "Closed").length;

      workspaceBodyHtml = `
        <div style="margin-bottom:24px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
          <span style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#2563eb;">Console Focus: Global Operations Administration</span>
          h1 style="font-size:1.6rem; font-weight:700; color:#0f172a; margin:4px 0 0 0;">Enterprise Operations Dashboard</h1>
        </div>
        
        <!-- Live Investor Testing Simulation Panel -->
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:16px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h4 style="margin:0 0 4px 0; color:#1e40af; font-size:0.9rem; font-weight:700;">🤖 Live Value-Proposition Simulator</h4>
            <p style="margin:0; color:#1e3a8a; font-size:0.78rem;">Test how Amitalux eliminates manual work. Trigger a simulated inbound email to watch the background parsing engine work live.</p>
          </div>
          <button id="triggerLiveEmailSimulationBtn" style="background:#2563eb; color:white; border:none; padding:8px 14px; border-radius:6px; font-weight:700; font-size:0.8rem; cursor:pointer; box-shadow:0 2px 4px rgba(37,99,235,0.2);">⚡ Simulate Inbound Email</button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:24px;">
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:18px;"><span style="font-size:0.8rem; color:#64748b; font-weight:600;">System Open Tickets</span><h2 style="margin:6px 0; font-size:1.6rem; color:#0f172a;">${globalOpen}</h2><span style="color:#2563eb; font-size:0.72rem; font-weight:600;">Active Pipeline Registry</span></div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:18px;"><span style="font-size:0.8rem; color:#64748b; font-weight:600;">Global Critical Issues</span><h2 style="margin:6px 0; font-size:1.6rem; color:#dc2626;">${globalCritical}</h2><span style="color:#dc2626; font-size:0.72rem; font-weight:600;">Requires Dispatch Focus</span></div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:18px;"><span style="font-size:0.8rem; color:#64748b; font-weight:600;">System CSAT Average</span><h2 style="margin:6px 0; font-size:1.6rem; color:#16a34a;">4.78 / 5.0</h2><span style="color:#16a34a; font-size:0.72rem; font-weight:600;">▲ 0.14 Target Margin</span></div>
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:18px;"><span style="font-size:0.8rem; color:#64748b; font-weight:600;">Total Closed Archive</span><h2 style="margin:6px 0; font-size:1.6rem; color:#475569;">${globalClosed}</h2><span style="color:#64748b; font-size:0.72rem; font-weight:600;">SLA Complete State</span></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
            <h4 style="margin:0 0 16px 0; font-size:0.9rem; color:#1e293b; font-weight:700;">Open Tickets by Age (SLA Pipeline Depth)</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>0 - 24 Hours</span><span>12 Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:35%; height:100%; background:#2563eb;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>24 - 72 Hours</span><span>24 Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:65%; height:100%; background:#f59e0b;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>72+ Hours Breach Window</span><span>5 Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:15%; height:100%; background:#dc2626;"></div></div>
              </div>
            </div>
          </div>

          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
            <h4 style="margin:0 0 16px 0; font-size:0.9rem; color:#1e293b; font-weight:700;">Open Tickets by Customer Anchor</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>maya@example.com</span><span>15 Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:45%; height:100%; background:#6366f1;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>jordan@example.com</span><span>18 Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:55%; height:100%; background:#6366f1;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>sophia@example.com</span><span>8 Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:25%; height:100%; background:#6366f1;"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
            <h4 style="margin:0 0 16px 0; font-size:0.9rem; color:#1e293b; font-weight:700;">Active Load Allocation by Support Operators</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>John Smith (Active Session)</span><span>3 Open / 33 Closed</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:50%; height:100%; background:#14b8a6;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>Priya Sharma</span><span>14 Open / 45 Closed</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:75%; height:100%; background:#14b8a6;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>Sarah Jenkins</span><span>9 Open / 28 Closed</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:42%; height:100%; background:#14b8a6;"></div></div>
              </div>
            </div>
          </div>

          <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
            <h4 style="margin:0 0 16px 0; font-size:0.9rem; color:#1e293b; font-weight:700;">Pipeline Volume Density by Lifecycle Status</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>Open Pipeline State Scope</span><span>${globalOpen} Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:25%; height:100%; background:#06b6d4;"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px; font-weight:600; color:#475569;"><span>Closed Operational Archive Registry</span><span>${globalClosed} Cases</span></div>
                <div style="width:100%; height:8px; background:#f1f5f9; border-radius:4px; overflow:hidden;"><div style="width:85%; height:100%; background:#3b82f6;"></div></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } else if (backendState.currentTab === "Tickets" || backendState.currentTab === "Live Queue") {
    const scopedAgentCases = backendState.cases.filter(c => c.assignee === "John Smith");
    const filteredCases = scopedAgentCases.filter(t => {
      if (backendState.activeFilter === 'at-risk') return t.status === 'Open' && (t.priority === 'Critical' || t.priority === 'High');
      if (backendState.activeFilter === 'closed') return t.status === 'Closed';
      return t.status === 'Open';
    });

    const countOpen = scopedAgentCases.filter(c => c.status === 'Open').length;
    const countAtRisk = scopedAgentCases.filter(c => c.status === 'Open' && (c.priority === 'Critical' || c.priority === 'High')).length;
    const countClosed = scopedAgentCases.filter(c => c.status === 'Closed').length;

    const totalItems = filteredCases.length;
    const totalPages = Math.ceil(totalItems / backendState.pageSize) || 1;
    if (backendState.currentPage > totalPages) backendState.currentPage = totalPages;
    
    const startIndex = (backendState.currentPage - 1) * backendState.pageSize;
    const endIndex = startIndex + backendState.pageSize;
    const paginatedCases = filteredCases.slice(startIndex, endIndex);

    let paginationControlsHtml = "";
    if (backendState.activeFilter === 'closed') {
      paginationControlsHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; background:#f8fafc; border-top:1px solid #e2e8f0; font-size:0.82rem; color:#64748b;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span>Show entries per page:</span>
            <select id="paginationSizeSelector" style="height:28px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600; cursor:pointer;">
              <option value="10" ${backendState.pageSize===10?'selected':''}>10</option>
              <option value="25" ${backendState.pageSize===25?'selected':''}>25</option>
              <option value="50" ${backendState.pageSize===50?'selected':''}>50</option>
            </select>
          </div>
          <div>Showing ${startIndex+1} to ${Math.min(endIndex, totalItems)} of ${totalItems} archival items</div>
          <div style="display:flex; gap:6px;">
            <button id="prevPageBtn" ${backendState.currentPage===1?'disabled':''} style="height:28px; padding:0 10px; border:1px solid #cbd5e1; background:white; border-radius:4px; cursor:pointer; font-weight:600; opacity:${backendState.currentPage===1?0.5:1};">◀ Prev</button>
            <span style="align-self:center; font-weight:700; color:#0f172a; padding:0 4px;">Page ${backendState.currentPage} of ${totalPages}</span>
            <button id="nextPageBtn" ${backendState.currentPage===totalPages?'disabled':''} style="height:28px; padding:0 10px; border:1px solid #cbd5e1; background:white; border-radius:4px; cursor:pointer; font-weight:600; opacity:${backendState.currentPage===totalPages?0.5:1};">Next ▶</button>
          </div>
        </div>
      `;
    }

    workspaceBodyHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h1 style="font-size:1.5rem; font-weight:700; color:#0f172a; margin:0;">Open Tickets</h1>
        <div style="display:flex; gap:8px;">
          <button style="height:36px; padding:0 14px; border:1px solid #cbd5e1; background:white; border-radius:6px; font-weight:600;">⚙️ Filters</button>
          <button style="height:36px; padding:0 14px; background:#2563eb; border:none; border-radius:6px; font-weight:600; color:white;">＋ New Ticket</button>
        </div>
      </div>
      <div style="display:flex; gap:24px; border-bottom:1px solid #e2e8f0; margin-bottom:20px;">
        <button data-filter-tab="all" style="background:transparent; border:none; padding:8px 0; font-weight:600; cursor:pointer; color:${backendState.activeFilter==='all'?'#2563eb':'#64748b'}; border-bottom:2px solid ${backendState.activeFilter==='all'?'#2563eb':'transparent'};">Open Tickets (${countOpen})</button>
        <button data-filter-tab="at-risk" style="background:transparent; border:none; padding:8px 0; font-weight:600; cursor:pointer; color:${backendState.activeFilter==='at-risk'?'#2563eb':'#64748b'}; border-bottom:2px solid ${backendState.activeFilter==='at-risk'?'#2563eb':'transparent'};">⚠️ At Risk (${countAtRisk})</button>
        <button data-filter-tab="closed" style="background:transparent; border:none; padding:8px 0; font-weight:600; cursor:pointer; color:${backendState.activeFilter==='closed'?'#2563eb':'#64748b'}; border-bottom:2px solid ${backendState.activeFilter==='closed'?'#2563eb':'transparent'};">✅ Closed Tickets (${countClosed})</button>
      </div>
      <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.88rem;">
          <thead>
            <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
              <th style="padding:14px 16px;">Ticket ID</th>
              <th style="padding:14px 16px;">Subject Matter</th>
              <th style="padding:14px 16px;">Customer Linked</th>
              <th style="padding:14px 16px;">Priority Profile</th>
              <th style="padding:14px 16px;">Assignee</th>
            </tr>
          </thead>
          <tbody>
            ${(() => {
              // Apply domain traffic segregation logic filters
              let filteredList = [...paginatedCases];
              if (backendState.currentConsole === 'Agent') {
                // Strip out pipeline items from the client care support workspace tracks completely
                filteredList = filteredList.filter(t => !t.subject.toLowerCase().includes('crm') && !t.customer.includes('jordan'));
              } else if (backendState.currentConsole === 'Sales') {
                // Isolate sales pipeline traffic specifically to this dashboard environment
                filteredList = backendState.cases.filter(t => t.subject.toLowerCase().includes('crm') || t.customer.includes('jordan') || t.customer.includes('maya'));
              }
              
              if (filteredList.length === 0) {
                return `<tr><td colspan="5" style="padding:32px; text-align:center; color:#94a3b8; font-weight:500;">No records match your filters.</td></tr>`;
              }
              
              return filteredList.map(t => `
                <tr data-open-ticket-id="${t.id}" style="border-bottom:1px solid #f1f5f9; cursor:pointer; background:${t.status==='Closed'?'#fafafa':''};">
                  <td style="padding:14px 16px; font-weight:700; color:#2563eb;">#${t.id}</td>
                  <td style="padding:14px 16px; font-weight:600; color:${t.status==='Closed'?'#64748b':''}">${t.subject}</td>
                  <td style="padding:14px 16px;">${t.customer}</td>
                  <td style="padding:14px 16px;"><span style="background:${t.status==='Closed'?'#e2e8f0':t.priority==='Critical'?'#fee2e2':'#fef3c7'}; color:${t.status==='Closed'?'#475569':t.priority==='Critical'?'#991b1b':'#92400e'}; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:700;">● ${t.status==='Closed'?'Closed':t.priority}</span></td>
                  <td style="padding:14px 16px;">${t.assignee}</td>
                </tr>
              `).join('');
            })()}
          </tbody>
        </table>
        ${paginationControlsHtml}
      </div>
    `;
  } else {
    const steps = workflowSteps[backendState.currentTab] || [];
    let operationalActionFormHtml = `
      <h3 style="margin-top:0; font-size:1rem; margin-bottom:16px; color:#334155;">Action Control Panel</h3>
      <button onclick="alert('Simulation executed.')" style="width:100%; height:36px; background:#2563eb; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">Trigger Target Function</button>
    `;

    if (backendState.currentTab === "User Onboarding") {
      operationalActionFormHtml = `
        <h3 style="margin-top:0; font-size:1rem; margin-bottom:16px; color:#334155; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">＋ Onboard Teammate</h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Full Name <input id="onboardName" type="text" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;" placeholder="Sarah Jenkins"></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Role Allocation <select id="onboardRole" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;"><option value="Agent">Agent</option><option value="Supervisor">Supervisor</option><option value="Admin">Admin</option></select></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Queue Assignment <input id="onboardQueue" type="text" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;" value="Tier 1 Core Support"></label>
          <button id="submitOnboardUserBtn" style="height:36px; background:#16a34a; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer; margin-top:8px;">Save & Activate Account</button>
        </div>
      `;
    } else if (backendState.currentTab === "User Offboarding") {
      operationalActionFormHtml = `
        <h3 style="margin-top:0; font-size:1rem; margin-bottom:16px; color:#334155; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">⚠️ Deactivate Teammate</h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Select Active Operator <select id="offboardUserSelect" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;"><option value="Sarah J.">Sarah J. (1 open case)</option><option value="Mike R.">Mike R. (1 open case)</option></select></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Reassignment Queue Target <select style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;"><option>Unassigned Global Operations Queue</option></select></label>
          <button id="submitOffboardUserBtn" style="height:36px; background:#dc2626; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer; margin-top:8px;">Deprovision User Session</button>
        </div>
      `;
    } else if (backendState.currentTab === "Sales Pipeline") {
    operationalActionFormHtml = `
      <div style="font-family: sans-serif; display: flex; flex-direction: column; gap: 20px;">
        <!-- Upper Analytical Dashboard Overview Block -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Active Pipeline Value</div>
            <div style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px;">$645,000</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Pipeline Leads</div>
            <div style="font-size: 22px; font-weight: 800; color: #2563eb; margin-top: 4px;">18 Accounts</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Avg. Conv. Propensity</div>
            <div style="font-size: 22px; font-weight: 800; color: #10b981; margin-top: 4px;">76.4%</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Sync Integrations Status</div>
            <div style="font-size: 13px; font-weight: 700; color: #475569; margin-top: 10px; display: flex; align-items: center; gap: 4px;">
              <span style="width: 8px; height: 8px; background: #10b981; border-radius: 999px;"></span> Amitalux Native CRM
            </div>
          </div>
        </div>

        <!-- CRM Interactive Hub Control Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px;">
          <h3 style="margin: 0; font-size: 16px; color: #0f172a;">💼 Inbound Pipeline Opportunities</h3>
          <button type="button" style="background: #2563eb; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">+ Provision New Lead</button>
        </div>

        <!-- Master Pipeline Lead Registry Data Grid Matrix -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 600;">
                <th style="padding: 12px 16px;">Lead Profile / ID</th>
                <th style="padding: 12px 16px;">Stage / Intent</th>
                <th style="padding: 12px 16px;">Firmographics Matrix</th>
                <th style="padding: 12px 16px;">Primary Stakeholder / Contacts</th>
                <th style="padding: 12px 16px;">Next Strategic Step</th>
                <th style="padding: 12px 16px; text-align: right;">AI Score</th>
              </tr>
            </thead>
            <tbody>
              <!-- Row 1: Widgets Express -->
              <tr style="border-bottom: 1px solid #f1f5f9; hover: background: #fafafa;">
                <td style="padding: 14px 16px;">
                  <strong style="color: #0f172a; display: block;">Widgets Express</strong>
                  <code style="font-size: 11px; color: #64748b;">LEAD1000</code>
                </td>
                <td style="padding: 14px 16px;">
                  <span style="background: #eff6ff; color: #2563eb; font-weight: 600; font-size: 11px; padding: 2px 6px; border-radius: 4px;">Discovery</span>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">High Buying Intent</div>
                </td>
                <td style="padding: 14px 16px; color: #334155; font-size: 12px; line-height: 1.4;">
                  <div>Size: 145 Employees</div>
                  <div>Rev: $40M Mid-Market</div>
                </td>
                <td style="padding: 14px 16px;">
                  <span style="color: #0f172a; font-weight: 500; display: block;">Marie Curie <code style="font-size:10px; color:#64748b;">(REPL1001)</code></span>
                  <span style="font-size: 11px; color: #64748b;">marie@widgetsexpress.com</span>
                </td>
                <td style="padding: 14px 16px; color: #475569; max-width: 200px;">
                  Coordinate interactive engineering workflow architectural demo.
                </td>
                <td style="padding: 14px 16px; text-align: right; font-weight: 700; color: #10b981;">84%</td>
              </tr>

              <!-- Row 2: Maya Inbound Inferred Pipeline Profile Entry -->
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 16px;">
                  <strong style="color: #0f172a; display: block;">Inferred Pipeline Entry</strong>
                  <code style="font-size: 11px; color: #64748b;">LEAD1004</code>
                </td>
                <td style="padding: 14px 16px;">
                  <span style="background: #fef3c7; color: #d97706; font-weight: 600; font-size: 11px; padding: 2px 6px; border-radius: 4px;">Awaiting Sync</span>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Late Fee Inquiry</div>
                </td>
                <td style="padding: 14px 16px; color: #64748b; font-size: 12px; font-style: italic;">
                  AI Data enrichment crawler evaluating...
                </td>
                <td style="padding: 14px 16px;">
                  <span style="color: #0f172a; font-weight: 500; display: block;">Maya <code style="font-size:10px; color:#64748b;">(REPL1005)</code></span>
                  <span style="font-size: 11px; color: #64748b;">maya@example.com</span>
                </td>
                <td style="padding: 14px 16px; color: #475569; max-width: 200px;">
                  Verify billing constraint exceptions before retention score drops.
                </td>
                <td style="padding: 14px 16px; text-align: right; font-weight: 700; color: #3b82f6;">78%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (backendState.currentTab === "Create Contact") {
      const uniqueCompanies = [...new Set(backendState.cases.map(c => c.customer))];
      operationalActionFormHtml = `
        <h3 style="margin-top:0; font-size:1rem; margin-bottom:16px; color:#334155; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">👤 Rich Contact Profile Directory Builder</h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:0.82rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">First Name<input id="contactFirst" type="text" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="Alex"></label>
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Middle Name<input id="contactMiddle" type="text" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="J."></label>
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Last Name<input id="contactLast" type="text" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="Rivera"></label>
          </div>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Email Address<input id="contactEmail" type="email" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="alex.rivera@enterprise.com"></label>
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:10px;">
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Phone No (with Country Code)<input id="contactPhone" type="text" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="+1 (555) 019-2834"></label>
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Country<input id="contactCountry" type="text" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="United States"></label>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Work Timezone<select id="contactTimezone" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;"><option>America/New_York (EST)</option><option>America/Los_Angeles (PST)</option><option>Europe/London (GMT)</option><option>Asia/Tokyo (JST)</option></select></label>
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Role in Company<input id="contactRole" type="text" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;" placeholder="VP of Procurement"></label>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Account Status<select id="contactStatus" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;"><option value="Active">Active</option><option value="Suspended">Suspended</option><option value="Deactivated">Deactivated</option></select></label>
            <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Classification Relationship<select id="contactType" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;"><option value="Customer">Customer Account</option><option value="Partner">Strategic Partner</option></select></label>
          </div>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Company Link Selection<select id="contactCompanyLink" style="height:32px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px; font-size:0.82rem;">
            ${uniqueCompanies.map(comp => `<option value="${comp}">${comp}</option>`).join('')}
          </select></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Support Notes for the Contact<textarea id="liveReplyInputTextArea" style="width: 100%; min-height: 180px; padding: 12px; font-family: monospace; font-size: 14px; line-height: 1.5; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; box-sizing: border-box;"></textarea></label>
          <button id="submitCreateContactBtn" style="height:36px; background:#16a34a; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer; margin-top:6px;">Commit to Database Registry</button>
        </div>
      `;
    } else if (backendState.currentTab === "Escalate Ticket") {
      operationalActionFormHtml = `
        <h3 style="margin-top:0; font-size:1rem; margin-bottom:16px; color:#334155; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">🚀 Escalate Core Pipeline Item</h3>
        <div style="display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Customer's Core Issue <select id="escalateTicketSelect" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;">
            ${backendState.cases.map(c => `<option value="${c.id}">${c.id} - ${c.subject.substring(0,25)}...</option>`).join('')}
          </select></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Reason for Escalation <select id="escalateReason" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;"><option value="SLA Breach Risk">Critical SLA Breach Risk</option><option value="Technical Dependency">Complex Infrastructure Dependency</option><option value="Sentiment Escalation">Severe Negative Sentiment</option></select></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Escalation Priority <select id="escalatePriority" style="height:34px; border:1px solid #cbd5e1; border-radius:6px; padding:0 8px;"><option value="Standard Escalation">Standard Escalation</option><option value="Urgent Queue Focus">Urgent Queue Focus</option><option value="Critical Emergency SLA">Critical Emergency SLA</option></select></label>
          <label style="display:grid; gap:4px; font-weight:600; color:#475569;">Handoff Context Notes <textarea id="liveReplyInputTextArea" style="width: 100%; min-height: 180px; padding: 12px; font-family: monospace; font-size: 14px; line-height: 1.5; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; box-sizing: border-box;"></textarea></label>
          <button id="submitEscalateTicketBtn" style="height:36px; background:#2563eb; color:white; border:none; border-radius:6px; font-weight:600; cursor:pointer; margin-top:4px;">Dispatch to Supervisor Queue</button>
        </div>
      `;
    }

    workspaceBodyHtml = `
      <div style="margin-bottom:24px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
        <span style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#2563eb;">Console Focus: ${backendState.currentConsole}</span>
        <h1 style="font-size:1.6rem; font-weight:700; color:#0f172a; margin:4px 0 0 0;">${backendState.currentTab} Module</h1>
      </div>
      <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:24px;">
        <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:24px;">
          <h3 style="margin-top:0; font-size:1rem; margin-bottom:16px; color:#334155;">Automation Procedure Actions</h3>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${steps.map((st, idx) => `
              <div style="display:flex; gap:14px;">
                <div style="width:22px; height:22px; background:#eff6ff; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#2563eb; font-weight:700; font-size:0.75rem; flex-shrink:0;">${idx+1}</div>
                <p style="margin:0; font-size:0.88rem; color:#334155; font-weight:500;">${st}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:24px; height:fit-content;">
          ${operationalActionFormHtml}
        </div>
      </div>
    `;
  }

  let modalOverlayHtml = "";
  if (backendState.selectedTicket) {
    const tk = backendState.selectedTicket;
    modalOverlayHtml = `
      <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;">
        <div style="background:white; width:100%; max-width:850px; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; max-height:90vh; box-shadow:0 20px 25px rgba(0,0,0,0.15);">
          <div style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:between; align-items:center; background:#f8fafc;">
            <button id="closeModalOverlayBtn" style="background:transparent; border:none; color:#64748b; font-weight:600; cursor:pointer;">◀ Back to list</button>
          </div>
          <div style="padding:24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:20px;">
            <h2>#${tk.id} — ${tk.subject}</h2>
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
              
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #ffffff;">
                <h4 style="margin: 0; font-size: 15px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">📥 Conversation Context</h4>
                <div style="font-size: 13px; color: #64748b; line-height: 1.4;">
                  <div><strong>Inbound Channel:</strong> Live Chat Widget (Website)</div>
                  <div><strong>Ticket Priority Profile:</strong> ${tk.priority}</div>
                  <div><strong>Assignee Scope:</strong> ${tk.assignee || 'Unassigned'}</div>
                </div>
                <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e1; flex-grow: 1;">
                  <strong style="font-size: 12px; color: #475569; display: block; margin-bottom: 4px;">Inbound Subject Issue:</strong>
                  <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #334155; font-weight: 600;">
                    ${tk.subject}
                  </p>
                </div>
              </div>

              <div id="dynamicProfileHubContainer" style="background: #ffffff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); max-height: 320px; overflow-y: auto;">
                
                ${(() => {
                  const currentCustomerEmail = tk.customer || '';
                  const derivedName = currentCustomerEmail.split('@')[0].split('.')[0];
                  const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
                  
                  // If it's Maya or an unmapped contact email, render their exact dynamic Lead record parameters
                  if (currentCustomerEmail.includes('maya') || currentCustomerEmail.includes('@')) {
                    return `
                    <div id="crmLeadViewBlock">
                      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                          <span style="background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Inbound Pipeline Lead</span>
                          <h3 style="margin: 4px 0 2px 0; font-size: 16px; color: #0f172a;">Potential Corporate Account</h3>
                          <a href="#" style="font-size: 12px; color: #2563eb; text-decoration: none;">View Full Customer Profile ↗</a>
                        </div>
                        <div style="text-align: right;">
                          <div style="font-size: 16px; font-weight: 800; color: #3b82f6;">78%</div>
                          <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">AI Intent Score</span>
                        </div>
                      </div>

                      <div style="display: grid; grid-template-columns: 1fr; gap: 4px; background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 11px; border: 1px solid #f1f5f9; line-height: 1.4;">
                        <div><strong>Linked Core Contact:</strong> ${currentCustomerEmail}</div>
                        <div><strong>Inferred Customer Number:</strong> <code style="color:#0f172a; font-weight:600;">LEAD1004</code></div>
                        <div><strong>Pipeline Assignment Stage:</strong> <span style="color:#eab308; font-weight:600;">Awaiting Ingestion Sync</span></div>
                        <div><strong>Ticket Complication Log:</strong> Flagged as outstanding for billing parameters.</div>
                      </div>

                      <h4 style="margin: 12px 0 4px 0; font-size: 11px; text-transform: uppercase; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 6px;">👥 Inbound Contact Stakeholders</h4>
                      <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 4px;">
                        <div style="font-size: 11px; border: 1px solid #e2e8f0; padding: 5px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; background: #ffffff;">
                          <div>
                            <strong>${formattedName}</strong> <code style="font-size:9px; color:#64748b;">(REPL1005)</code> <span style="color:#2563eb; font-size:9px;">★ Source Channel</span>
                            <div style="color:#64748b; font-size:10px;">${currentCustomerEmail}</div>
                          </div>
                          <span style="font-size: 9px; font-weight:700; color:#2563eb; background:#eff6ff; padding:1px 3px; border-radius:4px;">Inbound</span>
                        </div>
                      </div>
                    </div>`;
                  }
                })()}

              </div>
            </div>
            <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
              <textarea id="liveReplyInputTextArea" style="width: 100%; min-height: 180px; padding: 12px; font-family: monospace; font-size: 14px; line-height: 1.5; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; box-sizing: border-box;"></textarea>
              <button id="triggerAIOperationalDraftBtn" style="margin-top:10px; margin-right:8px; height:36px; padding:0 14px; background:#eff6ff; color:#2563eb; border:none; border-radius:6px; font-weight:700; cursor:pointer;">🤖 Draft with Customer Memory</button>
              <button id="approveAndSendReplyBtn" style="margin-top:10px; height:36px; padding:0 14px; background:#10b981; color:#ffffff; border:none; border-radius:6px; font-weight:700; cursor:pointer;">✉️ Approve & Send Response</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  appRoot.innerHTML = `
    ${sidebarHtml}
    <main style="flex:1; padding:32px 40px; overflow-y:auto; background:#f8fafc;">
      ${workspaceBodyHtml}
    </main>
    ${modalOverlayHtml}
  `;
}

document.body.addEventListener('click', function(e) {
  const tabBtn = e.target.closest('[data-sidebar-tab]');
  if (tabBtn) {
    backendState.currentTab = tabBtn.getAttribute('data-sidebar-tab');
    backendState.currentPage = 1;
    render();
    return;
  }
  const filterTab = e.target.closest('[data-filter-tab]');
  if (filterTab) {
    backendState.activeFilter = filterTab.getAttribute('data-filter-tab');
    backendState.currentPage = 1;
    render();
    return;
  }
  const rowTarget = e.target.closest('[data-open-ticket-id]');
  if (rowTarget) {
    const targetId = rowTarget.getAttribute('data-open-ticket-id');
    backendState.selectedTicket = backendState.cases.find(c => c.id === targetId);
    render();
    return;
  }
    const dismissBtn = e.target.closest('#closeModalOverlayBtn');
  if (dismissBtn) {
    backendState.selectedTicket = null;
    render();
    return;
  }
  
  aiDraftBtn = e.target.closest('#triggerAIOperationalDraftBtn');
  if (aiDraftBtn && backendState.selectedTicket) {
    e.preventDefault();
    const tk = backendState.selectedTicket;
    const txtArea = document.getElementById("liveReplyInputTextArea");
    if(txtArea) txtArea.value = "Analyzing context metrics and personalizing draft response...";
    
    setTimeout(() => {
      if(txtArea) {
        let rawName = tk.customer || "there";
        let firstName = rawName.split('@')[0].split('.')[0];
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        
        const subjectLower = tk.subject.toLowerCase();
        let contextualBody = "";
        
        if (subjectLower.includes("fee") || subjectLower.includes("charge") || subjectLower.includes("billing")) {
          contextualBody = `I took a look at your account notes regarding the ${tk.subject.toLowerCase()}. I completely understand wanting to get this sorted out quickly, especially after adjusting your schedule.\n\nI've gone ahead and opened up your profile details here, and I'm personally reviewing the waiver criteria to see how we can waive or credit this back for you.`;
        } else {
          contextualBody = `I received your note about the "${tk.subject.toLowerCase()}" and wanted to reach out right away. I know how disruptive this can be to your day.\n\nI'm digging into our active account logs right now to see exactly what happened here so we can get it completely squared away for you.`;
        }

        txtArea.value = `Hi ${firstName},\n\n${contextualBody}\n\nI'll send another update over to you as soon as I have a concrete solution, but please let me know if any other details pop up in the meantime.\n\nBest,\n${tk.assignee || "John Smith"}`;
      }
    }, 950);
    return;
  }

  // 3.5 Approve & Send Resolution Workflow Handler
  approveSendBtn = e.target.closest('#approveAndSendReplyBtn');
  if (approveSendBtn && backendState.selectedTicket) {
    e.preventDefault();
    const tk = backendState.selectedTicket;
    tk.priority = "Closed";
    backendState.selectedTicket = null;
    render();
    return;
  }

  const prevBtn = e.target.closest('#prevPageBtn');
  if (prevBtn && backendState.currentPage > 1) {
    backendState.currentPage--;
    render();
    return;
  }
  const nextBtn = e.target.closest('#nextPageBtn');
  if (nextBtn) {
    backendState.currentPage++;
    render();
    return;
  }

  // Handle Agent Contact Record Creation submissions dynamically
  const contactSubmit = e.target.closest('#submitCreateContactBtn');
  if (contactSubmit) {
    const fName = document.getElementById("contactFirst").value || "Alex";
    const lName = document.getElementById("contactLast").value || "Rivera";
    const email = document.getElementById("contactEmail").value;
    const company = document.getElementById("contactCompanyLink").value;
    const status = document.getElementById("contactStatus").value;
    
    alert(`Success! Created Profile: ${fName} ${lName}\n` +
          `• Mail Target: ${email}\n` +
          `• Corporate Anchor: ${company}\n` +
          `• Status State: ${status}\n\n` +
          `Data package dispatched to Supabase contacts master register.`);
    render();
    return;
  }

  // Handle Agent Ticket Escalation triggers dynamically
  const escalateSubmit = e.target.closest('#submitEscalateTicketBtn');
  if (escalateSubmit) {
    const tId = document.getElementById("escalateTicketSelect").value;
    const reason = document.getElementById("escalateReason").value;
    const escPriority = document.getElementById("escalatePriority").value;
    const matchCase = backendState.cases.find(c => c.id === tId);
    if(matchCase) {
      matchCase.priority = escPriority.includes("Critical") ? "Critical" : "High";
      matchCase.status = "Escalated";
    }
    alert(`Success! Dispatched to Supervisor Console.\n` +
          `• Ticket ID: ${tId}\n` +
          `• Escalation Priority: ${escPriority}\n` +
          `• Primary Reason: ${reason}\n\n` +
          `System audit log trace appended.`);
    render();
    return;
  }

  // Handle Admin User Onboarding Form submissions dynamically in state
  const onboardSubmit = e.target.closest('#submitOnboardUserBtn');
  if (onboardSubmit) {
    const nameVal = document.getElementById("onboardName").value || "New User";
    const roleVal = document.getElementById("onboardRole").value;
    alert(`Success! Onboarded ${nameVal} as ${roleVal}. Applied system configuration tracking filters.`);
    render();
    return;
  }

  // Handle Admin User Offboarding deactivations dynamically
  const offboardSubmit = e.target.closest('#submitOffboardUserBtn');
  if (offboardSubmit) {
    const chosenUser = document.getElementById("offboardUserSelect").value;
    alert(`Success! Deprovisioned sessions for ${chosenUser}. Reassigned active records to Global Unassigned Queue.`);
    render();
    return;
  }

  const emailSimulateBtn = e.target.closest('#triggerLiveEmailSimulationBtn');
  if (emailSimulateBtn) {
    const subjects = [
      "Square API webhook activity token drift warning",
      "URGENT: Database replication buffer payload drop",
      "Checkout loop latency spike on production cluster",
      "Billing verification pipeline header mismatch"
    ];
    const dispatchers = ["engineering@acme.com", "cto@enterprise.io", "ops@scale-tech.net", "admin@payments-sync.org"];
    
    const randomIdx = Math.floor(Math.random() * subjects.length);
    const selectedSubject = subjects[randomIdx];
    const isUrgent = selectedSubject.includes("URGENT");
    const targetId = Math.floor(10000 + Math.random() * 90000).toString();

    // Dynamically inject a perfectly tracked record into global memory state arrays
    backendState.cases.unshift({
      id: targetId,
      subject: selectedSubject,
      customer: dispatchers[randomIdx],
      priority: isUrgent ? "Critical" : "High",
      status: "Open",
      assignee: "John Smith",
      created: "Jul 4, 2026"
    });
    
    render();
    
    // Create a high-fidelity, production-grade custom toast element dynamically
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#0f172a';
    toast.style.color = '#ffffff';
    toast.style.padding = '16px 20px';
    toast.style.borderRadius = '12px';
    toast.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)';
    toast.style.zIndex = '99999';
    toast.style.display = 'flex';
    toast.style.flexDirection = 'column';
    toast.style.gap = '6px';
    toast.style.maxWidth = '360px';
    toast.style.border = '1px solid #334155';
    toast.style.animation = 'slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="color:#3b82f6; font-size:1.1rem;">📥</span>
        <strong style="font-size:0.85rem; font-weight:600; color:#f8fafc;">Zero-Touch Capture Active</strong>
      </div>
      <p style="margin:0; font-size:0.78rem; color:#94a3b8; line-height:1.4;">
        Inbound communication intercepted from <span style="color:#cbd5e1; font-weight:500;">${dispatchers[randomIdx]}</span>. 
        Mapped automatically to numerical profile token <strong style="color:#3b82f6;">#${targetId}</strong> and routed to your queue.
      </p>
    `;
    
    // Inject the inline keyframe animation schema rules directly if missing
    if (!document.getElementById('toast-animation-style')) {
      const style = document.createElement('style');
      style.id = 'toast-animation-style';
      style.innerHTML = `@keyframes slideInToast { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 6000);
    return;
  }

  aiDraftBtn = e.target.closest('#triggerAIOperationalDraftBtn');
    // Reassign the already declared variable to our actual button ID
  aiDraftBtn = e.target.closest('#triggerAIOperationalDraftBtn');
  const tk = backendState.selectedTicket;
  if (aiDraftBtn && backendState.selectedTicket) {
    e.preventDefault();
    const txtArea = document.getElementById("liveReplyInputTextArea");
    if(txtArea) txtArea.value = "Generating automated response profile script text...";
    setTimeout(() => {
      if(txtArea) {
        // Extract a first name from email or string (e.g., "maya@example.com" -> "Maya")
        let rawName = tk.customer || "there";
        let firstName = rawName.split('@')[0].split('.')[0];
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        
        // Formulate a completely natural, humanized response based on the subject matter
        const subjectLower = tk.subject.toLowerCase();
        let contextualBody = "";
        
        if (subjectLower.includes("fee") || subjectLower.includes("charge") || subjectLower.includes("billing")) {
          contextualBody = `I took a look at your account notes regarding the ${tk.subject.toLowerCase()}. I completely understand wanting to get this sorted out quickly, especially after adjusting your schedule.\n\nI've gone ahead and opened up your profile details here, and I'm personally reviewing the waiver criteria to see how we can waive or credit this back for you.`;
        } else {
          contextualBody = `I received your note about the "${tk.subject.toLowerCase()}" and wanted to reach out right away. I know how disruptive this can be to your day.\n\nI'm digging into our active account logs right now to see exactly what happened here so we can get it completely squared away for you.`;
        }

        txtArea.value = `Hi ${firstName},

${contextualBody}

I'll send another update over to you as soon as I have a concrete solution, but please let me know if any other details pop up in the meantime.

Best,
${tk.assignee || "John Smith"}`;
      }
    }, 950);
    return;
  }

  // 3.5 Approve & Send Resolution Workflow Handler
  approveSendBtn = e.target.closest('#approveAndSendReplyBtn');
  if (approveSendBtn && backendState.selectedTicket) {
    e.preventDefault();
    const tk = backendState.selectedTicket;
    tk.priority = "Closed";
    backendState.selectedTicket = null;
    render();
    return;
  }
});

document.body.addEventListener('change', function(e) {
  if (e.target.id === 'paginationSizeSelector') {
    backendState.pageSize = parseInt(e.target.value);
    backendState.currentPage = 1;
    render();
    return;
  }
  if (e.target.id === 'consoleScopeSelector') {
    backendState.currentConsole = e.target.value;
    if (backendState.currentConsole === 'Admin') backendState.currentTab = 'Dashboard';
    if (backendState.currentConsole === 'Agent') backendState.currentTab = 'Tickets';
    if (backendState.currentConsole === 'Sales') backendState.currentTab = 'Pipeline Tickets';
    if (backendState.currentConsole === 'Supervisor') backendState.currentTab = 'Live Queue';
    backendState.selectedTicket = null;
    render();
  }
});

window.onload = loadBackendData;
loadBackendData();
