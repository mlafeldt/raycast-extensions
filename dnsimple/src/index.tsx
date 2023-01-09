import { getPreferenceValues, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

const { accessToken, accountId } = getPreferenceValues();

// No TS support: https://github.com/dnsimple/dnsimple-node/issues/153
const DnsimpleClient = require("dnsimple");
const client = DnsimpleClient({ accessToken });

type Domain = {
  id: number;
  account_id: number;
  registrant_id?: number;
  name: string;
  unicode_name: string;
  state: "hosted" | "registered" | "expired";
  auto_renew: boolean;
  private_whois: boolean;
  expires_on?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
};

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
