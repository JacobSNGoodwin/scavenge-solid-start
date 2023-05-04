import { createCookieSessionStorage, redirect } from 'solid-start';
import { getUserById } from '~/db';
import { User } from '~/db/schema';

const storage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [
      process.env.SESSION_SECRET_1!,
      process.env.SESSION_SECRET_2!,
      process.env.SESSION_SECRET_3!,
    ],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 5,
    httpOnly: true,
  },
});

export async function getUser(request: Request): Promise<User | null> {
  const cookie = request.headers.get('Cookie') ?? '';
  const session = await storage.getSession(cookie);
  const userId = session.get('userId');

  // userId can be an empty object for expired sessions.
  // This seems like a weird way to do things, but hey, whatever.
  if (!userId || Object.keys(userId).length) return null;

  return getUserById(userId);
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);

  const cookie = await storage.commitSession(session);

  // console.debug('setting cookie', cookie, userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}

export async function requireUserId(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));

  const userId = session.get('userId');
  console.log('retrieved session', session.data, userId);
  if (!userId || typeof userId !== 'string') {
    throw redirect(`/`);
  }

  return userId;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}
