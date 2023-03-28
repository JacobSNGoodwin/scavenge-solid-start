import {
  A,
  RouteDataArgs,
  useIsRouting,
  useParams,
  useRouteData,
} from 'solid-start';
import {
  createServerAction$,
  createServerData$,
  redirect,
} from 'solid-start/server';
import LeftChevronIcon from '~icons/mdi/chevron-left-circle';

import { deleteScavengerHunt, getScavengerHunt } from '~/db';
import { requireUserId } from '~/lib/session';
import { createEffect, createSignal, Show } from 'solid-js';
import Loading from '~icons/svg-spinners/3-dots-fade';
import ConfirmationModal from '~/components/ConfirmationModal';

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
  const [isConfirmationOpen, setIsConfirmationOpen] = createSignal(false);
  const params = useParams();

  const isRouting = useIsRouting();

  const [isDeleting, handleDelete] = createServerAction$(
    async (id: string, { request }) => {
      const userId = await requireUserId(request);

      deleteScavengerHunt(id, userId);

      return redirect('/scavenger-hunts');
    }
  );

  createEffect(() => {
    if (isDeleting.error) {
      setIsConfirmationOpen(false);
    }
  });

  const shouldShowLoader = () =>
    isRouting() || scavengerHunt.loading || isDeleting.pending;

  return (
    <>
      <main class="max-w-lg mx-auto p-4">
        <A href="/scavenger-hunts">
          <div class="flex items-center text-sky-700 hover:text-sky-500 transition-colors duration-200 font-bold text-lg">
            <LeftChevronIcon />
            <span class="ml-2">Back</span>
          </div>
        </A>
        <Show when={shouldShowLoader()} fallback={<div class="h-12" />}>
          <Loading class="h-12 mx-auto text-4xl text-orange-700" />
        </Show>
        <Show when={scavengerHunt()}>
          <h1 class="text-5xl my-4 text-center text-sky-700 font-thin uppercase">
            {scavengerHunt()?.scavenger_hunts.title}
          </h1>
        </Show>

        <button
          class="block mx-auto my-4 bg-red-700 hover:bg-red-600 transition-colors duration-300 text-white p-2 rounded-lg"
          onClick={() => setIsConfirmationOpen(true)}
        >
          Delete Poll
        </button>
        {isDeleting.error && (
          <p class="text-red-600 text-center">Error Deleting Scavenger Hunt</p>
        )}
      </main>

      <ConfirmationModal
        isOpen={isConfirmationOpen()}
        message="Proceeding will permanently delete the Scavenger Hunt"
        confirmText="Delete"
        onConfirm={() => handleDelete(params.id)}
        onCancel={() => setIsConfirmationOpen(false)}
      />
    </>
  );
}
