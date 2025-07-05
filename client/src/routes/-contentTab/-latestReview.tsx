import useSWR from 'swr';
import { client, rpcFetch } from '@fetcher/fetcher.ts';
import { CoffeeListItem } from './-common/-cofeeListItem.tsx';

export function LatestReviews() {
  const { data, isLoading } = useSWR(
    'latestReviews',
    rpcFetch(client.api.coffees.latestReviews.$get)({}),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  );

  return (
    !isLoading ? <div className="flex w-full flex-col tab-content">
      <ul className="list">
        {data?.map((c) => {
          return <CoffeeListItem key={`coffee-item-${c.id}`} coffee={c} />;
        }) ?? null}
      </ul>
    </div> : <div></div>
  );
}