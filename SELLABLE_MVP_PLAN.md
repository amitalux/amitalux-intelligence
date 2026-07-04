# Amitalux Intelligence Sellable MVP Plan

Amitalux Intelligence is no longer just a concept demo. To become software a business can pay for, it needs to move from a shared demo workspace into a secure, multi-business product with real customer channels, real AI, account controls, and a clear first market.

## Current State

Already built:

- Customer Portal for customer-facing chat and email-style submission.
- Agent Portal for queue handling, AI analysis, replies, and case closure.
- Admin Portal for operations, reports, data health, agents, and history.
- Netlify backend functions.
- Persistent state through Netlify Blobs.
- Case actions for analyze, approve, send, close, and create.
- Customer profiles, agent profiles, history, CSAT, queue health, and stale data alerts.

This is a strong working MVP foundation, but it is not yet sellable as production SaaS.

## Sellable MVP Requirements

### 1. Authentication And Accounts

Needed before selling:

- Business account signup.
- Admin login.
- Agent login.
- Customer-facing public support link or widget.
- Role permissions for owner, admin, agent, and read-only viewer.
- Password reset and session management.

Why it matters:

Businesses cannot use Amitalux Intelligence if every customer, agent, and admin shares the same demo workspace.

### 2. Multi-Business Data Separation

Needed before selling:

- Each business must have its own workspace.
- Customers, cases, agents, settings, and reports must be scoped to that business.
- No business should be able to see another business's data.

Why it matters:

This is the difference between a demo and real SaaS.

### 3. Real Customer Channels

Needed before selling:

- Public chat widget that can be embedded on a website.
- Email intake address or connected Gmail/Outlook inbox.
- Customer conversation history.
- Agent reply sending.
- Basic notifications when new cases arrive.

Why it matters:

The customer-facing side has to receive and send real messages, not only simulate them.

### 4. Real AI Integration

Needed before selling:

- AI model connected through a backend API.
- Business tone settings.
- Human approval controls.
- Safe fallback when AI is uncertain.
- Prompt logs and response audit trail.
- No sensitive customer data sent to the model unless allowed by settings.

Why it matters:

Amitalux Intelligence's core value is the AI service agent. It needs to be reliable, personal, and governable.

### 5. Business Settings

Needed before selling:

- Business name and brand voice.
- Support hours.
- Escalation rules.
- Approved refund or credit policies.
- Data retention settings.
- Privacy and AI memory settings.

Why it matters:

Small businesses need Amitalux Intelligence to respond according to their rules, not generic support rules.

### 6. Production Database

Current backend uses Netlify Blobs, which is useful for MVP state but not ideal as the long-term system of record.

Recommended sellable MVP path:

- Keep Netlify for frontend and functions.
- Add a managed Postgres database for real structured data.
- Tables for businesses, users, customers, cases, messages, agents, reports, integrations, and audit logs.

Why it matters:

Search, reporting, permissions, and integrations will become painful if everything remains object storage.

### 7. Privacy And Security

Needed before selling:

- Data encryption at rest and in transit.
- Role-based access control.
- Audit logs for sensitive actions.
- Customer data deletion.
- AI memory opt-out.
- Privacy policy and terms.
- Security posture page for buyers.

Why it matters:

Customer service software handles private customer conversations.

### 8. Integrations

First integrations to prioritize:

- Square for customers, payments, bookings, orders, and loyalty context.
- Gmail or Outlook for email intake.
- Website chat widget.

Second wave:

- Salesforce.
- HubSpot.
- Zoho.
- Slack notifications.

Why it matters:

Amitalux Intelligence is most valuable when it knows the customer's actual relationship with the business.

### 9. Billing

Needed before selling:

- Stripe checkout.
- Plans and pricing.
- Trial period.
- Subscription status.
- Usage limits by plan.

Suggested early pricing:

- Starter: $49 to $99 per month for small teams.
- Growth: $149 to $299 per month with AI memory, reports, and integrations.
- Premium: custom pricing for advanced privacy, Salesforce, and multi-location support.

### 10. Buyer-Ready Positioning

Best first buyer:

Small service businesses that rely on repeat customers and personal care.

Examples:

- Wellness studios.
- Salons and spas.
- Boutique fitness.
- Med spas.
- Local service providers.
- Specialty retail with appointments or memberships.

Initial promise:

Amitalux Intelligence helps small teams respond faster, sound more human, remember every customer, and prevent service mistakes before they hurt the relationship.

## First Sellable Version

The first version we should sell should include:

- Business login.
- Agent login.
- Admin dashboard.
- Public customer chat link.
- Email-style customer intake.
- AI reply drafting.
- Human approval before sending.
- Customer profile.
- Agent profile.
- Case history.
- Admin reports.
- Stale data alerts.
- Customer Portal, Agent Portal, and Admin Portal as first-class product surfaces.
- Workspace-scoped backend state using an `x-amitalux-workspace` boundary.
- Basic role headers for owner, admin, agent, and viewer.
- Production Postgres schema draft in `database/schema.sql`.
- SaaS environment template in `.env.example`.
- Basic Square context, even if it begins as manual import before full OAuth.

## What Not To Build Yet

Do not build everything at once.

Delay:

- Full Salesforce integration.
- Complex phone support.
- Enterprise compliance packages.
- Advanced workflow builder.
- Multi-language support.
- Custom AI model training.

## Next Build Step

The next technical step is to add:

1. Authentication.
2. Workspace separation.
3. A production database.
4. Real customer message storage.
5. Real AI provider connection through the backend.

Once those are in place, Amitalux Intelligence becomes a sellable beta instead of a product demo.

## Progress Since This Plan Was Created

Completed:

- Product surfaces added: Customer Portal, Agent Portal, Admin Portal.
- Backend workspace scoping added.
- Basic role enforcement added to backend mutation routes.
- Postgres schema drafted.
- SaaS environment variables drafted.

Still required for sellable beta:

- Connect Clerk so workspace and role headers are created securely, not trusted from the browser.
- Move persistent state from Netlify Blobs to Postgres.
- Connect real AI provider.
- Add real email sending and inbound email intake.
- Add embeddable website chat widget.
- Add Stripe subscription checkout and plan enforcement.
