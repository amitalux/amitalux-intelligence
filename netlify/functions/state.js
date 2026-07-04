import { initialState, readState, requireRole, writeState } from "./_shared/amitalux-store.js";

export default async (req) => {
  if (req.method === "GET") {
    return Response.json(await readState(req));
  }

  if (req.method === "POST") {
    const forbidden = requireRole(req, ["owner", "admin"]);
    if (forbidden) return forbidden;
    const body = await req.json().catch(() => ({}));
    if (body.action === "reset") {
      return Response.json(await writeState(initialState(), req));
    }
    return Response.json({ error: "Unsupported action" }, { status: 400 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = {
  path: "/api/state",
};
