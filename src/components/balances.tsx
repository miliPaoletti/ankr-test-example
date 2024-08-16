"use client";

import { useQuery } from "@tanstack/react-query";
import { cachedFetchData } from "./get-balances";
import Image from "next/image";
import { localRevalidateTag } from "@/actions/revalidate-tag";

export default function Balances() {
  // Note that we are using useQuery here instead of useSuspenseQuery.
  // Because this data has already been prefetched, there is no need to
  // ever suspend in the component itself. If we forget or remove the
  // prefetch, this will instead fetch the data on the client, while
  // using useSuspenseQuery would have had worse side effects.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["balances"],
    queryFn: cachedFetchData,
  });

  // different states when fetching data
  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>error...</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <div>
      <h1>Total balance: {data.totalBalanceUsd}</h1>
      <div className="grid grid-col-1 lg:grid-cols-3 gap-3">
        {data.assets.map((asset) => {
          return (
            <div
              key={asset.tokenName}
              className="border border-gray-50 rounded-lg p-4"
            >
              {asset.thumbnail !== "" && (
                <Image
                  src={asset.thumbnail}
                  alt={asset.tokenName}
                  width={20}
                  height={20}
                />
              )}
              <h2>{asset.tokenName}</h2>
              <p>Balance: {asset.balance}</p>
              <p>Balance USD: {asset.balanceUsd}</p>
            </div>
          );
        })}
      </div>

      <button
        className="p-4 text-xl border rounded border-gray-50"
        onClick={() => {
          localRevalidateTag();
        }}
      >
        Click me to update server side!
      </button>
    </div>
  );
}
