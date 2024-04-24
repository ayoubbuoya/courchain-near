"use client";

import Header from "@/components/header/header";
import Hero from "@/components/courses/hero";
import Footer from "@/components/footer/footer";
import CoursesSection from "@/components/courses/coursesSection";
import ExpertsSection from "@/components/mentor/exprertsSection";
import FAQSection from "@/components/mentor/FAQSection";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Course } from "@/lib/types";
import Loading from "@/components/loading";
import { useWalletStore } from "@/stores/wallet";
import { CONTRACTID } from "@/lib/config";
import { useCoursesStore } from "@/stores/courses";

export default function CoursesPage() {
  // get session and courses
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { wallet, signedAccountId } = useWalletStore();
  const { setAllCourses } = useCoursesStore();

  useEffect(() => {
    // fetch courses
    async function fetchCourses() {
      const courses = await wallet.viewMethod({
        contractId: CONTRACTID,
        method: "get_courses",
        args: {},
      });
      setAllCourses(courses);
      setCourses(courses);
      setIsLoading(false);
    }

    if (wallet) {
      fetchCourses();
    }
  }, [wallet, signedAccountId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <main className="text-left text-base ">
        <Hero />
        <CoursesSection courses={courses} />
        <ExpertsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
