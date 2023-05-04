import { For } from 'solid-js';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { getScavengerHunt } from '~/db';
import { HuntItem } from '~/db/schema';
import Checkbox from '~icons/ci/checkbox-unchecked';

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ({ scavengerHuntId }, { request }) => {
      const data = await getScavengerHunt(scavengerHuntId);

      const scavengerHunt = data[0].scavenger_hunts;

      const huntItems = data.reduce((prevHuntItems, { hunt_items: item }) => {
        if (item !== null) {
          return [...prevHuntItems, item];
        }
        return prevHuntItems;
      }, [] as HuntItem[]);

      // pointValues
      const weightedItems = new Map<number, HuntItem[]>();

      huntItems.forEach((item) => {
        const key = item.weight;
        const existing = weightedItems.get(key);

        if (existing) {
          weightedItems.set(key, [...existing, item]);
        } else {
          weightedItems.set(key, [item]);
        }
      });

      const orderedHuntItems = [...weightedItems.entries()].sort();

      return { scavengerHunt, orderedHuntItems };
    },
    {
      key: { scavengerHuntId: params.id },
    }
  );
}

function Shareable() {
  const data = useRouteData<typeof routeData>();
  return (
    <main class="max-w-lg mx-auto p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-4">
        {data()?.scavengerHunt.title}
      </h1>

      <For each={data()?.orderedHuntItems}>
        {([weight, items]) => (
          <div class="my-8">
            <h3 class="text-3xl text-gray-700 text-center underline underline-offset-2">
              {weight} Points
            </h3>
            <For each={items}>
              {(item) => (
                <div class="text-lg my-2 flex justify-between items-center">
                  <span>{item.title}</span>
                  <Checkbox />
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </main>
  );
}

export default Shareable;
