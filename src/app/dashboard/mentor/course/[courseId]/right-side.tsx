import { FullCourse, FullLesson, FullModule } from "@/lib/types";
import Image from "next/image";
import { useRef, useState } from "react";

export default function RightSide({
  course,
  lessonOrder,
  moduleOrder,
  handleLessonOrderChange,
  handleModuleOrderChange,
}: {
  course: FullCourse | null;
  lessonOrder: number;
  moduleOrder: number;
  handleLessonOrderChange: (order: number) => void;
  handleModuleOrderChange: (order: number) => void;
}) {
  const [modules, setModules] = useState<FullModule[]>(course?.modules || []);
  const [currentModuleLessons, setCurrentModuleLessons] = useState<
    FullLesson[]
  >(
    course && course.modules && course.modules.length > 0
      ? course?.modules[0].lessons
      : []
  );

  const dragLesson = useRef<number>(0);
  const draggedOverLesson = useRef<number>(0);

  const handleSort = () => {
    const currentModuleLessonsClone = [...currentModuleLessons];
    const temp = currentModuleLessonsClone[dragLesson.current];
    currentModuleLessonsClone[dragLesson.current] =
      currentModuleLessonsClone[draggedOverLesson.current];
    currentModuleLessonsClone[draggedOverLesson.current] = temp;
    setCurrentModuleLessons(currentModuleLessonsClone);
  };

  return (
    <div className="right-side pr-5">
      <div className="flex flex-col items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-purple">Course Content</h1>
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
                      onClick={() => handleModuleOrderChange(module.order)}
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
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        draggable
                        onDragStart={() => {
                          dragLesson.current = index;
                        }}
                        onDragEnter={() => {
                          draggedOverLesson.current = index;
                        }}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
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
  );
}
