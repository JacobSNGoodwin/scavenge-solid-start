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

import {
  addHuntItem,
  deleteHuntItem,
  deleteScavengerHunt,
  getUserScavengerHunt,
  updateHuntTitle,
} from '~/db';
import { requireUserId } from '~/lib/session';
import { createEffect, createSignal, For, Show } from 'solid-js';
import Loading from '~icons/svg-spinners/3-dots-fade';
import ExternalLink from '~icons/ci/external-link';
import Clear from '~icons/mdi/clear-circle';
import ConfirmationModal from '~/components/ConfirmationModal';
import ScavengerHuntItemInput from '~/components/ScavngerHuntItemInput';
import EditableTitle from '~/components/EditableTitle';
import { HuntItem } from '~/db/schema';

export function routeData({ params }: RouteDataArgs) {
  return createServerData$(
    async ({ scavengerHuntId }, { request }) => {
      const userId = await requireUserId(request);

      const data = await getUserScavengerHunt(scavengerHuntId, userId);

      const scavengerHunt = data[0].scavenger_hunts;
      const huntItems = data.reduce((prevHuntItems, { hunt_items: item }) => {
        if (item !== null) {
          return [...prevHuntItems, item];
        }
        return prevHuntItems;
      }, [] as HuntItem[]);

      console.debug('Scavenger hunt with items', scavengerHunt, huntItems);

      return { scavengerHunt, huntItems };
    },
    {
      key: { scavengerHuntId: params.id },
    }
  );
}

type AddItemBody = {
  id: string;
  title: string;
  weight: number;
};

type UpdateTitleBody = {
  id: string;
  title: string;
};

export default function ScavengerHunts() {
  const data = useRouteData<typeof routeData>();
  const [isConfirmationOpen, setIsConfirmationOpen] = createSignal(false);
  const params = useParams();

  const isRouting = useIsRouting();

  const [isDeleting, handleDelete] = createServerAction$(
    async (id: string, { request }) => {
      const userId = await requireUserId(request);

      await deleteScavengerHunt(id, userId);

      return redirect('/scavenger-hunts');
    }
  );

  const [isAddingItem, addItem] = createServerAction$(
    async ({ id, title, weight }: AddItemBody) => {
      await addHuntItem({ title, weight, scavenger_hunt_id: id });
    },
    {
      invalidate: [{ scavengerHuntId: params.id }],
    }
  );

  const [isDeletingItem, deleteItem] = createServerAction$(
    async (id: string) => {
      await deleteHuntItem(id);
    },
    {
      invalidate: [{ scavengerHuntId: params.id }],
    }
  );

  const [isUpdatingTitle, updateTitle] = createServerAction$(
    async ({ id, title }: UpdateTitleBody, { request }) => {
      const userId = await requireUserId(request);
      // I think we have to await to prevent invalidate from running too soon
      await updateHuntTitle({
        id,
        title,
        userId,
      });
    },
    {
      invalidate: [{ scavengerHuntId: params.id }],
    }
  );

  createEffect(() => {
    if (isDeleting.error) {
      setIsConfirmationOpen(false);
    }
  });

  const shouldShowLoader = () =>
    isRouting() ||
    data.loading ||
    isDeleting.pending ||
    isAddingItem.pending ||
    isDeletingItem.pending ||
    isUpdatingTitle.pending;

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
        <Show when={data()?.scavengerHunt}>
          <EditableTitle
            title={
              isUpdatingTitle.input?.title ??
              data()?.scavengerHunt.title ??
              'Your Scavenger Hunt'
            }
            onSave={(title) => updateTitle({ id: params.id, title })}
          />
        </Show>

        <button
          class="block mx-auto my-4 bg-red-700 hover:bg-red-600 transition-colors duration-300 text-white p-2 rounded-lg"
          onClick={() => setIsConfirmationOpen(true)}
        >
          Delete Scavenger Hunt
        </button>
        {isDeleting.error && (
          <p class="text-red-600 text-center">Error Deleting Scavenger Hunt</p>
        )}

        <For each={data()?.huntItems}>
          {(item) => (
            <Show when={item}>
              <div class="flex justify-between items-center text-lg">
                <span>{item!.title}</span>
                <div class="flex items-center">
                  <span class="mx-4">{item!.weight}</span>
                  <button onClick={() => deleteItem(item!.id)}>
                    <Clear class="text-red-700 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </Show>
          )}
        </For>

        <ScavengerHuntItemInput
          disabled={false}
          onSubmit={(title, weight) =>
            addItem({ id: params.id, title, weight })
          }
        />
        {isAddingItem.error && (
          <p class="text-red-600 text-center">Error Adding Item</p>
        )}

        <A
          target="_blank"
          rel="noopener noreferrer"
          href="shareable"
          class="mx-auto flex justify-center items-center text-sky-700 hover:text-sky-600 text-xl"
        >
          <span class="mr-2">View Shareable Hunt</span>
          <ExternalLink />
        </A>
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
