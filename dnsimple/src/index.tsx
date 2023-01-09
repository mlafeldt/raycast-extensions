import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

import { client, accountId } from "./dnsimple";
import type { Domain } from "./dnsimple";

export default function Command() {
  const [state, setState] = useState<{
    domains?: Domain[];
  }>({});

  useEffect(() => {
    (async () => {
      try {
        setState({
          domains: await client.domains.allDomains(accountId),
        });
      } catch (err: any) {
        console.error(err);
        showToast({
          style: Toast.Style.Failure,
          title: err.message,
        });
        throw new Error("Failed to get domains");
      }
    })();
  }, []);

  return (
    <List isLoading={!state.domains}>
      {state.domains?.map((domain) => (
        <List.Item
          id={domain.id.toString()}
          key={domain.id}
          title={domain.name}
          accessories={[
            {
              text: domain.expires_on
                ? `${domain.auto_renew ? "Renews" : "Expires"} ${formatDistanceToNowStrict(
                    new Date(domain.expires_on),
                    { addSuffix: true }
                  )}`
                : undefined,
              tooltip: domain.expires_at ? new Date(domain.expires_at).toString().replace(/ \(.*\)/, "") : undefined,
            },
          ]}
        />
      ))}
    </List>
  );
}
