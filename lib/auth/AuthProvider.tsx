"use client";

import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { PublicClientApplication, EventType, AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const msalInstance = new PublicClientApplication(msalConfig);

// Account selection logic
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

// Event handling for login success
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    if (event.payload.account) {
      const account = event.payload.account as AccountInfo;
      msalInstance.setActiveAccount(account);
    }
  }
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}

export function AuthenticatedContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        {router.push("/login")}
      </UnauthenticatedTemplate>
    </>
  );
}