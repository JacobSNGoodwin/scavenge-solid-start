type AuthConfig = {
  authUrl: string;
  authBody: Record<string, unknown>;
  userUrl: string;
  buildUserHeaders: (token: string) => HeadersInit; // from fetch type
  fields: {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
  };
};

type AuthConfigs = Record<string, AuthConfig>;

export const buildAuthConfigs = (code: string): AuthConfigs => ({
  github: {
    authUrl: `https://github.com/login/oauth/access_token`,
    authBody: {
      client_id: process.env.OAUTH_GH_CLIENT,
      client_secret: process.env.OAUTH_GH_SECRET,
      code,
    },
    userUrl: ' https://api.github.com/user',
    buildUserHeaders: (token) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    fields: {
      id: 'id',
      name: 'name',
      email: 'email',
      avatar_url: 'avatar_url',
    },
  },
});
