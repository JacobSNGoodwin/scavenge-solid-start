import { useSearchParams } from 'solid-start';

export default function OauthRedirect() {
  const [searchParams] = useSearchParams();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Redirect search params
      </h1>
      <pre>{JSON.stringify(searchParams)}</pre>
    </main>
  );
}
