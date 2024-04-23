"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/app/layout";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CONTRACTID } from "@/lib/config";
import Loading from "@/components/loading";
import SplitLayout from "@/components/dashboard/splitLayout";
import {
  FullEnrollment,
  FullLessonProgress,
  FullModuleProgress,
} from "@/lib/types";
import Image from "next/image";
import Markdown from "react-markdown";

export default function LearnCoursePage({
  params,
}: {
  params: {
    courseId: number;
  };
}) {
  const { courseId } = params;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const moduleOrder = Number(searchParams.get("module")) || 1;
  const lessonOrder = Number(searchParams.get("lesson")) || 1;
  const { wallet, signedAccountId } = useStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<FullEnrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<FullLessonProgress | null>(
    null
  );

  async function fetchCourseEnrollment() {
    const courseEnrollment = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_student_enrolled_course",
      args: {
        course_id: Number(courseId),
        student_id: signedAccountId,
      },
    });
    setIsLoading(false);

    console.log("Course Enrollment: ", courseEnrollment);

    if (!courseEnrollment) {
      await toast.error("You are not enrolled in this course", {
        autoClose: 1000,
      });
      router.push(`/course/${courseId}`);
      return;
    }

    setEnrollment(courseEnrollment);
    setCurrentLesson(
      courseEnrollment.modules[moduleOrder - 1].lessons[lessonOrder - 1]
    );
  }

  useEffect(() => {
    console.log("LearnCoursePage mounted");

    if (!wallet) return;

    if (!signedAccountId) {
      toast.error("Please connect wallet first");
      return;
    }

    if (signedAccountId) {
      console.log("signedAccountId", signedAccountId);
    }

    if (wallet && signedAccountId) {
      fetchCourseEnrollment();
    }

    return () => {
      console.log("LearnCoursePage unmounted");
      setEnrollment(null);
      setIsLoading(true);
    };
  }, [wallet, signedAccountId]);

  useEffect(() => {
    console.log("Module Order Changed: ", moduleOrder);
    setIsLoading(true);
    if (wallet) {
      if (enrollment) {
        setCurrentLesson(
          enrollment.modules[moduleOrder - 1].lessons[lessonOrder - 1]
        );
        setIsLoading(false);
      } else {
        fetchCourseEnrollment();
      }
    }
  }, [searchParams]);

  if (isLoading) {
    return <Loading />;
  }

  const handleLessonOrderChange = (order: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("lesson", order.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleModuleOrderChange = (order: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("module", order.toString());
    params.set("lesson", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleMarkLessonAsCompleted = async () => {
    const loadingToast = toast.loading("Marking Lesson as Completed");

    try {
      const callResult = await wallet.callMethod({
        contractId: CONTRACTID,
        method: "complete_lesson",
        args: {
          lesson_id: currentLesson?.lesson.id,
        },
      });

      const success = Boolean(
        Buffer.from(callResult.status.SuccessValue, "base64").toString(
          "utf-8"
        ) === "true"
      );

      if (!success) {
        toast.update(loadingToast, {
          render: "Error marking lesson as completed",
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
        return;
      }

      toast.update(loadingToast, {
        render: "Lesson marked as completed",
        type: "success",
        autoClose: 2000,
        isLoading: false,
      });

      fetchCourseEnrollment();
    } catch (error) {
      console.error("Error marking lesson as completed: ", error);
      toast.update(loadingToast, {
        render: "Error marking lesson as completed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  return (
    <div className="md:grid md:grid-cols-12">
      <SplitLayout session={session} />
      <main className="w-full min-h-screen py-5 md:px-5 md:col-span-11 md:py-10 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
          <div className="lef-side md:col-span-2">
            <h1 className="mb-4 text-2xl font-semibold text-purple">
              {enrollment?.course.title}
            </h1>
            <div className="">
              {currentLesson?.lesson.video_url ? (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                  <video
                    className="w-full h-full"
                    src={currentLesson?.lesson.video_url}
                    controls
                  />
                </div>
              ) : (
                <div className="w-full xl:max-w-[88%] mx-auto overflow-x-hidden overflow-y-auto ">
                  <Markdown
                    children={
                      currentLesson?.lesson.article || "No Content Available"
                    }
                    components={{
                      strong: ({ node, ...props }) => (
                        <strong className="text-aqua-blue font-poppins font-medium text-xl">
                          {props.children}
                        </strong>
                      ),
                      p: ({ node, ...props }) => (
                        <p className="text-schemes-secondary font-poppins py-2 font-normal text-base">
                          {props.children}
                        </p>
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside">
                          {props.children}
                        </ul>
                      ),
                      li: ({ node, ...props }) => (
                        <li className="marker:text-purple text-schemes-secondary font-poppins font-normal text-base ">
                          {props.children}
                        </li>
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-semibold text-purple">
                          {props.children}
                        </h1>
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-semibold text-purple">
                          {props.children}
                        </h2>
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold text-purple">
                          {props.children}
                        </h3>
                      ),
                      h4: ({ node, ...props }) => (
                        <h4 className="text-base font-semibold text-purple">
                          {props.children}
                        </h4>
                      ),
                      h5: ({ node, ...props }) => (
                        <h5 className="text-base font-semibold text-purple">
                          {props.children}
                        </h5>
                      ),
                      h6: ({ node, ...props }) => (
                        <h6 className="text-base font-semibold text-purple">
                          {props.children}
                        </h6>
                      ),

                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside">
                          {props.children}
                        </ol>
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-aqua-blue pl-4">
                          {props.children}
                        </blockquote>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-gray-200 p-1">
                          {props.children}
                        </code>
                      ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-gray-200 p-1">{props.children}</pre>
                      ),
                    }}
                    className={`text-schemes-secondary font-poppins py-2 font-normal text-base`}
                  />
                  {currentLesson?.status === "completed" ? (
                    <button className="w-full font-poppins font-medium py-2 mt-5 text-white bg-aqua-blue rounded-md">
                      Lesson Completed
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkLessonAsCompleted}
                      className="w-full font-poppins font-medium py-2 mt-5 text-white bg-aqua-blue rounded-md"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="right-side pr-5">
            <div className="flex flex-col items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold text-purple">
                Course Content
              </h1>
              {enrollment?.modules.map((module) => (
                <div
                  key={module.id}
                  className="w-full custom-linear-border rounded-2xl"
                >
                  <div className="flex items-center space-x-4 p-3 rounded-2xl overflow-hidden w-full">
                    <div className="w-full overflow-hidden">
                      <div className="w-full overflow-hidden">
                        <div className="w-full overflow-hidden flex items-center justify-between">
                          <h2 className="text-lg font-semibold truncate text-aqua-blue">
                            {module.module.title}
                          </h2>
                          <button
                            onClick={() =>
                              handleModuleOrderChange(module.module.order)
                            }
                            className="text-sm font-semibold text-aqua-blue"
                          >
                            <Image
                              width={20}
                              height={20}
                              className={`w-4 h-4 duration-1000 ${
                                module.module.order === moduleOrder
                                  ? "transform rotate-180 "
                                  : ""
                              } `}
                              src="/down-arrow.svg"
                              alt=""
                            />
                          </button>
                        </div>
                        <p className="text-[0.9rem] font-poppins font-normal text-gray-500">
                          {module.status}
                        </p>
                      </div>
                      {module.module.order === moduleOrder && (
                        <div className="w-full flex flex-col justify-between items-start gap-3 pl-5 py-4">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="w-full cursor-pointer flex justify-between items-baseline"
                              onClick={() => {
                                handleLessonOrderChange(lesson.lesson.order);
                              }}
                            >
                              <h2
                                className={`text-lg ${
                                  lesson.lesson.order === lessonOrder
                                    ? "text-aqua-blue font-semibold"
                                    : "text-dimgray-700 font-medium "
                                }`}
                              >
                                {lesson.lesson.title}
                              </h2>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
