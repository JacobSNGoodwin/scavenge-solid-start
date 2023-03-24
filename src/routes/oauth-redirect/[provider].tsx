import { Show } from 'solid-js';
import { useRouteData, RouteDataArgs } from 'solid-start';
import { createServerData$, redirect } from 'solid-start/server';
import { createNewUser, getUserByEmail } from '~/db';
import { buildAuthConfigs } from '~/lib/authConfigs';

export function routeData({ location, params }: RouteDataArgs) {
  return createServerData$(
    async ({ searchParams, provider }) => {
      const authorizationConfigs = buildAuthConfigs(
        searchParams?.get('code') ?? ''
      );
      const config = authorizationConfigs[provider];

      const fetchConfig = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config.authBody),
      };

      try {
        const authResponse = await fetch(config.authUrl, fetchConfig);
        if (!authResponse.ok) {
          // It appears Github (maybe some other Oauth providers)
          // will response with status of 200 for unauthorized requests.
          throw new Error(`Unable to authorize with provider: [${provider}]`);
        }
        const authData = await authResponse.json();
        if (!authData.access_token) {
          // I think access_token is standard for Oauth2a
          throw new Error(`Unable to authorize with provider: [${provider}]`);
        }
        console.debug('received authData', authData);

        // get user update user profile
        const externalUserResponse = await fetch(config.userUrl, {
          headers: config.buildUserHeaders(authData.access_token),
        });
        if (!externalUserResponse.ok) {
          throw new Error(`Unable to authorize with provider: [${provider}]`);
        }

        const externalUserData = await externalUserResponse.json();
        console.debug('retrieved externalUserData', externalUserData);

        // getUser -> if not user create user
        // create session
        const email = externalUserData[config.fields.email];

        const user = getUserByEmail(email);

        if (!user) {
          console.info('creating new user', user);
        }

        const userId =
          user?.id ??
          createNewUser({
            avatar_url: externalUserData[config.fields.avatar_url],
            email: externalUserData[config.fields.email],
            name: externalUserData[config.fields.name],
            external_connections: {
              [provider]: externalUserData[config.fields.id],
            },
          });

        // redirect to /scavenger-hunts
        console.debug('Creating session for user id: ', userId);

        return { externalUserData };
      } catch (e) {
        console.debug('the error', e);
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
