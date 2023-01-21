import { Action, ActionPanel, Icon, List, Toast, showToast } from "@raycast/api";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

import { client } from "./dnsimple";
import type { Domain } from "./dnsimple";
import useDnsimple from "./hooks/use-dnsimple";

export default function Command() {
  const { accounts } = useDnsimple();
  const [state, setState] = useState<{
    domains?: Domain[];
  }>({});

  useEffect(() => {
    (async () => {
      try {
        if (accounts) {
          setState({
            domains: await client.domains.allDomains(accounts[0]?.id),
          });
        }
      } catch (err: any) {
        console.error(err);
        showToast({
          style: Toast.Style.Failure,
          title: err.message,
        });
        throw new Error("Failed to get domains");
      }
    })();
  }, [accounts]);

  return (
    <List isLoading={!state.domains}>
      {state.domains?.map((domain) => (
        <List.Item
          id={domain.id.toString()}
          key={domain.id}
          title={domain.name}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Open Domain in DNSimple"
                url={`https://dnsimple.com/a/${domain.account_id}/domains/${domain.name}`}
              ></Action.OpenInBrowser>
              <Action.OpenInBrowser
                title="Open Record Editor in DNSimple"
                url={`https://dnsimple.com/a/${domain.account_id}/domains/${domain.name}/records`}
                icon={Icon.List}
              ></Action.OpenInBrowser>
            </ActionPanel>
          }
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
