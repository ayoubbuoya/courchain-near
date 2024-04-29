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
  const [isLoading, setIsLoading] = useState(false);
  const { wallet, signedAccountId } = useWalletStore();
  const { allCourses, setAllCourses } = useCoursesStore();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <main className="text-left text-base ">
        <Hero />
        <CoursesSection courses={allCourses} />
        <ExpertsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
