import { readState, requireRole, setAgentAvailability, writeState } from "./_shared/amitalux-store.js";

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const forbidden = requireRole(req, ["owner", "admin", "agent"]);
  if (forbidden) return forbidden;

  const state = await readState(req);
  const body = await req.json().catch(() => ({}));

  if (!body.agentId && !body.agentName) {
    return Response.json({ error: "Missing agentId" }, { status: 400 });
  }

  await setAgentAvailability(state, req, body);
  return Response.json(await writeState(state, req));
};

export const config = {
  path: "/api/toggle-ooo",
};
