"use client";

// react
import { useEffect } from "react";

// app
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NetworkId, HelloNearContract, CONTRACTID } from "../lib/config";

// wallet-selector
import { Wallet } from "@/wallets/near-wallet";

import SessionWrapper from "@/components/sessionWrapper";
import { ToastContainer } from "react-toastify";
import { useWalletStore } from "@/stores/wallet";
import { useCoursesStore } from "@/stores/courses";

// Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setWallet, setSignedAccountId, signedAccountId } = useWalletStore();
  const { allCourses, setAllCourses } = useCoursesStore();

  useEffect(() => {
    const data = {
      networkId: NetworkId,
      createAccessKeyFor: HelloNearContract,
    };
    const wallet: any = new Wallet(JSON.stringify(data));
    wallet.startUp(setSignedAccountId);
    setWallet(wallet);

    if (!wallet) {
      console.log("wallet not found");
    }

    if (wallet && signedAccountId) {
      console.log("fetching courses from layout");
      fetchCourses();
    }

    async function fetchCourses() {
      const courses = await wallet.viewMethod({
        contractId: CONTRACTID,
        method: "get_courses",
        args: {},
      });
      setAllCourses(courses);
    }
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
