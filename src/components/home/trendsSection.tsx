import Link from "next/link";

export default function TrendsSection() {
  return (
    <section className="my-8 sm:py-5">
      <div className="custom-linear-border rounded-2xl w-[95%] container mx-auto ">
        <div className="grid px-4 py-6 md:p-20 sm:grid-cols-2 gap-x-12 ">
          <div className="flex flex-col items-center justify-between gap-3 lg:gap-5 md:items-start ">
            <h1 className="text-lg font-normal md:w-[70%] text-center uppercase md:text-left font-capriola lg:text-3xl text-aqua-blue">
              Découvrez les Dernières Tendances en IA et Blockchain !
            </h1>
            <p className="text-sm font-medium text-darkslategray-550 md:text-base lg:text-lg xl:text-xl font-poppins">
              {`Explorez les dernières tendances en Intelligence Artificielle et
            Blockchain avec nos cours exclusifs. Soyez prêt à relever les défis
            du futur en apprenant les concepts les plus récents et les
            innovations qui façonnent l'industrie.`}
            </p>
            <Link
              href={"/courses?specialite=AI&theme=Web2"}
              className="w-[98%] cursor-pointer text-center py-2 sm:py-3 font-roboto font-normal text-base text-white bg-aqua-blue rounded-full"
            >
              Explorez maintenant
            </Link>
          </div>
          <div className="hidden sm:justify-center sm:flex">
            <img
              className=" object-cover max-w-full lg:max-w-[80%] "
              src="/teenager-girl-holding-megaphone@2x.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
