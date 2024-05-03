"use client";

import { useWalletStore } from "@/stores/wallet";
import EditCourseDetails from "@/components/dashboard/mentor/editCourseDetails";
import SplitLayout from "@/components/dashboard/splitLayout";
import Loading from "@/components/loading";
import { CONTRACTID } from "@/lib/config";
import { FullCourse, FullLesson } from "@/lib/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "react-toastify";

export default function MentorCoursePage({
  params,
}: {
  params: {
    courseId: number;
  };
}) {
  const courseId = Number(params.courseId);
  const { data: session } = useSession();
  const { wallet, signedAccountId } = useWalletStore();
  const [course, setCourse] = useState<FullCourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const moduleOrder = Number(searchParams.get("module")) || 1;
  const lessonOrder = Number(searchParams.get("lesson")) || 1;
  const [currentLesson, setCurrentLesson] = useState<FullLesson | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [addContentAction, setAddContentAction] = useState<
    "video" | "article" | "ai" | null
  >(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isAISectionLoading, setIsAISectionLoading] = useState(false);
  const [aiGeneratedContent, setAIGeneratedContent] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  async function fetchCourseDetails() {
    // reset all states
    setIsLoading(true);
    setCourse(null);
    setCurrentLesson(null);

    const fetchedCourseDetails = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_full_course",
      args: {
        course_id: courseId,
      },
    });
    console.log("Course Details: ", fetchedCourseDetails);
    setCourse(fetchedCourseDetails);
    setCurrentLesson(
      fetchedCourseDetails.modules[moduleOrder - 1].lessons[lessonOrder - 1]
    );
    setIsLoading(false);
  }

  useEffect(() => {
    if (!wallet) return;

    if (session && !session.user) {
      router.push("/login");
      return;
    }

    if (session && session.user.role === "user" && !session.isMentor) {
      router.push("/dashboard/student");
      return;
    }

    if (session && session.user.role === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    if (session && !signedAccountId) {
      toast.error("Connect to your NEAR Wallet", {
        autoClose: 1000,
      });
      return;
    }

    if (session && wallet && signedAccountId) {
      fetchCourseDetails();
    }
  }, [wallet, signedAccountId, session]);

  useEffect(() => {
    console.log("Module Order Changed: ", moduleOrder);
    // reset all states
    setIsLoading(true);
    setCurrentLesson(null);
    setAddContentAction(null);
    setUploadedVideo(null);
    setAIGeneratedContent(null);
    setIsEditing(false);

    if (wallet) {
      if (course) {
        setCurrentLesson(
          course.modules[moduleOrder - 1].lessons[lessonOrder - 1]
        );
        setIsLoading(false);
      } else {
        fetchCourseDetails();
      }
    }
  }, [searchParams]);

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

  const handleVideoUpload = async () => {
    videoInputRef.current?.click();
  };

  const handleVideoUploadChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    console.log("Video File : ", file);
    if (!file) {
      console.log("No Video Uploaded");
      return;
    }
    setUploadedVideo(file);
  };

  const handlePlayVideo = () => {
    if (uploadedVideo) {
      const videoUrl = URL.createObjectURL(uploadedVideo);
      window.open(videoUrl, "_blank");
    }
  };

  const handleResetVideo = () => {
    setUploadedVideo(null);
  };

  const handleSaveVideo = async () => {
    const loadingToast = toast.loading("Upload Video To IPFS");

    if (!uploadedVideo) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Video Uploaded",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    }

    if (!currentLesson) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Lesson Selected",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    }

    try {
      const data = new FormData();
      data.set("file", uploadedVideo);
      const response = await fetch("/api/video/upload/ipfs", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        toast.update(loadingToast, {
          type: "error",
          render: "Error Saving Video",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      const { success, message, ipfsResponse } = await response.json();

      if (!success) {
        toast.update(loadingToast, {
          type: "error",
          render: message,
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      const videoUrl: string =
        process.env.NEXT_PUBLIC_GATEWAY_URL + ipfsResponse.IpfsHash;

      console.log("Video URL: ", videoUrl);

      toast.update(loadingToast, {
        type: "success",
        render: "Video Upladed to IPFS Successfully",
        isLoading: false,
        autoClose: 1000,
      });

      const loadingToast2 = toast.loading("Saving Video to Lesson");

      const response2 = await wallet.callMethod({
        contractId: CONTRACTID,
        method: "add_video_to_lesson",
        args: {
          lesson_id: currentLesson.id,
          ipfs_url: videoUrl,
        },
      });

      const res2Success = Boolean(
        Buffer.from(response2.status.SuccessValue, "base64").toString(
          "utf-8"
        ) === "true"
      );

      if (!res2Success) {
        toast.update(loadingToast2, {
          type: "error",
          render: "Error Saving Video",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      toast.update(loadingToast2, {
        type: "success",
        render: "Video Saved Successfully",
        isLoading: false,
        autoClose: 1000,
      });

      // update the course details
      fetchCourseDetails();
    } catch (error) {
      console.error("Error Saving Video: ", error);
      toast.update(loadingToast, {
        type: "error",
        render: "Error Saving Video",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  const handleGenerateAIContent = async () => {
    setAddContentAction("ai");
    setAIGeneratedContent(null);
    setIsAISectionLoading(true);
    const loadingToast = toast.loading("Generating AI Content");

    if (!currentLesson) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Lesson Selected",
        isLoading: false,
        autoClose: 1000,
      });
      setIsAISectionLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AI_SERVER_API}/lesson/no-save/generate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_id: courseId,
            lesson_id: currentLesson.id,
            mentor_id: signedAccountId,
          }),
        }
      );

      if (!response.ok) {
        toast.update(loadingToast, {
          type: "error",
          render: "Error Generating AI Content",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      const { message, content } = await response.json();
      console.log("Message: ", message);
      console.log("Lesson Content: ", content);
      // update the value of currentLesson article using the setCurrentLesson function
      setAIGeneratedContent(content);

      toast.update(loadingToast, {
        type: "success",
        render: message,
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error Generating AI Content: ", error);
      toast.update(loadingToast, {
        type: "error",
        render: "Error Generating AI Content",
        isLoading: false,
        autoClose: 1000,
      });
    } finally {
      setIsAISectionLoading(false);
    }
  };

  const handleSaveAIContent = async () => {
    const loadingToast = toast.loading("Saving AI Content to lesson");

    if (!currentLesson) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Lesson Selected",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    }

    if (!aiGeneratedContent) {
      toast.update(loadingToast, {
        type: "error",
        render: "No AI Content Generated To Save",
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
          lesson_id: currentLesson.id,
          article: aiGeneratedContent,
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
          render: "Error Saving AI Content",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      toast.update(loadingToast, {
        type: "success",
        render: "AI Content Saved Successfully",
        isLoading: false,
        autoClose: 1000,
      });

      // update the course details
      setAddContentAction(null);
      setAIGeneratedContent(null);
      fetchCourseDetails();
    } catch (error) {
      console.error("Error Saving AI Content: ", error);
      toast.update(loadingToast, {
        type: "error",
        render: "Error Saving AI Content",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  const handleEditArticle = async () => {
    const loadingToast = toast.loading("Update lesson article");
    if (!currentLesson) {
      toast.update(loadingToast, {
        type: "error",
        render: "No Lesson To Update",
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
          lesson_id: currentLesson.id,
          article: currentLesson.article,
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
          render: "Error updating lesson article",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      toast.update(loadingToast, {
        type: "success",
        render: "AI Content Saved Successfully",
        isLoading: false,
        autoClose: 1000,
      });

      setCurrentLesson(null);
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

  if (isLoading) return <Loading />;

  return (
    <div className="md:grid md:grid-cols-12">
      <SplitLayout session={session} />

      <main className="w-full min-h-screen py-5 md:px-5 md:col-span-11 md:py-10 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
          <div className="lef-side md:col-span-2">
            {course && (
              <div className="flex items-start justify-between pr-14">
                <h1 className="mb-4 text-2xl font-semibold text-purple">
                  {course?.title}
                </h1>
                <EditCourseDetails course={course} />
              </div>
            )}

            {currentLesson?.video_url ? (
              <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                <video
                  className="w-full h-full"
                  src={currentLesson?.video_url}
                  controls
                />
              </div>
            ) : currentLesson?.article && addContentAction === null ? (
              <div className="w-full xl:max-w-[88%] mx-auto overflow-x-hidden overflow-y-auto h-full ">
                {isEditing ? (
                  <>
                    <div className="custom-linear-border w-full mb-4 mt-5  h-[75%]  rounded-2xl">
                      <div className="p-3 pt-0 h-[88%]  ">
                        <div className="border-b-2 py-3.5 border-aqua-blue  ">
                          <h2 className="text-purple font-poppins font-medium text-lg text-center">
                            {currentLesson?.title}
                          </h2>
                        </div>
                        <textarea
                          className="w-full h-full rounded-2xl p-3 outline-none text-schemes-secondary font-poppins placeholder-opacity-50"
                          placeholder="Write your article in markdown language here"
                          value={currentLesson?.article || ""}
                          onChange={(e) => {
                            setCurrentLesson({
                              ...currentLesson,
                              article: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                    </div>
                    <button
                      onClick={handleEditArticle}
                      className="bg-aqua-blue text-white rounded-full w-full py-3 font-poppins capitalize font-normal text-lg  text-center mt-3 "
                    >
                      Save Article
                    </button>
                  </>
                ) : (
                  <>
                    <Markdown
                      children={currentLesson?.article}
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
                          <pre className="bg-gray-200 p-1">
                            {props.children}
                          </pre>
                        ),
                      }}
                      className={`text-schemes-secondary font-poppins py-2 font-normal text-base`}
                    />
                    <button
                      onClick={() => {
                        setIsEditing(true);
                      }}
                      className="w-full font-poppins font-medium py-2 mt-5 text-white bg-aqua-blue rounded-md"
                    >
                      Edit Article
                    </button>
                  </>
                )}
              </div>
            ) : (
              // choose to upload video or article
              <div className="w-full h-full xl:max-w-[93%] mx-auto   ">
                <p className="text-schemes-secondary font-poppins font-normal text-base">
                  {course?.with_ai
                    ? "You can upload a video or write an article for this lesson or use AI to generate content"
                    : "You can upload a video or write an article for this lesson"}
                </p>
                <div className="w-full flex items-center justify-evenly mt-8">
                  <button
                    onClick={() => setAddContentAction("video")}
                    className={`apitalize  rounded-full px-5 py-3  border-[1px]  border-solid  font-poppins font-normal text-[0.88rem] leading-5 text-center duration-500 ${
                      addContentAction === "video"
                        ? "bg-aqua-blue border-white text-white"
                        : "bg-white text-aqua-blue border-aqua-blue"
                    }`}
                  >
                    Upload Video
                  </button>
                  <button
                    onClick={() => setAddContentAction("article")}
                    className={`capitalize  rounded-full px-5 py-3  border-[1px]  border-solid  font-poppins font-normal text-[0.88rem] leading-5 text-center duration-500 ${
                      addContentAction === "article"
                        ? "bg-aqua-blue border-white text-white"
                        : "bg-white text-aqua-blue border-aqua-blue"
                    }`}
                  >
                    Write a text article
                  </button>
                  {course?.with_ai && (
                    <button
                      onClick={handleGenerateAIContent}
                      className={`capitalize  rounded-full px-5 py-3  border-[1px]  border-solid  font-poppins font-normal text-[0.88rem] leading-5 text-center duration-500 ${
                        addContentAction === "ai"
                          ? "bg-aqua-blue border-white text-white"
                          : "bg-white text-aqua-blue border-aqua-blue"
                      }`}
                    >
                      Use AI to generate content
                    </button>
                  )}
                </div>

                {addContentAction === "video" && (
                  <div className="w-full h-full mt-8">
                    <div className="w-full min-h-[50%] bg-gray-50 flex items-center justify-center rounded-2xl">
                      <input
                        ref={videoInputRef}
                        type="file"
                        className="w-full h-full hidden"
                        accept="video/*"
                        onChange={handleVideoUploadChange}
                      />
                      {!uploadedVideo && (
                        <button
                          onClick={handleVideoUpload}
                          className="bg-aqua-blue text-white rounded-xl px-8 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center"
                        >
                          Upload Video
                        </button>
                      )}

                      {uploadedVideo && (
                        <div className="w-full h-full ">
                          <p className="text-aqua-blue mt-4 text-center font-poppins font-medium text-lg">
                            {uploadedVideo.name}
                          </p>

                          <video
                            className="w-full h-full py-3 outline-none"
                            src={URL.createObjectURL(uploadedVideo)}
                            controls
                          />

                          <div className="w-full flex justify-around items-center py-4 ">
                            <button
                              onClick={handlePlayVideo}
                              className="bg-aqua-blue text-white rounded-xl px-8 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center"
                            >
                              Play Video
                            </button>
                            <button
                              onClick={handleResetVideo}
                              className="bg-aqua-blue text-white rounded-xl px-8 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center"
                            >
                              Reset Video
                            </button>
                            <button
                              onClick={handleVideoUpload}
                              className="bg-aqua-blue text-white rounded-xl px-8 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center"
                            >
                              Change Video
                            </button>
                            <button
                              onClick={handleSaveVideo}
                              className="bg-aqua-blue text-white rounded-xl px-8 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center"
                            >
                              Save Video
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {addContentAction === "ai" && (
                  <div className="w-full mt-8 h-full">
                    {isAISectionLoading ? (
                      <div className="w-full min-h-[60%] max-h-full flex justify-center items-center mt-10 ">
                        <div className="w-20 h-20 border-4 border-t-aqua-blue border-r-aqua-blue border-b-purple border-l-purple rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <>
                        <div className="custom-linear-border w-full min-h-[40%] h-[65%] max-h-[75%] rounded-2xl">
                          <div className="p-3 pt-0 h-[88%]  ">
                            <div className="border-b-2 py-3.5 border-aqua-blue  ">
                              <h2 className="text-purple font-poppins font-medium text-lg text-center">
                                {currentLesson?.title}
                              </h2>
                            </div>
                            <textarea
                              className="w-full h-full rounded-2xl p-3 outline-none text-schemes-secondary font-poppins placeholder-opacity-50"
                              placeholder="Write your article in markdown language here"
                              value={aiGeneratedContent || ""}
                              onChange={(e) => {
                                setAIGeneratedContent(e.target.value);
                              }}
                            ></textarea>
                          </div>
                        </div>
                        <button
                          onClick={handleSaveAIContent}
                          className="bg-aqua-blue text-white rounded-full px-5 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center mt-3"
                        >
                          Save AI Content
                        </button>
                      </>
                    )}
                  </div>
                )}

                {addContentAction === "article" && (
                  <div className="w-full mt-8 h-full">
                    <div className="custom-linear-border w-full min-h-[40%] h-[65%] max-h-[75%] rounded-2xl">
                      <div className="p-3 pt-0 h-[88%]  ">
                        <div className="border-b-2 py-3.5 border-aqua-blue  ">
                          <h2 className="text-purple font-poppins font-medium text-lg text-center">
                            {currentLesson?.title}
                          </h2>
                        </div>
                        <textarea
                          className="w-full h-full rounded-2xl p-3 outline-none text-schemes-secondary font-poppins placeholder-opacity-50"
                          placeholder="Write your article in markdown language here"
                        ></textarea>
                      </div>
                    </div>
                    <button
                      onClick={() => {}}
                      className="bg-aqua-blue text-white rounded-full px-5 py-3 font-poppins font-normal text-[0.88rem] leading-5 text-center mt-3"
                    >
                      Save Content
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="right-side pr-5">
            <div className="flex flex-col items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold text-purple">
                Course Content
              </h1>
              {course?.modules.map((module) => (
                <div
                  key={module.id}
                  className="w-full custom-linear-border rounded-2xl"
                >
                  <div className="flex items-center space-x-4 p-3 rounded-2xl overflow-hidden w-full">
                    <div className="w-full overflow-hidden">
                      <div className="w-full overflow-hidden">
                        <div className="w-full overflow-hidden flex items-center justify-between">
                          <h2 className="text-lg font-semibold truncate text-aqua-blue">
                            {module.title}
                          </h2>
                          <button
                            onClick={() =>
                              handleModuleOrderChange(module.order)
                            }
                            className="text-sm font-semibold text-aqua-blue"
                          >
                            <Image
                              width={20}
                              height={20}
                              className={`w-4 h-4 duration-1000 ${
                                module.order === moduleOrder
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
                      {module.order === moduleOrder && (
                        <div className="w-full flex flex-col justify-between items-start gap-3 pl-5 py-4">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="w-full cursor-pointer flex justify-between items-baseline"
                              onClick={() => {
                                handleLessonOrderChange(lesson.order);
                              }}
                            >
                              <h2
                                className={`text-lg ${
                                  lesson.order === lessonOrder
                                    ? "text-aqua-blue font-semibold"
                                    : "text-dimgray-700 font-medium "
                                }`}
                              >
                                {lesson.title}
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
