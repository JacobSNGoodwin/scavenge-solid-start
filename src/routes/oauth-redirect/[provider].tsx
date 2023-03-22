import { Show } from 'solid-js';
import {
  useSearchParams,
  RouteDataFunc,
  useRouteData,
  RouteDataArgs,
} from 'solid-start';
import { createServerData$, redirect } from 'solid-start/server';

type AuthConfig = {
  url: string;
  body: Record<string, unknown>;
};
type AuthConfigs = Record<string, AuthConfig>;

export function routeData({ location, params }: RouteDataArgs) {
  return createServerData$(
    async ({ searchParams, provider }) => {
      const authorizationConfigs: AuthConfigs = {
        github: {
          url: `https://github.com/login/oauth/access_token`,
          body: {
            client_id: process.env.OAUTH_GH_CLIENT,
            client_secret: process.env.OAUTH_GH_SECRET,
            code: searchParams.get('code'),
          },
        },
      };

      const config = authorizationConfigs[provider];

      const fetchConfig = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.body),
      };

      try {
        const result = await fetch(config.url, fetchConfig);

        console.log('OAUTH result', await result.json());

        return { success: true };
      } catch (_e) {
        return redirect(`/?auth_error=${provider}`);
      }
    },
    {
      key: () => {
        const searchParams = new URLSearchParams(location.search);
        return { searchParams, provider: params.provider };
      },
    }
  );
}

export default function OauthRedirect() {
  const data = useRouteData<typeof routeData>();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Show when={data.loading}>
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
          Logging in ...
        </h1>
      </Show>
      <Show when={data()}>
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
          Getting your list!
        </h1>
      </Show>
    </main>
  );
}
