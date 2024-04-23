import { Course } from "@/lib/types";
import CourseMinCard from "./courseMinCard";
import Link from "next/link";

export default function MinCoursesSection({
  courses,
}: {
  courses: Course[] | null;
}) {
  // last six courses
  const lastSixCourses = courses?.slice(-6);
  return (
    <section className="text-left w-[90%] mx-auto ">
      <div className="w-[98%] mx-auto my-2">
        <h1 className="text-xl md:text-[2.5rem] md:leading-10 font-normal uppercase text-aqua-blue font-capriola mt-8 ">
          Decouvrir nos cours & certifications
        </h1>
      </div>

      <div className="grid py-4 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4">
        {lastSixCourses &&
          lastSixCourses.map((course) => (
            <CourseMinCard
              key={course.id}
              title={course.title}
              price={Number(course.price) || 18}
              link={`/course/${course.id}`}
            />
          ))}
      </div>
      <div className="flex justify-center md:justify-end items-center py-4 md:pb-8">
        <Link
          href="/courses"
          className="bg-aqua-blue text-center py-3 px-6 md:px-10 rounded-full text-white font-roboto font-normal tracking-normal text-base"
        >
          Voir tout les cours et certifications
        </Link>
      </div>
    </section>
  );
}
