import { A, RouteDataArgs, useIsRouting, useRouteData } from 'solid-start';
import { createServerAction$, createServerData$ } from 'solid-start/server';
import LeftChevronIcon from '~icons/mdi/chevron-left-circle';

import { getScavengerHunt } from '~/db';
import { requireUserId } from '~/lib/session';
import { Show } from 'solid-js';
import Loading from '~icons/svg-spinners/3-dots-fade';

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ({ scavengerHunt }, { request }) => {
      const userId = await requireUserId(request);

      console.debug('Getting scavenger hunt with items', userId, scavengerHunt);
      const data = getScavengerHunt(scavengerHunt, userId);

      console.debug('Scavenger hunt with items', data);

      return data;
    },
    {
      key: { scavengerHunt: params.id },
    }
  );
}

export default function ScavengerHunts() {
  const scavengerHunt = useRouteData<typeof routeData>();
  const isRouting = useIsRouting();

  return (
    <main class="max-w-lg mx-auto p-4">
      <A href="/scavenger-hunts">
        <div class="flex items-center text-sky-700 hover:text-sky-500 transition-colors duration-200 font-bold text-lg">
          <LeftChevronIcon />
          <span class="ml-2">Back</span>
        </div>
      </A>
      <Show
        when={isRouting() || scavengerHunt.loading}
        fallback={<div class="h-12" />}
      >
        <Loading class="h-12 mx-auto text-4xl text-orange-700" />
      </Show>
      <Show when={scavengerHunt()}>
        <h1 class="text-5xl my-4 text-center text-sky-700 font-thin uppercase">
          {scavengerHunt()?.scavenger_hunts.title}
        </h1>
      </Show>
    </main>
  );
}
