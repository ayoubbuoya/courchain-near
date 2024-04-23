"use client";

import Loading from "@/app/loading";
import SplitLayout from "@/components/dashboard/splitLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role === "admin") {
      // redirect to admin dashboard
      router.push("/dashboard/admin");
      return;
    }

    if (session.user.role === "user" && session.isMentor) {
      // redirect to mentor dashboard
      router.push("/dashboard/mentor");
      return;
    }
  }, [session]);

  return (
    <div className="md:grid md:grid-cols-12">
      <SplitLayout session={session} />
    </div>
  );
}
