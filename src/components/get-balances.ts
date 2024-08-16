import { AnkrProvider } from "@ankr.com/ankr.js";
import { unstable_cache } from "next/cache";

const WALLET_ADDRESS = "0x2e4234B6d6805034f6c61b1172A9270B2958F32d";
// 0x088b4DeD793C26864EF5eec465229a49bAd87C8e

const ANRK_API_KEY =
  "https://rpc.ankr.com/multichain/76fe09906ea83f814dfe76d8fadba07e0202557dd24a9f8cc8080cc418a167e0";

// Generate a cache key based on an invalidation trigger (e.g., a counter or timestamp)
export const cachedFetchData = unstable_cache(
  async function fetchBalances() {
    // avoid doing the call if there is not wallet address
    // we'll get this information from the database.
    // possible cases: undefined, empty, null, string.
    if (!WALLET_ADDRESS) {
      return null;
    }
    const provider = new AnkrProvider(ANRK_API_KEY);
    const balances = await provider.getAccountBalance({
      walletAddress: WALLET_ADDRESS,
    });
    return balances;
  },
  // here we add the userID in the keyParts so Next.js can make separate caches for the different userID's
  ["fetchBalances", WALLET_ADDRESS],
  {
    tags: [`cached-balances-tag-${WALLET_ADDRESS}`],
    revalidate: 60, // Optional: Cache for 60 seconds by default
  }
);
