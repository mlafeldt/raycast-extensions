import { getPreferenceValues } from "@raycast/api";
import { DNSimple } from "dnsimple";

const { accessToken } = getPreferenceValues();

const client = new DNSimple({
  accessToken,
  userAgent: "Raycast",
});

// Unfortunately, the dnsimple package doesn't export any types yet
export type Account = Awaited<ReturnType<typeof client.accounts.listAccounts>>["data"][0];
export type Domain = Awaited<ReturnType<typeof client.domains.listDomains>>["data"][0];

export const getAccounts = (): Promise<Account[]> => client.accounts.listAccounts().then((resp) => resp.data);

export const getDomains = (accountId: number): Promise<Domain[]> => client.domains.listDomains.collectAll(accountId);
