import Search from "./search";

export default function Hero() {
  return (
    <section
      style={{
        background:
          "linear-gradient(180.00deg, rgb(69, 161, 190),rgba(226, 184, 233, 0) 100%)",
      }}
      className="w-full overflow-hidden text-xl text-left text-white-900 font-poppins"
    >
      <div className="grid my-14 place-items-center">
        <Search />
      </div>
      <div className="flex items-center justify-center mb-6 md:mb-12">
        <div className="flex items-center justify-center px-1 md:px-0 md:w-2/3">
          <h1
            style={{ WebkitTextStroke: "1px #ffffff" }}
            className=" text-lg md:text-[3.2rem] leading-snug uppercase font-capriola font-normal text-center tracking-wide md:tracking-normal"
          >
            {"Explorez l'Intelligence Artificielle et la Blockchain"}
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center px-1 mb-4 md:mb-12 md:px-0">
        <div className="flex items-center justify-center md:w-[53%] ">
          <p className="text-sm font-medium text-center text-white font-poppins xl:text-xl">
            {`Plongez dans le futur de la technologie avec nos cours
              interactifs, conçus pour stimuler votre esprit et nourrir votre passion pour l'IA et
              la blockchain.`}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center w-full mb-8 md:mb-12">
        <a
          href="/courses"
          className="w-[70%] md:w-[30%] py-2 text-center bg-aqua-blue rounded-3xl font-poppins font-normal text-base"
        >
          Découvrez nos Cours
        </a>
      </div>
      <div className="flex items-center justify-center mb-12">
        <img
          className="w-56 md:w-80 object-cover"
          alt=""
          src="/cloud-bitcoin@2x.png"
        />
      </div>
    </section>
  );
}
