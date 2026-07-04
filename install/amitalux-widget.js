(function () {
  const script = document.currentScript;
  const apiBase = new URL(script.src).origin;

  const config = {
    workspace: script.dataset.workspace || "default",
    businessName: script.dataset.businessName || "the business",
    accent: script.dataset.accent || "#20232d",
    position: script.dataset.position || "right"
  };

  const style = document.createElement("style");
  style.textContent = `
    .amitalux-widget {
      position: fixed;
      ${config.position === "left" ? "left" : "right"}: 22px;
      bottom: 22px;
      z-index: 999999;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #20232d;
    }

    .amitalux-widget button,
    .amitalux-widget input,
    .amitalux-widget textarea {
      font: inherit;
    }

    .amitalux-launcher {
      border: 0;
      border-radius: 999px;
      background: ${config.accent};
      color: white;
      padding: 14px 18px;
      font-weight: 800;
      box-shadow: 0 18px 44px rgba(32, 35, 45, 0.25);
      cursor: pointer;
    }

    .amitalux-panel {
      width: min(380px, calc(100vw - 32px));
      margin-bottom: 12px;
      border: 1px solid #dfe5ef;
      border-radius: 12px;
      background: #fbfcff;
      box-shadow: 0 24px 70px rgba(32, 35, 45, 0.22);
      overflow: hidden;
    }

    .amitalux-panel[hidden] {
      display: none;
    }

    .amitalux-header {
      padding: 16px;
      border-bottom: 1px solid #dfe5ef;
      background: #eef3fb;
    }

    .amitalux-header span {
      display: block;
      color: #687284;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .amitalux-header strong {
      display: block;
      margin-top: 5px;
      font-size: 16px;
    }

    .amitalux-body {
      display: grid;
      gap: 10px;
      padding: 16px;
    }

    .amitalux-note {
      margin: 0;
      color: #687284;
      font-size: 14px;
      line-height: 1.45;
    }

    .amitalux-body label {
      display: grid;
      gap: 5px;
      color: #687284;
      font-size: 12px;
      font-weight: 800;
    }

    .amitalux-body input,
    .amitalux-body textarea {
      width: 100%;
      border: 1px solid #dfe5ef;
      border-radius: 8px;
      background: white;
      color: #20232d;
      padding: 10px;
      box-sizing: border-box;
    }

    .amitalux-body textarea {
      min-height: 92px;
      resize: vertical;
    }

    .amitalux-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
    }

    .amitalux-submit {
      border: 0;
      border-radius: 999px;
      background: ${config.accent};
      color: white;
      padding: 11px 15px;
      font-weight: 900;
      cursor: pointer;
    }

    .amitalux-close {
      border: 0;
      background: transparent;
      color: #687284;
      font-weight: 800;
      cursor: pointer;
    }

    .amitalux-status {
      min-height: 20px;
      color: #34846a;
      font-size: 13px;
      font-weight: 800;
    }
  `;

  const root = document.createElement("div");
  root.className = "amitalux-widget";
  root.innerHTML = `
    <section class="amitalux-panel" hidden>
      <div class="amitalux-header">
        <span>Amitalux Intelligence</span>
        <strong>${escapeHtml(config.businessName)} support</strong>
      </div>

      <form class="amitalux-body">
        <p class="amitalux-note">Tell us what happened. We will send this to the right person with the context they need.</p>

        <label>
          Name
          <input name="customerName" autocomplete="name" placeholder="Your name">
        </label>

        <label>
          Email
          <input name="customerEmail" type="email" autocomplete="email" required placeholder="you@example.com">
        </label>

        <label>
          Message
          <textarea name="message" required placeholder="How can we help?"></textarea>
        </label>

        <div class="amitalux-actions">
          <button class="amitalux-submit" type="submit">Send message</button>
          <button class="amitalux-close" type="button">Close</button>
        </div>

        <div class="amitalux-status" aria-live="polite"></div>
      </form>
    </section>

    <button class="amitalux-launcher" type="button">Need help?</button>
  `;

  document.head.appendChild(style);
  document.body.appendChild(root);

  const panel = root.querySelector(".amitalux-panel");
  const launcher = root.querySelector(".amitalux-launcher");
  const close = root.querySelector(".amitalux-close");
  const form = root.querySelector("form");
  const status = root.querySelector(".amitalux-status");

  launcher.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });

  close.addEventListener("click", () => {
    panel.hidden = true;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Sending...";

    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(`${apiBase}/api/cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-amitalux-workspace": config.workspace,
          "x-amitalux-role": "customer"
        },
        body: JSON.stringify({
          ...formData,
          title: "Website support request",
          channel: "Website chat"
        })
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      const createdCase = data.cases && data.cases[0];

      status.textContent = createdCase && createdCase.caseNo
        ? `Sent. Your case number is ${createdCase.caseNo}.`
        : "Sent. The team has your message.";

      form.reset();
    } catch (error) {
      status.textContent = "We could not send that yet. Please try again.";
    }
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    });
  }
})();
