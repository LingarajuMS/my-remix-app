
import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { loginUser } from "~/models/user.server";
import { createUserSession } from "~/session.server";

export async function action({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  const user = await loginUser({ username, password });

  if (!user) {
    return json({ error: "Invalid username or password" }, { status: 400 });
  }

  return createUserSession(user.id, "/weather");
}

export default function LoginPage() {
  const actionData = useActionData();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form method="post">
        <div>
          <label>Username:</label>
          <input type="text" name="username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" />
        </div>
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
