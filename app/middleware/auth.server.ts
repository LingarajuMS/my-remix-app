import { redirect } from "@remix-run/node";

export function requireAuth(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = new URLSearchParams(cookieHeader);
  const username = cookies.get('username');

  if (!username) {
    return redirect('/login');
  }
}