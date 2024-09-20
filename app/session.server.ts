import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";

const sessionSecret = process.env.SESSION_SECRET || "default_secret";

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
});

export async function createUserSession(userId, redirectTo) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserFromSession(request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId } });
}
