import { LoaderFunction, redirect } from '@remix-run/node';
import { getUserSession } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId) {
    return redirect('/login');
  }

  return null;
};

export default function Dashboard() {
  return (
    <div>
      <h1>Welcome to your dashboard</h1>
      {/* Add any additional dashboard logic or features */}
    </div>
  );
}
