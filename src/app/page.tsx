import Balances from "@/components/balances";
import { cachedFetchData } from "@/components/get-balances";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
// create a Server Component to do the prefetching part
export default async function Home() {
  const queryClient = new QueryClient();
  // prefetch the data so we already have it on the first call - server side
  await queryClient.prefetchQuery({
    queryKey: ["balances"],
    queryFn: cachedFetchData,
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold py-6 text-center">Show balances</h1>
      {/* Neat! Serialization is now as easy as passing props.
          HydrationBoundary is a Client Component, so hydration will happen there. */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Balances />
      </HydrationBoundary>
    </div>
  );
}
