import { createServerData$ } from 'solid-start/server';
import { nanoid } from 'nanoid';
import GitHubIcon from '~icons/octicon/mark-github-16';
import { useRouteData } from 'solid-start';
import { Show } from 'solid-js';

export function routeData() {
  return createServerData$(() => {
    return {
      authUrls: {
        github: `https://github.com/login/oauth/authorize?client_id=${
          process.env.OAUTH_GH_CLIENT
        }&scope=user&state=${nanoid(12)}`,
      },
    };
  });
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
    </main>
  );
}
