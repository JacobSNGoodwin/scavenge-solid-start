import { For, Show } from 'solid-js';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';
import { getUserById, getUserScavengerHunts } from '~/db';
import { requireUserId, logout } from '~/lib/session';

export function routeData({}: RouteDataArgs) {
  return createServerData$(async (_, { request }) => {
    const userId = await requireUserId(request);

    const scavengerHunts = getUserScavengerHunts(userId);

    return {
      user: getUserById(userId),
      scavengerHunts,
    };
  });
}

export default function ScavengerHunts() {
  const data = useRouteData<typeof routeData>();
  const [isLoggingOut, handleLogout] = createServerAction$((_, { request }) => {
    return logout(request);
  });

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <button
        class="mx-auto bg-sky-800 w-32 flex justify-center items-center p-2 rounded-lg my-4 text-white"
        disabled={isLoggingOut.pending}
        onClick={() => handleLogout()}
      >
        {isLoggingOut.pending ? 'Logging out' : 'Logout'}
      </button>

      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-4">
        Scavenger Hunts
      </h1>

      <Show when={data()}>
        <h2>Welcome, {data()?.user?.name ?? 'Super Duper User'}</h2>

        <For each={data()?.scavengerHunts}>{(sh) => <h3>{sh.title}</h3>}</For>
      </Show>
    </main>
  );
}
