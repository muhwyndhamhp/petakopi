import { type LatLngTuple } from 'leaflet';
import { RMap } from 'maplibre-react-components';
import useSWR from 'swr';
import { client, rpcFetch } from '@fetcher/fetcher.ts';
import { useEffect, useState } from 'react';
import { CoffeeMarkers } from './-mapLayers/-coffeeMarkers.tsx';
import { useAppStore } from '@store/store.ts';

export const DEFAULT_CENTER: LatLngTuple = [-7.5603894, 110.771847];
const TILE_URL_LIGHT =
  'https://resource.mwyndham.dev/sono/alidade_smooth_light.json';
const TILE_URL_DARK =
  'https://resource.mwyndham.dev/sono/alidade_smooth_dark.json';

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
}

export function MapLayers() {
  const [location, setLocation] = useState<LatLngTuple>(DEFAULT_CENTER);
  const [hovered, setHovered] = useState<string | undefined>();

  const collapse = useAppStore((state) => state.collapsed);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const { data } = useSWR('coffees', rpcFetch(client.api.coffees.$get)({}), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
  });

  const isDark = useDarkMode();

  return (
    <div className={`${collapse ? 'h-[92vh]' : 'h-[45vh]'} lg:h-full w-full`}>
      <RMap
        id="map-layer"
        className="!h-full w-full bg-base-100"
        mapStyle={isDark ? TILE_URL_DARK : TILE_URL_LIGHT}
        initialCenter={[location[1], location[0]]}
        initialZoom={13}
      >
        <CoffeeMarkers data={data} hovered={hovered} setHovered={setHovered} />
      </RMap>
    </div>
  );
}
