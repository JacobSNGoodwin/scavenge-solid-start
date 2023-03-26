import { For, Show } from 'solid-js';
import { A, RouteDataArgs, useIsRouting, useRouteData } from 'solid-start';
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server';
import RightChevronIcon from '~icons/mdi/chevron-right-circle';
import { addScavengerHunt, getUserById, getUserScavengerHunts } from '~/db';
import Loading from '~icons/svg-spinners/3-dots-fade';
import { requireUserId, logout } from '~/lib/session';
import ScavengerHuntInput from '~/components/ScavngerHuntInput';

export function routeData({}: RouteDataArgs) {
  return createServerData$(
    async (_, { request }) => {
      const userId = await requireUserId(request);

      const scavengerHunts = getUserScavengerHunts(userId);

      return {
        user: getUserById(userId),
        scavengerHunts,
      };
    },
    {
      key: 'scavenger-hunts',
    }
  );
}

export default function ScavengerHunts() {
  const data = useRouteData<typeof routeData>();
  const isRouting = useIsRouting();
  const [isLoggingOut, handleLogout] = createServerAction$((_, { request }) => {
    return logout(request);
  });

  const [isAddingHunt, addHunt] = createServerAction$(
    async (title: string, { request }) => {
      const userId = await requireUserId(request);

      const { id: newId } = addScavengerHunt(title, userId);

      return redirect(`${newId}`);
    },
    { invalidate: ['scavenger-hunts'] }
  );

  const shouldShowLoader = () => {
    return (
      isRouting() ||
      isLoggingOut.pending ||
      isAddingHunt.pending ||
      data.loading
    );
  };

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

      <Show when={shouldShowLoader()} fallback={<div class="h-12" />}>
        <Loading class="h-12 mx-auto text-4xl text-orange-700" />
      </Show>

      <h1 class="text-center max-6-xs text-6xl text-sky-700 font-thin uppercase mt-4 mb-8">
        My Hunts
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

      <ScavengerHuntInput
        disabled={isAddingHunt.pending}
        onSubmit={(title) => {
          addHunt(title);
        }}
      />
    </main>
  );
}
