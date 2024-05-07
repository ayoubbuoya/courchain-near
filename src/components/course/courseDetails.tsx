import { Course, FullCourse, FullModule } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useCourseStudentStatusStore } from "@/stores/courseStudentStatus";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Session } from "next-auth";
import { useWalletStore } from "@/stores/wallet";
import { toast } from "react-toastify";

export default function CourseDetails({
  session,
  update,
  handleAddCourseToCart,
}: {
  session: Session | null;
  update: (session: any) => Promise<Session | null>;
  handleAddCourseToCart: () => void;
}) {
  const { course, isCarted, isEnrolled, isCompleted } =
    useCourseStudentStatusStore();
  const { wallet, signedAccountId } = useWalletStore();
  const router = useRouter();

  if (!course) {
    return null;
  }

  const [currentModule, setCurrentModule] = useState<FullModule | null>(
    course.modules[0]
  );
  const courseMentor = course.mentor;

  const switchToStudent = async () => {
    await update({
      ...session,
      isMentor: false,
    });

    toast.success("Switched to Student", {
      autoClose: 1000,
    });
  };

  const switchToMentor = async () => {
    await update({
      ...session,
      isMentor: true,
    });

    toast.success("Switched to Mentor", {
      autoClose: 1000,
    });
  };

  return (
    <section className="py-5 container mx-auto">
      <div className="w-[95%] mx-auto grid place-items-center md:grid-cols-2  gap-y-3">
        <div className="w-full flex justify-center items-center">
          <Image
            width={45}
            height={45}
            className="object-cover h-full w-auto rounded-2xl "
            src={course.picture || "/Boy-studyin-remotely-with-tutor.svg"}
            alt=""
          />
        </div>

        <div className="flex flex-col items-start justify-start gap-4 md:gap-8">
          <h2 className="text-aqua-blue text-center md:text-left font-bold font-poppins tracking-[-0.2%] text-2xl md:text-5xl md:leading-[3.75rem] ">
            {course.title}
          </h2>
          <p className="text-dimgray-300 text-left text-base md:text-xl font-medium font-poppins">
            {course.description}
          </p>
          <div className="flex justify-start items-center gap-4 ">
            <div>
              <img
                className="w-16 h-auto rounded-full object-cover"
                src={courseMentor.picture}
                alt=""
              />
            </div>

            <div className="flex flex-col  items-center justify-between gap-2">
              <h5 className="text-darkslategray-400 font-poppins font-bold text-lg text-center ">
                {courseMentor.name}{" "}
              </h5>
              <span className="text-dimgray-300 font-medium font-poppins text-lg text-center ">
                {formatDate(new Date(course.created_at))}
              </span>
            </div>
          </div>
        </div>

        <div></div>
        <div className="w-[95%] mx-auto ">
          {session &&
          session.user &&
          session.user.role === "user" &&
          session.isMentor &&
          signedAccountId !== course?.mentor.account_id ? (
            <button
              onClick={switchToStudent}
              className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl "
            >
              Switch To Student
            </button>
          ) : session &&
            session.user &&
            session.user.role === "user" &&
            session.isMentor &&
            signedAccountId === course?.mentor.account_id ? (
            <button
              onClick={() => {
                router.push(`/dashboard/mentor/course/${course?.id}`);
              }}
              className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl "
            >
              Edit Course
            </button>
          ) : session &&
            session.user &&
            session.user.role === "user" &&
            !session.isMentor &&
            signedAccountId === course?.mentor.account_id ? (
            <button
              onClick={switchToMentor}
              className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl "
            >
              Switch To Mentor
            </button>
          ) : isCarted ? (
            <button
              onClick={() => router.push("/cart")}
              className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl "
            >
              Already On Your Cart
            </button>
          ) : isEnrolled ? (
            <button
              onClick={() => router.push(`/learn/course/${course.id}`)}
              className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl "
            >
              Resume Learning
            </button>
          ) : isCompleted ? (
            <button className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl ">
              Course Completed
            </button>
          ) : (
            <button
              onClick={handleAddCourseToCart}
              className="w-full rounded-full text-center font-roboto font-normal text-base bg-aqua-blue py-2 text-white md:text-xl "
            >
              Add Course to Cart
            </button>
          )}
        </div>
      </div>

      <div className="w-[95%] md:w-[85%] mx-auto place-items-center grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 my-[8%] md:my-[5%]">
        <div className=" border-b-2 md:border-b-0 md:border-r-2 border-solid border-aqua-blue md:pr-6 pb-5 md:pb-0 h-full">
          <div className=" flex flex-col items-start justify-start gap-4">
            <h3 className="text-aqua-blue text-left font-bold font-poppins tracking-[-0.2%] text-xl md:text-2xl md:leading-[3.75rem] ">
              Course Modules
            </h3>

            {course.modules.map((module) => (
              <div key={module.id} className="flex flex-col gap-2">
                <h4
                  onClick={() => setCurrentModule(module)}
                  className={`
                    ${
                      currentModule?.id === module.id
                        ? "text-aqua-blue font-semibold"
                        : "text-dimgray-700 font-medium "
                    }
                   text-left font-poppins text-base cursor-pointer`}
                >
                  {module.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 h-full">
          {currentModule ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-aqua-blue text-left font-bold font-poppins tracking-[-0.2%] text-2xl md:text-2xl md:leading-[3.75rem] ">
                {currentModule.title}
              </h3>
              <p className="text-dimgray-700 text-left font-poppins font-medium text-base">
                {currentModule.description}
              </p>
              <div className="flex flex-col gap-4">
                <h5 className="text-purple font-poppins font-medium text-xl ">
                  Module Lessons :{" "}
                </h5>
                {currentModule.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex flex-col gap-2">
                    <h4 className="text-dimgray-700 text-left font-poppins font-medium text-base">
                      {lesson.title}
                    </h4>
                    <p className="text-dimgray-500 text-left font-poppins font-normal text-base">
                      {lesson.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <h4 className="text-dimgray-700 text-left font-poppins font-medium text-base">
              Select a module to view its details
            </h4>
          )}
        </div>
      </div>
    </section>
  );
}
