import CoursesOverview from "@/components/dashboard/admin/coursesOverview";
import SplitLayout from "@/components/dashboard/splitLayout";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="md:grid md:grid-cols-12">
      <SplitLayout session={session} />
      <main className="container min-h-screen pb-5 mx-auto md:px-5 md:col-span-11 md:pb-10">
        <div className="mt-4 md:mt-0 px-3 w-full md:px-0 md:max-w-[39%]">
          <h1 className="mb-1 text-2xl font-normal uppercase text-aqua-blue font-poppins md:text-3xl ">
            Courses Overview
          </h1>
        </div>

        <CoursesOverview />
      </main>
    </div>
  );
}
