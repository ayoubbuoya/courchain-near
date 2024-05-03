"use client";

import { useWalletStore } from "@/stores/wallet";
import SplitLayout from "@/components/dashboard/splitLayout";
import Loading from "@/components/loading";
import { CONTRACTID } from "@/lib/config";
import Image from "next/image";
import Lesson from "@/types/lesson";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page({
  params,
}: {
  params: { course_id: number; module_id: number };
}) {
  const { course_id, module_id } = params;
  const moduleId = Number(module_id);
  const { data: session } = useSession();
  const { signedAccountId, wallet } = useWalletStore();
  const [lessons, setLessons] = useState<any[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  console.log("Course ID: ", course_id);
  console.log("Module ID: ", module_id);
  console.log("Signed Account ID: ", signedAccountId);

  useEffect(() => {
    if (!wallet) return;

    // get module lessons from the blockchain
    async function getModuleLessons() {
      const lessons = await wallet.viewMethod({
        contractId: CONTRACTID,
        method: "get_module_lessons",
        args: {
          module_id: Number(module_id),
        },
      });
      setLessons(lessons);
      console.log("Module Lessons: ", lessons);
    }

    if (signedAccountId) {
      console.log("Getting module lessons...");
      getModuleLessons();
    }
  }, [wallet, signedAccountId]);

  const handleGenerateLessonContent = async (lessonId: string) => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AI_SERVER_API}/lesson/generate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: course_id,
          lesson_id: lessonId,
          mentor_id: signedAccountId,
        }),
      }
    );

    if (!response.ok) {
      setIsLoading(false);
      console.error("Error generating lesson content : ", response.statusText);
      toast.error("Error generating lesson content");
      return;
    }

    const { message, lesson } = await response.json();
    console.log("Message: ", message);
    console.log("Lesson: ", lesson);
    setLesson(lesson);
    setIsLoading(false);

    toast.success(message, {
      autoClose: 2000,
    });
  };

  const handleSaveLesson = async () => {
    const loadingToast = toast.loading("Saving lesson");
    if (!lesson) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Lesson To Save",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    }

    if (!wallet) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Wallet Connected",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    }

    if (!signedAccountId) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Account Connected",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    }

    try {
      const response = await wallet.callMethod({
        contractId: CONTRACTID,
        method: "add_article_to_lesson",
        args: {
          lesson_id: lesson.id,
          article: lesson.article,
        },
      });

      const resSuccess = Boolean(
        Buffer.from(response.status.SuccessValue, "base64").toString(
          "utf-8"
        ) === "true"
      );

      if (!resSuccess) {
        toast.update(loadingToast, {
          type: "error",
          render: "Error Saving lesson",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      toast.update(loadingToast, {
        type: "success",
        render: "Lesson Saved Successfully",
        isLoading: false,
        autoClose: 1000,
      });

      setLesson(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving lesson: ", error);
      toast.update(loadingToast, {
        type: "error",
        render: "Error saving lesson",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  if (!session) {
    return <Loading />;
  }

  return (
    <div className="md:grid md:grid-cols-12">
      <SplitLayout session={session} />
      <main className="md:col-span-11 tracking-normal min-h-screen ">
        <div className="container mx-auto ">
          {lessons.length > 0 ? (
            <div className="flex flex-col md:flex-row md:gap-8 px-4 py-3 md:py-0 md:px-5">
              <div className="md:min-w-[25%]">
                <div className={`flex-col hidden md:flex md:mb-6`}>
                  <h2 className="text-xl font-semibold text-darkslategray-800 font-poppins">
                    Les cours générés par courchain
                  </h2>
                  <span className="text-base font-normal text-dimgray-50 font-poppins">
                    Des modules qui pourraient vous intéresser{" "}
                  </span>
                </div>
                {lessons.map((lesson: Lesson) => (
                  <div
                    key={lesson.id}
                    className="w-full custom-linear-border rounded-xl my-3 md:mb-6 hover:shadow-custom-purple"
                  >
                    <div
                      onClick={() => handleGenerateLessonContent(lesson.id)}
                      className="p-3 pr-2 pb-2 rounded-xl group hover:bg-purple hover:bg-opacity-30  hover:backdrop-blur-[3.13rem] cursor-pointer"
                    >
                      <div className="flex justify-start mb-3">
                        <h2 className="text-base md:text-sm font-medium font-poppins text-aqua-blue">
                          {lesson.title}
                        </h2>
                      </div>
                      <div className="flex justify-end ">
                        <Image
                          src="/fi_external-link.svg"
                          alt=""
                          width={25}
                          height={25}
                          className="rounded-lg hidden group-hover:block"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {isLoading && (
                <div className="w-full flex justify-center items-center mt-10 md:max-w-[50%]">
                  <div className="w-20 h-20 border-4 border-t-aqua-blue border-r-aqua-blue border-b-purple border-l-purple rounded-full animate-spin"></div>
                </div>
              )}
              {/* Lesson Content */}
              {lesson && !isLoading && !isEditing && lesson.article && (
                <div className="my-3 md:mt-20 md:max-w-[50%]">
                  <div className="whitespace-pre-line font-light text-sm font-poppins text-black ">
                    {lesson.article.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </div>
                  <div className="flex justify-center items-center mt-6 mb-2 md:my-10">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-purple py-2 px-5 md:px-6 rounded-full text-white text-sm font-poppins font-normal text-center"
                    >
                      Personnaliser cette réponse
                    </button>
                  </div>
                </div>
              )}

              {/* Lesson Editor */}
              {lesson && isEditing && lesson.article && !isLoading && (
                <div className="my-3 md:mt-32 w-full h-screen ">
                  <div className="custom-linear-border w-full rounded-2xl h-[88%]">
                    <div className="rounded-2xl h-[88%] p-3 pt-0">
                      <div className="border-b-2 py-3.5 border-aqua-blue  ">
                        <h2 className="text-purple font-poppins font-medium text-lg text-center">
                          {lesson.title}
                        </h2>
                      </div>
                      <textarea
                        className="w-full h-full rounded-2xl p-3 outline-none text-schemes-secondary font-poppins placeholder-opacity-50"
                        placeholder="Write your article in markdown language here"
                        value={lesson.article}
                        onChange={(e) =>
                          setLesson({ ...lesson, article: e.target.value })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-center items-center mt-6 mb-2 md:my-10">
                    <button
                      onClick={handleSaveLesson}
                      className="bg-purple py-2 w-full md:px-6 rounded-full text-white text-sm font-poppins font-normal text-center"
                    >
                      Save Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </main>
    </div>
  );
}
