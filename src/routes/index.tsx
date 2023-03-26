import { createServerData$, redirect } from 'solid-start/server';
import { nanoid } from 'nanoid';
import GitHubIcon from '~icons/octicon/mark-github-16';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { Show } from 'solid-js';
import { getUser } from '~/lib/session';

export function routeData({ location }: RouteDataArgs) {
  return createServerData$(
    async ({ authError }, { request }) => {
      const user = await getUser(request);

      if (user) {
        // seems weird to throw, but does help with return types
        throw redirect('/scavenger-hunts');
      }

      return {
        authUrls: {
          github: `https://github.com/login/oauth/authorize?client_id=${
            process.env.OAUTH_GH_CLIENT
          }&scope=user&state=${nanoid(12)}`,
        },
        authError: authError && `Failed to authorize via ${authError}`,
      };
    },
    {
      key: () => ({ authError: location.query['auth_error'] }),
    }
  );
}

export default function Home() {
  const authConfigData = useRouteData<typeof routeData>();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl font-thin uppercase my-16">Scavenge</h1>
      <Show when={!authConfigData.loading}>
        <a
          href={authConfigData()?.authUrls.github}
          class="mx-auto w-64 flex justify-center items-center p-4 rounded-lg"
          style="background-color:#6e5494"
        >
          <GitHubIcon class="text-xl" style="color:#ffffff" />
          <span class="ml-2 text-xl text-white">Login with GitHub</span>
        </a>
      </Show>
      <Show when={authConfigData()?.authError}>
        <p class="my-2 text-red-600">{authConfigData()?.authError}</p>
      </Show>
    </main>
  );
}
