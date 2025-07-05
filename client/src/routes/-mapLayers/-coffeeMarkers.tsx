import { useAppStore } from '@store/store.ts';
import type { Coffee } from '@rpcTypes/coffee.ts';
import { RMarker, useMap } from 'maplibre-react-components';
import { useCallback, useEffect } from 'react';
import { CoffeeMarker } from './-coffeeMarker.tsx';
import type { PointLike } from 'maplibre-gl';

interface MarkerProps {
  data: Coffee[] | undefined;
  hovered: string | undefined;
  setHovered: (id: string | undefined) => void;
}

export function CoffeeMarkers({ data, hovered, setHovered }: MarkerProps) {
  const selectedCoffee = useAppStore((state) => state.selectedCoffee);
  const setSelected = useAppStore((state) => state.setSelectedCoffee);
  const collapse = useAppStore((state) => state.collapsed);

  const handleMarkerClick = useCallback(
    (c: Coffee) => {
      setSelected(c);
    },
    [setSelected]
  );

  const map = useMap('map-layer');

  useEffect(() => {
    if (!selectedCoffee) {
      return;
    }

    const offset: PointLike = collapse ? [0, -200] : [0, 0];

    map?.flyTo({
      offset: offset,
      center: [selectedCoffee.lng, selectedCoffee.lat],
      zoom: 15,
    });
  }, [selectedCoffee, map, collapse]);

  return (
    <>
      {data?.map((c: Coffee) => {
        return (
          <RMarker
            key={`marker-coffee-${c.id}`}
            longitude={c.lng}
            latitude={c.lat}
            initialAnchor="bottom"
            onClick={() => handleMarkerClick(c)}
          >
            <CoffeeMarker
              key={`marker-coffee-${c.id}`}
              coffee={c}
              isSelected={selectedCoffee?.id === c.id}
              isHovered={hovered === c.id}
              onClick={handleMarkerClick}
              onHover={setHovered}
            />
          </RMarker>
        );
      }) ?? ''}
    </>
  );
}
