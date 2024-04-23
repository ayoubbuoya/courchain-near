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
export const useStore = createStore((set) => ({
  wallet: undefined,
  signedAccountId: "",
  setWallet: (wallet) => set({ wallet }),
  setSignedAccountId: (signedAccountId) => set({ signedAccountId }),
}));

// Layout Component
export default function RootLayout({ children }) {
  const { setWallet, setSignedAccountId } = useStore();

  useEffect(() => {
    const wallet = new Wallet({
      networkId: NetworkId,
      createAccessKeyFor: HelloNearContract,
    });
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
