"use client";

import SplitLayout from "@/components/dashboard/splitLayout";
import { useSession } from "next-auth/react";

export default function ImportCourse() {
  const { data: session } = useSession();
  return (
    <div className="md:grid md:grid-cols-12">
      <SplitLayout session={session} />
      <main className="container min-h-[89vh] max-h-screen pb-5 mx-auto md:px-5 md:col-span-11 md:pb-10">
        <div className="mt-4 md:mt-0 px-3 w-full md:px-0 md:max-w-[39%]">
          <h1 className="mb-1 text-2xl font-normal uppercase text-aqua-blue font-poppins md:text-3xl ">
            Create New Course
          </h1>
        </div>

        <div className="custom-linear-border rounded-2xl mt-[15%]">
          <div className="p-20">
            
          </div>
        </div>
      </main>
    </div>
  );
}
