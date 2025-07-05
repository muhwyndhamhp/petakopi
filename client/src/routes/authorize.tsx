import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '@auth/auth.ts';
import { useEffect } from 'react';

export const Route = createFileRoute('/authorize')({
  component: RouteComponent,
});

function RouteComponent() {
  const cl = authClient(import.meta.env.VITE_ISSUER_URL);

  useEffect(() => {
    const redirect = async () => {
      const { challenge, url } = await cl.authorize(
        `${import.meta.env.VITE_CLIENT_URL}/callback`,
        'code',
        { pkce: true }
      );
      sessionStorage.setItem('challenge-key', JSON.stringify(challenge));
      window.location.href = url;
    };

    redirect();
  }, []);
  return (
    <div className="flex h-full w-full">
      <p className="m-auto">Redirecting you to identity provider...</p>
    </div>
  );
}
