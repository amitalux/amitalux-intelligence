import { readState, requireRole, updateAutomationTask, writeState } from "./_shared/amitalux-store.js";

export default async (req, context) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const forbidden = requireRole(req, ["owner", "admin", "agent"]);
  if (forbidden) return forbidden;

  const state = await readState(req);
  const body = await req.json().catch(() => ({}));
  const task = updateAutomationTask(state, context.params.id, body.action);

  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  return Response.json(await writeState(state, req));
};

export const config = {
  path: "/api/tasks/:id/action",
};
