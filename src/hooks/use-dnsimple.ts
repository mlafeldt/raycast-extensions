import { useEffect } from "react";

import { type Account, getAccounts } from "../lib/dnsimple";
import useSharedState from "./use-shared-state";

const useDnsimple = () => {
  const [accounts, setAccounts] = useSharedState<Account[]>("accounts");

  useEffect(() => {
    (async () => {
      try {
        if (!accounts) {
          setAccounts(await getAccounts());
        }
      } catch (err) {
        console.error(err);
        throw new Error("Failed to get accounts");
      }
    })();
  }, []);

  return { accounts };
};

export default useDnsimple;
