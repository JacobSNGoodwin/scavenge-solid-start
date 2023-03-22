import { createServerData$ } from 'solid-start/server';
import { nanoid } from 'nanoid';
import GitHubIcon from '~icons/octicon/mark-github-16';
import { RouteDataArgs, useRouteData } from 'solid-start';
import { Show } from 'solid-js';

export function routeData({ location }: RouteDataArgs) {
  return createServerData$(
    ({ searchParams }) => {
      const authError = searchParams.get('auth_error');
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
      key: () => {
        const searchParams = new URLSearchParams(location.search);
        return { searchParams };
      },
    }
  );
}

export default function Home() {
  const config = useRouteData<typeof routeData>();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl font-thin uppercase my-16">Scavenge</h1>
      <Show when={!config.loading}>
        <a
          href={config()?.authUrls.github}
          class="mx-auto w-64 flex justify-center items-center p-4 rounded-lg"
          style="background-color:#6e5494"
        >
          <GitHubIcon class="text-xl" style="color:#ffffff" />
          <span class="ml-2 text-xl text-white">Login with GitHub</span>
        </a>
      </Show>
      <Show when={config()?.authError}>
        <p class="my-2 text-red-600">{config()?.authError}</p>
      </Show>
    </main>
  );
}
