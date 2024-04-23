import Header from "@/components/header/header";
import Hero from "@/components/home/hero";
import CoursesSection from "@/components/home/coursesSection";
import PlansSection from "@/components/home/plansSection";
import MentorSection from "@/components/home/mentorSection";
import CommunitySection from "@/components/home/CommunitySection";
import TrendsSection from "@/components/home/trendsSection";
import AddedValuesSection from "@/components/home/addedValuesSection";
import Footer from "@/components/footer/footer";
import { getServerSession } from "next-auth";
import MinCoursesSection from "@/components/home/minCoursesSeection";
import Link from "next/link";

export default async function Homepage() {
  const session = await getServerSession();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`
  );
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data");
  }

  const { courses } = await response.json();

  return (
    <>
      <Header />
      <main className="min-h-screen text-base text-left bg-white-900 font-poppins text-dimgray-100">
        <Hero />
        <CoursesSection />
        <PlansSection />
        <MentorSection />
        <CommunitySection />
        <TrendsSection />
        <section className="text-white text-left bg-home-certif-green-purple-gradient backdrop-blur-[3.13rem] overflow-hidden">
          <div className="container grid place-items-center gap-12 px-3 py-8 md:py-12 mx-auto place-items-center sm:grid-cols-2">
            <div className="flex flex-col justify-between items-center gap-3 md:gap-6  md:items-start">
              <h1 className="text-2xl font-normal text-center uppercase  text-aqua-blue md:text-3xl xl:text-5xl font-capriola ">
                Devenez certifié en IA et Blockchain
              </h1>
              <p className="pl-2 text-sm font-medium md:pl-0 text-dimgray-800 md:text-base lg:text-lg xl:text-xl font-poppins">
                {` Faites Reconnaître Votre Expertise avec Nos Certifications de
              Premier Plan Investissez dans votre avenir dès aujourd'hui avec
              nos certificats attestant de votre expertise exceptionnelle en IA
              et Blockchain.`}
              </p>
              <div className="w-[80%] sm:w-[95%]  flex items-center justify-center py-4">
                <Link
                  href={"/courses"}
                  className="w-full py-2 font-normal text-center rounded-full cursor-pointer md:py-3 sm:text-lg bg-aqua-blue font-roboto"
                >
                  Décrochez Votre Certification
                </Link>
              </div>
            </div>
            <div className="hidden  sm:flex sm:justify-center sm:items-center">
              <img
                className="object-cover max-w-full"
                src="/books-graduation-hat-and-diploma-scroll@2x.png"
                alt=""
              />
            </div>
          </div>
        </section>
        <MinCoursesSection courses={courses} />
        <AddedValuesSection />
      </main>
      <Footer />
    </>
  );
}
