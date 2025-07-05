import { useMemo, useState } from 'react';
import { useAppStore } from '@store/store.ts';
import { SearchResult } from './-contentTab/-searchResult.tsx';
import { LatestReviews } from './-contentTab/-latestReview.tsx';
import { AllPlaces } from './-contentTab/-allPlaces.tsx';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { getTokens } from '@cookies/tokens.ts';

export function ContentTab() {
  const [activeTab, setActiveTab] = useState<'latestReviews' | 'allPlaces'>('latestReviews');

  const { authenticated } = getTokens();

  const collapsed = useAppStore((state) => state.collapsed);
  const setCollapsed = useAppStore((state) => state.setCollapsed);

  const searchResult = useAppStore((state) => state.searchResults);

  return useMemo(() => {
    const tabList = (
      <div role="tablist" className={`tabs tabs-border p-2 items-center`}>
        <a role="tab" onClick={(e) => {
          e.preventDefault();
          if (collapsed) setCollapsed(false);
          setActiveTab('latestReviews');
        }}
           className={`tab ${activeTab === 'latestReviews' ? 'tab-active' : ''}`}
           id={'latestReviews'}>Latest Reviews</a>
        <a role="tab" onClick={(e) => {
          e.preventDefault();
          if (collapsed) setCollapsed(false);
          setActiveTab('allPlaces');
        }}
           className={`tab ${activeTab === 'allPlaces' ? 'tab-active' : ''}`} id={'allPlaces'}>All
          Places</a>
        <div className={`ml-auto`} onClick={() => setCollapsed(!collapsed)}>
          {
            collapsed ? (<RiArrowUpSLine className={`w-8 h-8 lg:hidden mt-2`} />) : (
              <RiArrowDownSLine className={`w-8 h-8 lg:hidden`} />)
          }
        </div>
      </div>
    );

    if (searchResult && searchResult.length > 0) {
      return (
        <div className={`overflow-y-scroll`}>
          <SearchResult coffees={searchResult} />
        </div>
      );
    }

    if (searchResult) {
      return <p className={`p-6 text-lg self-center`}>No Result Found!</p>;
    }

    if (collapsed) {
      return (tabList);
    }

    if (activeTab === 'latestReviews') {
      return (
        <>
          {tabList}
          <div className={`overflow-y-scroll`}>
            <LatestReviews />
          </div>
        </>
      );
    }

    return (
      <>
        {tabList}
        <div className={`overflow-y-scroll`}>
          <AllPlaces />
          {
            !authenticated &&
            <a href={'/authorize'} className={`p-4 text-xs mx-auto text-center w-full`}>+ Login</a>
          }
        </div>
      </>
    );

  }, [activeTab, searchResult, collapsed]);
}
