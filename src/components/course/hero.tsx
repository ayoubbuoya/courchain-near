import Link from "next/link";
import Search from "../home/search";
import { useCourseStudentStatusStore } from "@/stores/courseStudentStatus";
import { useRouter } from "next/navigation";

export default function Hero({
  handleAddCourseToCart,
}: {
  handleAddCourseToCart: () => void;
}) {
  const router = useRouter();
  const { isCarted, isCompleted, isEnrolled, course } =
    useCourseStudentStatusStore();

  return (
    <section className=" bg-course-hero-gradient text-center min-h-[50vh] w-full overflow-hidden text-xl text-white-900 font-poppins py-6 backdrop-blur-[3.13rem] ">
      <div className="my-8 ">
        <Search />
      </div>
      <div className="mx-auto w-[95%] md:w-[70%] mt-12 ">
        <div className="grid place-items-center overflow-hidden md:grid-cols-4">
          <div className="hidden md:block md:col-span-2">
            <img
              className="object-cover mx-auto md:mx-0 max-w-[60%] md:max-w-full"
              src="/graduates-hat-and-books@2x.png"
              alt=""
            />
          </div>
          <div className="md:col-span-2 rounded-2xl custom-linear-border backdrop-blur-[3.13rem] shadow-open-inscription ">
            <div className="bg-open-inscription-gradient rounded-[0.8rem] h-full w-full p-5">
              <div className="flex flex-col items-center justify-between gap-2 md:gap-10">
                <div className="py-2">
                  <h4 className="text-aqua-blue mb-1 font-capriola md:text-3xl font-normal tracking-[-2%] uppercase text-center ">
                    {"Inscription is open"}
                  </h4>
                  <p className="px-6 text-base font-medium text-center md:text-xl text-schemes-secondary font-poppins ">
                    {
                      "Inscription is open for the next session of the course. Register now to secure your spot."
                    }
                  </p>
                </div>
                <div className="flex flex-col items-center justify-between gap-3 w-[95%] md:w-[85%] ">
                  {isCarted ? (
                    <button
                      onClick={() => router.push("/cart")}
                      className="py-2 bg-aqua-blue w-full rounded-full font-poppins text-white font-normal text-balance text-center "
                    >
                      Already On Your Cart
                    </button>
                  ) : isEnrolled ? (
                    <button
                      onClick={() => router.push(`/learn/course/${course?.id}`)}
                      className="py-2 bg-aqua-blue w-full rounded-full font-poppins text-white font-normal text-balance text-center "
                    >
                      Resume Learning
                    </button>
                  ) : isCompleted ? (
                    <button className="py-2 bg-aqua-blue w-full rounded-full font-poppins text-white font-normal text-balance text-center ">
                      Course Completed
                    </button>
                  ) : (
                    <button
                      onClick={handleAddCourseToCart}
                      className="py-2 bg-aqua-blue w-full rounded-full font-poppins text-white font-normal text-balance text-center "
                    >
                      Add Course To Cart
                    </button>
                  )}
                  <button className="py-2 text-aqua-blue w-full rounded-full font-poppins  font-normal text-balance text-center border-solid border-[1px] border-aqua-blue ">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
