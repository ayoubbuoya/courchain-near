"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CourseMinCard from "../home/courseMinCard";
import { Course } from "@/lib/types";

export default function CoursesSection({
  courses,
}: {
  courses: Course[] | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;
  const perPage = 6;
  const totalPages = Math.ceil((courses?.length ?? 0) / perPage);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const coursesToDisplay = courses?.slice(start, end);
  console.log(courses?.length);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}#courses`);
  };

  return (
    <section id="courses" className="text-left w-[90%] mx-auto">
      <div className="w-[98%] mx-auto my-2 ">
        <h1 className="text-xl md:text-[2.5rem] md:leading-10 font-normal uppercase text-aqua-blue font-capriola mt-8 ">
          Trouvez les certifications bon pour vous
        </h1>

        <button className="flex items-center gap-2 px-4 py-2 mt-3 md:mt-6 mb-8 text-lg font-normal tracking-wide bg-white border-[1px] rounded-full text-aqua-blue border-aqua-blue font-roboto ">
          <img src="/iconparkoutlinedown.svg" alt="" />
          Filtrer par
        </button>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-4">
          {coursesToDisplay &&
            coursesToDisplay.map((course, index) => (
              <CourseMinCard
                key={index}
                title={course.title}
                price={15}
                link={"/course/" + course.id}
              />
            ))}
        </div>
        <div className="flex items-center justify-center my-12">
          <div className="flex items-center px-2 ">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-1 border-[1px] border-aqua-blue"
              >
                <img
                  className="h-8"
                  src="/left-arrow--24--outline.svg"
                  alt=""
                />
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  backgroundColor: i + 1 === currentPage ? "#a4e1f5" : "",
                }}
                className="font-poppins font-medium text-base text-dimgray-400 px-5 py-2  border-[1px] border-l-0 border-aqua-blue"
              >
                {i + 1}
              </button>
            ))}
            {currentPage !== totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-1 border-[1px] border-l-0 border-aqua-blue"
              >
                <img
                  className="h-8"
                  src="/left-arrow--24--outline@2x.png"
                  alt=""
                />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="md:my-20 mx-auto w-[98%] md:w-[85%]">
        <h1 className="text-xl md:text-[2.5rem] md:leading-10 font-normal uppercase text-aqua-blue font-capriola my-8 ">
          PARCOURIR PAR niveau de PROGRAMME
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 w-[90%] md:min-h-[20rem] mx-auto md:my-16">
          <div className="custom-linear-border rounded-2xl backdrop-blur-[3.13rem] shadow-custom-purple flex items-center justify-center text-center ">
            <div className="flex flex-col justify-around py-10">
              <h4 className="text-xl font-medium text-black font-poppins ">
                Niveau Basic
              </h4>
              <p className="mt-4 text-xl font-medium text-gray-500 mb-9 font-poppins ">
                Certification
              </p>

              <button className="px-6 py-3 text-sm font-normal text-white rounded-full hover:bg-slate-600 mt-7 font-poppins bg-aqua-blue">
                Voir les cours inclus
              </button>
            </div>
          </div>
          <div className="custom-linear-border rounded-2xl shadow-custom-purple flex items-center justify-center text-center backdrop-blur-[3.13rem]">
            <div className="flex flex-col justify-around py-10">
              <h4 className="text-xl font-medium text-black font-poppins ">
                Niveau Débutant
              </h4>
              <p className="mt-4 text-xl font-medium text-gray-500 mb-9 font-poppins ">
                Certification
              </p>

              <button className="px-6 py-3 text-sm font-normal text-white rounded-full hover:bg-slate-600 mt-7 font-poppins bg-aqua-blue">
                Voir les cours inclus
              </button>
            </div>
          </div>
          <div className="custom-linear-border rounded-2xl shadow-custom-purple flex items-center justify-center text-center backdrop-blur-[3.13rem] ">
            <div className="flex flex-col justify-around py-10">
              <h4 className="text-xl font-medium text-black font-poppins ">
                Niveau Expert
              </h4>
              <p className="mt-4 text-xl font-medium text-gray-500 mb-9 font-poppins ">
                Certification
              </p>

              <button className="px-6 py-3 text-sm font-normal text-white rounded-full hover:bg-slate-600 mt-7 font-poppins bg-aqua-blue">
                Voir les cours inclus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:my-24 mx-auto w-[98%] md:w-[85%]">
        <h1 className="text-xl md:text-[2.5rem] md:leading-10 font-normal uppercase text-aqua-blue font-capriola my-8 ">
          PARCOURIR PAR catégorie
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 w-[90%] md:min-h-[20rem] mx-auto md:my-16">
          <div className="custom-linear-border rounded-2xl backdrop-blur-[3.13rem] shadow-custom-purple flex items-center justify-center text-center ">
            <div className="flex flex-col justify-around py-10">
              <h4 className="text-xl font-medium text-black font-poppins ">
                IA
              </h4>
              <p className="mt-4 text-xl font-medium text-gray-500 mb-9 font-poppins ">
                Certification
              </p>

              <button className="px-6 py-3 text-sm font-normal text-white rounded-full hover:bg-slate-600 mt-7 font-poppins bg-aqua-blue">
                Voir les cours inclus
              </button>
            </div>
          </div>
          <div className="custom-linear-border rounded-2xl backdrop-blur-[3.13rem] shadow-custom-purple flex items-center justify-center text-center ">
            <div className="flex flex-col justify-around py-10">
              <h4 className="text-xl font-medium text-black font-poppins ">
                Blockchain
              </h4>
              <p className="mt-4 text-xl font-medium text-gray-500 mb-9 font-poppins ">
                Certification
              </p>

              <button className="px-6 py-3 text-sm font-normal text-white rounded-full hover:bg-slate-600 mt-7 font-poppins bg-aqua-blue">
                Voir les cours inclus
              </button>
            </div>
          </div>
          <div className="custom-linear-border rounded-2xl backdrop-blur-[3.13rem] shadow-custom-purple flex items-center justify-center text-center ">
            <div className="flex flex-col justify-around py-10">
              <h4 className="text-xl font-medium text-black font-poppins ">
                IA & BLOCKCHAIN
              </h4>
              <p className="mt-4 text-xl font-medium text-gray-500 mb-9 font-poppins ">
                Certification
              </p>

              <button className="px-6 py-3 text-sm font-normal text-white rounded-full hover:bg-slate-600 mt-7 font-poppins bg-aqua-blue">
                Voir les cours inclus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-[98%] md:w-[85%]">
        <h1 className="text-xl md:text-[2.5rem] md:leading-10 font-normal uppercase text-purple font-capriola my-8 ">
          Voir ce que pensent les internautes / ux
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 w-[90%] mx-auto md:my-16">
          <div className="custom-linear-border rounded-2xl text-center">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img className="w-12 h-12" src="/alvin-limjpeg@2x.png" alt="" />
                <div className="flex flex-col text-sm font-normal text-left font-roboto ">
                  <span className="text-dimgray-800 ">Student A</span>
                  <span className="text-dimgray-100 ">Niveau</span>
                </div>
              </div>
              <div className="flex justify-between ">
                <img className="h-5 w-5" src="/quotesvg.svg" alt="" />
                <p className="mt-3 px-2 text-sm font-normal tracking-wider text-darkslategray-100 font-poppins">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor
                </p>
              </div>

              <div className="w-[90%] mx-auto mt-8 ">
                <button className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-normal text-white  rounded-full hover:bg-slate-600 font-poppins bg-purple w-full">
                  <span>Voir le cours suivi</span>
                  <img className="h-5" src="/24px--plus@2x.png" alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="custom-linear-border rounded-2xl text-center">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img className="w-12 h-12" src="/alvin-limjpeg@2x.png" alt="" />
                <div className="flex flex-col text-sm font-normal text-left font-roboto ">
                  <span className="text-dimgray-800 ">Student A</span>
                  <span className="text-dimgray-100 ">Niveau</span>
                </div>
              </div>
              <div className="flex justify-between ">
                <img className="h-5 w-5" src="/quotesvg.svg" alt="" />
                <p className="mt-3 px-2 text-sm font-normal tracking-wider text-darkslategray-100 font-poppins">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor
                </p>
              </div>

              <div className="w-[90%] mx-auto mt-8 ">
                <button className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-normal text-white  rounded-full hover:bg-slate-600 font-poppins bg-purple w-full">
                  <span>Voir le cours suivi</span>
                  <img className="h-5" src="/24px--plus@2x.png" alt="" />
                </button>
              </div>
            </div>
          </div>
          <div className="custom-linear-border rounded-2xl text-center">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img className="w-12 h-12" src="/alvin-limjpeg@2x.png" alt="" />
                <div className="flex flex-col text-sm font-normal text-left font-roboto ">
                  <span className="text-dimgray-800 ">Student A</span>
                  <span className="text-dimgray-100 ">Niveau</span>
                </div>
              </div>
              <div className="flex justify-between ">
                <img className="h-5 w-5" src="/quotesvg.svg" alt="" />
                <p className="mt-3 px-2 text-sm font-normal tracking-wider text-darkslategray-100 font-poppins">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor
                </p>
              </div>

              <div className="w-[90%] mx-auto mt-8 ">
                <button className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-normal text-white  rounded-full hover:bg-slate-600 font-poppins bg-purple w-full">
                  <span>Voir le cours suivi</span>
                  <img className="h-5" src="/24px--plus@2x.png" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
