"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWalletStore } from "@/stores/wallet";
import Logout from "../logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CONTRACTID } from "@/lib/config";
import { useSession } from "next-auth/react";
import ProfileDropMenu from "./ProfileDropMenu";

export default function Profile() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { signedAccountId, wallet } = useWalletStore();
  const { data: session, status, update } = useSession();



  useEffect(() => {
    if (!wallet) return;

    async function createNewUser() {
      const existed = await wallet.viewMethod({
        contractId: CONTRACTID,
        method: "user_exists",
        args: {
          account_id: signedAccountId,
          email: session?.user?.email,
          username: session?.user.username,
        },
      });
      console.log("User exists: ", existed);

      if (!existed) {
        console.log("Creating new user...");
        await wallet.callMethod({
          contractId: CONTRACTID,
          method: "create_user",
          args: {
            name: session?.user?.name,
            email: session?.user?.email,
            username: session?.user?.username,
            phone: session?.user?.phone,
            by_google: session?.user?.byGoogle,
            password: session?.user?.password || "",
            bio: session?.user?.bio,
            skills: [],
            certifications: [],
            education: [],
            picture: session?.user?.image,
            created_at: new Date().getTime(),
          },
        });
      }
    }

    if (signedAccountId && session) {
      createNewUser();
    }
  }, [wallet]);

  return (
    <div className="md:w-[25%] md:flex md:justify-end md:items-center font-poppins ">
      <div className="flex items-center ">
        {session?.user && (
          <img
            className="mr-3 rounded-full max-w-8"
            src={session?.user.image ? session.user.image : "/avatar.png"}
            alt="profile picture"
          />
        )}
        <span className="flex text-base font-medium text-center md:text-lg font-poppins text-aqua-blue ">
          Hey {session?.user?.name?.split(" ")[0] || "Anonymous"}
        </span>
        <img
          className="w-6 h-6 cursor-pointer md:w-7 md:h-7"
          src="/iconparkoutlinedown.svg"
          onClick={() => setIsDropdownVisible(!isDropdownVisible)}
        />
      </div>
      {/* Main Menu */}
      <ProfileDropMenu
        isDropdownVisible={isDropdownVisible}
        setIsDropdownVisible={setIsDropdownVisible}
        className="top-10 right-12"
      />
    </div>
  );
}
