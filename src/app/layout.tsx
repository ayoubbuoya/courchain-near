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
import { getSession, useSession } from "next-auth/react";
import { useCurrentUserStore } from "@/stores/currentUser";
import { useLoadingStore } from "@/stores/loading";

// Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setWallet, setSignedAccountId, signedAccountId, wallet } =
    useWalletStore();
  const { allCourses, setAllCourses } = useCoursesStore();
  const { session, setSession } = useCurrentUserStore();
  const { setIsLoading } = useLoadingStore();

  async function fetchCourses() {
    setIsLoading(true);
    const courses = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_courses",
      args: {},
    });
    console.log("Courses Fetched From Layout : ", courses);
    setAllCourses(courses);
    setIsLoading(false);
  }

  async function getCurrentSession() {
    setIsLoading(true);
    const session = await getSession();
    console.log("Session from layout : ", session);
    setSession(session);
    setIsLoading(false);
  }

  useEffect(() => {
    getCurrentSession();
    const data = {
      networkId: NetworkId,
      createAccessKeyFor: HelloNearContract,
    };
    const wallet: any = new Wallet(JSON.stringify(data));
    wallet.startUp(setSignedAccountId);
    setWallet(wallet);
  }, []);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    if (wallet && signedAccountId) {
      console.log("fetching courses from layout");
      fetchCourses();
    }
  }, [wallet, signedAccountId]);

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
