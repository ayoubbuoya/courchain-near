"use client";

import Header from "@/components/header/header";
import Loading from "@/components/loading";
import { CONTRACTID } from "@/lib/config";
import { FullCourse, User } from "@/lib/types";
import { useWalletStore } from "@/stores/wallet";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ProfilePage({
  params,
}: {
  params: {
    accountId: string;
  };
}) {
  const { accountId } = params;
  const { wallet, signedAccountId } = useWalletStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedCourses, setCompletedCourses] = useState<FullCourse[] | null>(
    null
  );
  const [createdCourses, setCreatedCourses] = useState<FullCourse[] | null>(
    null
  );
  const [isShowingCompletedCourses, setIsShowingCompletedCourses] =
    useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [picture, setPicture] = useState<string>("");

  async function getUserData() {
    setIsLoading(true);
    const fetchedUser = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_user_by_id",
      args: { id: accountId },
    });
    setUser(fetchedUser);
    setName(fetchedUser.name);
    setPhone(fetchedUser.phone);
    console.log("Fetched User : ", fetchedUser);
    setIsLoading(false);
  }

  async function getUserCompletedCourses() {
    setIsLoading(true);
    const fetchedCourses = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_user_completed_full_courses",
      args: { account_id: accountId },
    });
    setCompletedCourses(fetchedCourses);
    console.log("Fetched Completed Courses : ", fetchedCourses);
    setIsLoading(false);
  }

  async function getUserCreatedCourses() {
    setIsLoading(true);
    const fetchedCourses = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_user_created_full_courses",
      args: { account_id: accountId },
    });
    setCreatedCourses(fetchedCourses);
    console.log("Fetched Created Courses : ", fetchedCourses);
    setIsLoading(false);
  }

  // get user data
  useEffect(() => {
    if (!wallet) return;

    getUserData();
    getUserCompletedCourses();
    getUserCreatedCourses();

    // get user data
  }, [wallet]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold text-schemes-secondary">
          User not found
        </h1>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className=" grid min-h-[96vh] w-full grid-cols-1 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gray-100 dark:bg-gray-800 lg:p-10">
          <Avatar className="w-24 h-24">
            <AvatarImage alt="@shadcn" src={user.picture} />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-semibold font-poppins text-aqua-blue">
              {user.name}{" "}
            </h2>
            <p className="text-gray-500 font-poppins ">{user.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-poppins">
            <div className="space-y-1">
              <p className="font-medium">Courses Completed</p>
              <p className="text-gray-500 ">
                {completedCourses ? completedCourses.length : 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Courses Created</p>
              <p className="text-gray-500 ">
                {createdCourses ? createdCourses.length : 0}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center items-center  gap-2">
            {signedAccountId === accountId && (
              <button
                onClick={() => setIsEditing(true)}
                className=" px-3 py-3 rounded-sm bg-aqua-blue text-base font-normal text-center text-white capitalize font-poppins"
              >
                Edit your profile info
              </button>
            )}
            {isShowingCompletedCourses ? (
              <button
                onClick={() => setIsShowingCompletedCourses(false)}
                className="px-3 py-3 rounded-sm bg-aqua-blue text-base font-normal text-center text-white capitalize font-poppins"
              >
                Show Created Courses
              </button>
            ) : (
              <button
                onClick={() => setIsShowingCompletedCourses(true)}
                className="px-3 py-3.5 rounded-sm bg-aqua-blue text-sm font-medium text-center text-white capitalize font-poppins"
              >
                Show Completed Courses
              </button>
            )}
          </div>
        </div>
        {isShowingCompletedCourses ? (
          <div className="flex flex-col gap-6 p-6 font-poppins  lg:p-10">
            <div className="space-y-2">
              <h3 className="text-xl text-aqua-blue font-semibold">
                Completed Courses
              </h3>
              <p className="text-gray-500 ">
                Here are the courses you've completed on our platform.
              </p>
            </div>
            <div className="grid gap-4">
              {completedCourses?.map((course, index) => (
                <Card key={index}>
                  <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="pt-5">
                      <h4 className="text-xl text-aqua-blue font-poppins capitalize font-medium">
                        {course.title}
                      </h4>
                      <Link
                        href={`/profile/${course.mentor.account_id}`}
                        className="duration-200 text-gray-500 font-poppins font-normal text-base cursor-pointer hover:underline hover:text-purple hover:font-medium  "
                      >
                        Mentor: {course.mentor.name}
                      </Link>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-6 font-poppins  lg:p-10">
            <div className="space-y-2">
              <h3 className="text-xl text-aqua-blue font-semibold">
                Created Courses
              </h3>
              <p className="text-gray-500 ">
                Here are the courses you've created on our platform.
              </p>
            </div>
            <div className="grid gap-4">
              {createdCourses?.map((course, index) => (
                <Card key={index}>
                  <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="pt-5">
                      <h4 className="text-xl text-aqua-blue font-poppins capitalize font-medium">
                        {course.title}
                      </h4>
                      <Link
                        href={`/profile/${course.mentor.account_id}`}
                        className="duration-200 text-gray-500 font-poppins font-normal text-base cursor-pointer hover:underline hover:text-purple hover:font-medium  "
                      >
                        Mentor: {course.mentor.name}
                      </Link>
                    </div>
                    <Badge variant="secondary">Created</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[38%]">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium capitalize text-aqua-blue font-poppins ">
                Edit user details
              </DialogTitle>
              <DialogDescription className="text-schemes-secondary">
                Make changes to your user details here. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label
                  htmlFor="name"
                  className="text-base font-normal text-right text-aqua-blue font-poppins "
                >
                  Name
                </Label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3 outline-aqua-blue py-3 border border-aqua-blue rounded-lg px-3 font-poppins font-normal text-[0.8rem] leading-5 text-schemes-primary"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label
                  htmlFor="phone"
                  className="text-base font-normal text-right text-aqua-blue font-poppins "
                >
                  Phone
                </Label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3 outline-aqua-blue py-3 border border-aqua-blue rounded-lg px-3 font-poppins font-normal text-[0.8rem] leading-5 text-schemes-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className=" bg-aqua-blue outline-aqua-blue text-white rounded-lg px-5 py-2 font-poppins font-normal text-[0.88rem] leading-5 duration-700 text-center hover:bg-white hover:text-aqua-blue hover:border hover:border-aqua-blue"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
