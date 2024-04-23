"use client";

// react
import { useEffect } from "react";
import { create as createStore } from "zustand";

// app
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NetworkId, HelloNearContract } from "../lib/config";

// wallet-selector
import { Wallet } from "@/wallets/near-wallet";

import SessionWrapper from "@/components/sessionWrapper";
import { ToastContainer } from "react-toastify";

// store to share  wallet and signedAccountId
export const useStore = createStore<{
  wallet: any;
  signedAccountId: string;
  setWallet: (wallet: any) => void;
  setSignedAccountId: (signedAccountId: string) => void;
}>((set) => ({
  wallet: undefined,
  signedAccountId: "",
  setWallet: (wallet) => set({ wallet }),
  setSignedAccountId: (signedAccountId) => set({ signedAccountId }),
}));

// Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setWallet, setSignedAccountId } = useStore();

  useEffect(() => {
    const data = {
      networkId: NetworkId,
      createAccessKeyFor: HelloNearContract,
    };
    const wallet = new Wallet(JSON.stringify(data));
    wallet.startUp(setSignedAccountId);
    setWallet(wallet);
  }, []);

  return (
    <SessionWrapper>
      <html lang="en">
        <body className="w-full relative">
          {children}
          <ToastContainer />
        </body>
      </html>
    </SessionWrapper>
  );
}
