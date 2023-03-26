import { For, Show } from 'solid-js';
import { A, RouteDataArgs, useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';
import RightChevronIcon from '~icons/mdi/chevron-right-circle';
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
    <main class="mx-auto text-gray-700 p-4">
      <button
        class="mx-auto bg-sky-800 hover:bg-sky-700 w-32 flex justify-center items-center p-2 rounded-lg my-4 text-white"
        disabled={isLoggingOut.pending}
        onClick={() => handleLogout()}
      >
        {isLoggingOut.pending ? 'Logging out' : 'Logout'}
      </button>

      <Show when={data()?.user.name} fallback={<h2>Welcome!</h2>}>
        <h2 class="text-center">Welcome, {data()?.user?.name}</h2>
      </Show>

      <h1 class="text-center max-6-xs text-6xl text-sky-700 font-thin uppercase my-8">
        Scavenger Hunts
      </h1>

      <Show when={data()}>
        <div class="mx-auto max-w-md">
          <For each={data()?.scavengerHunts}>
            {(sh) => (
              <A class="block" href={sh.id}>
                <div class="flex justify-between text-sky-700 hover:text-sky-500 transition-colors duration-200 font-bold text-lg">
                  <span>{sh.title}</span>
                  <RightChevronIcon />
                </div>
              </A>
            )}
          </For>
        </div>
      </Show>
    </main>
  );
}
