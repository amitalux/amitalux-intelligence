Amitalux Intelligence Working Demo

How to open on a Mac:

1. Unzip the folder.
2. Open the amitalux-software folder.
3. Double-click product-brief.html to read the write-up.
4. Double-click index.html to open the software prototype.

Backend now included:

1. /api/state loads persisted Amitalux Intelligence workspace data.
2. /api/cases creates a new case.
3. /api/cases/:id/action updates a case through analyze, approve, send, and close.
4. /api/ai-draft creates a response draft.
5. Netlify Blobs stores customers, agents, cases, history, and live metrics.

Product surfaces:

1. Customer Portal: customer-facing email and chat submission.
2. Agent Portal: queue, conversation context, AI analysis, approval, sending, closing.
3. Admin Portal: queue health, CSAT, handled volume, agents, stale data, audit history.

Netlify setup:

1. Open Terminal in the amitalux-software folder.
2. Run npm install. If npm reports a cache permission issue, run npm install --cache ./.npm-cache.
3. Run npm run dev to start Netlify Dev.
4. Open the local URL Netlify gives you.
5. In Live Workbench, click Run AI analysis. That calls /api/ai-draft.

Deployment:

1. Run npx netlify login.
2. Run npx netlify init --manual to create or connect a Netlify site.
3. Run npm run deploy:draft for a preview deploy.
4. Run npm run deploy:prod when ready for a production URL.

This is now a functioning browser app with a Netlify backend and persisted state. It does not connect to real customers, real AI, Square, Salesforce, phone, chat, or email yet.
