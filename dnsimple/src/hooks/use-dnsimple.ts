import { useEffect } from "react";

import { client } from "../dnsimple";
import type { Account } from "../dnsimple";
import useSharedState from "./use-shared-state";

const useDnsimple = () => {
  const [accounts, setAccounts] = useSharedState<Account[]>("accounts");

  useEffect(() => {
    (async () => {
      if (!accounts) {
        const accounts = await client.accounts.listAccounts();
        setAccounts(accounts.data);
      }
    })();
  }, []);

  return { accounts };
};

export default useDnsimple;
