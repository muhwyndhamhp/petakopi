import { CoffeeListItem } from './-common/-cofeeListItem.tsx';
import type { Coffee } from '@rpcTypes/coffee.ts';

export interface SearchResultProps {
  coffees: Coffee[];
}

export function SearchResult({ coffees }: SearchResultProps) {
  return (
    <div className="flex w-full flex-col tab-content">
      <ul className="list">
        {coffees?.map((c) => {
          return <CoffeeListItem key={`coffee-item-${c.id}`} coffee={c} />;
        }) ?? null}
      </ul>
    </div>
  );
}