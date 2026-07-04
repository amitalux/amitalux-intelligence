import { addHistory, readState, upsertCustomer, writeState } from "./_shared/amitalux-store.js";

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const state = await readState(req);
  const body = await req.json().catch(() => ({}));
  const { customer, created } = upsertCustomer(state, body);

  if (!customer?.email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  addHistory(state, customer.name, created ? "Customer record created from signup." : "Customer record updated from signup.", "green");

  return Response.json(await writeState(state, req));
};

export const config = {
  path: "/api/customers",
};
