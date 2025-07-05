import { createFileRoute, redirect } from '@tanstack/react-router';
import { getTokens } from '@cookies/tokens.ts';
import { Editor } from '../-coffeeEditor/-editor.tsx';
import { client } from '@fetcher/fetcher.ts';

export const Route = createFileRoute('/add/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { access, refresh } = getTokens();
    if (!access && !refresh) throw redirect({ to: '/authorize' });
  },
});

function RouteComponent() {
  return <Editor submitQuery={(input) => client.api.coffees.$post({ json: input })} />;
}