export const getCurrentUser = (c: any) => {
  const u = c.get("user");
  if (!u) throw new Error("No user in context. roleGuard missing?");
  return u;
};
