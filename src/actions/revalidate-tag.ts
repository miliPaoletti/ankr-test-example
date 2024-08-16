"use server";

import { revalidateTag } from "next/cache";

export const localRevalidateTag = () => {
  revalidateTag("cached-balances-tag");
};
