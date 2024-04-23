import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "../../app/layout";
import Logout from "../logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";

export default function ProfileDropMenu({
  isDropdownVisible,
  setIsDropdownVisible,
  className,
}: {
  isDropdownVisible: boolean;
  setIsDropdownVisible: (value: boolean) => void;
  className?: string;
}) {
  const { data: session, status, update } = useSession();
  const { signedAccountId, wallet } = useStore();

  const handleLoginWallet = async () => {
    await wallet.signIn();
  };

  const handleWalletLogout = async () => {
    await wallet.signOut();
    toast.success("Logged out successfully!");
    setIsDropdownVisible(false);
  };

  const switchToMentor = async () => {
    await update({
      ...session,
      isMentor: true,
    });
    setIsDropdownVisible(false);
    toast.success("Switched to Mentor", {
      autoClose: 1000,
    });
  };

  const switchToStudent = async () => {
    await update({
      ...session,
      isMentor: false,
    });
    setIsDropdownVisible(false);
    toast.success("Switched to Student", {
      autoClose: 1000,
    });
  };

  return (
    <div
      className={`${
        isDropdownVisible ? "md:fixed" : "hidden"
      } ${className} font-poppins z-50 mt-1 px-1 md:px-0 md:my-4 text-base list-none md:bg-white md:divide-y md:divide-gray-100 rounded md:shadow text-left`}
    >
      <div className="block px-4 pt-3 pb-1 md:py-3 md:block">
        <p className="text-sm text-gray-900">
          {session?.user?.name || "Anonymous"}
        </p>
        <p className="text-sm font-medium text-gray-900 truncate">
          {session?.user?.email || "Anonymous"}
        </p>
      </div>
      <ul className="mt-2.5 md:mt-0  md:py-1 border-t-[1px] border-solid border-aqua-blue md:border-t-0 ">
        <li>
          <Link
            href={
              session?.isMentor
                ? "/dashboard/mentor"
                : !session?.isMentor
                ? "/dashboard/student"
                : "/dashboard"
            }
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 truncate hover:bg-gray-100"
          >
            Settings
          </Link>
        </li>
      </ul>

      <ul className="py-0.5 md:py-1 border-t-[1px] border-solid border-aqua-blue md:border-t-0">
        <li>
          {session?.isMentor ? (
            <button
              onClick={switchToStudent}
              className="text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Switch to Student
            </button>
          ) : (
            <button
              onClick={switchToMentor}
              className="text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Switch to Mentor
            </button>
          )}
        </li>
      </ul>

      <ul className="py-0.5 md:py-1 border-t-[1px] border-solid border-aqua-blue md:border-t-0">
        <li>
          {signedAccountId ? (
            <button
              onClick={handleWalletLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout {signedAccountId}
            </button>
          ) : (
            <button
              onClick={handleLoginWallet}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Login to NEAR Wallet
            </button>
          )}
        </li>
      </ul>

      <ul className="pt-1 md:py-1 border-t-[1px] border-solid border-aqua-blue md:border-t-0">
        <li>
          <Logout />
        </li>
      </ul>
    </div>
  );
}
