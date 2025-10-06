import { SWRConfiguration } from "swr";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
  // cach statitc data for 5 minutes
  focusThrottleInterval: 300000,
};
