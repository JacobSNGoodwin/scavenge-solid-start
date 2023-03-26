import { A, RouteDataArgs, useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';

import {} from '~/db';
import { requireUserId, logout } from '~/lib/session';

export function routeData({}: RouteDataArgs) {
  return createServerData$(async (_, { request }) => {
    const userId = await requireUserId(request);

    return {};
  });
}

export default function ScavengerHunts() {
  const data = useRouteData<typeof routeData>();

  return (
    <main class="mx-auto p-4">
      <h1 class="text-5xl my-4 text-center text-sky-700 font-thin uppercase">
        Your fancy schmancy scavenger-hunt!
      </h1>
    </main>
  );
}
