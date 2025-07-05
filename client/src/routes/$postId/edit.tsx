import { createFileRoute, redirect } from '@tanstack/react-router';
import { Editor } from '../-coffeeEditor/-editor.tsx';
import { client } from '@fetcher/fetcher.ts';
import { getTokens } from '@cookies/tokens.ts';

export const Route = createFileRoute('/$postId/edit')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { access, refresh } = getTokens();
    if (!access && !refresh) throw redirect({ to: '/authorize' });
  },
});

function RouteComponent() {
  const { postId } = Route.useParams();

  return (
    <Editor
      id={postId}
      submitQuery={(input) =>
        client.api.coffees[':id'].update.$post({
          json: input,
          param: {
            id: postId,
          },
        })
      }
    />
  );
}
