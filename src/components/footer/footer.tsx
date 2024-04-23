"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:grid grid-cols-5 p-4 gap-x-12 gap-y-4">
      <div className="col-span-2">
        <h4 className="text-2xl font-semibold text-gray-800 font-poppins">
          Couriai
        </h4>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 font-inter">
          Liens Rapides
        </h3>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 font-inter">
          Ressources
        </h3>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 font-inter">
          Conditions
        </h3>
      </div>
      <div className="col-span-2 row-span-4">
        <p className="text-lg font-normal text-gray-800 font-poppins ">
          {`Votre passerelle vers l'avenir de l'apprentissage technologique. Nous
          offrons des cours spécialisés en Intelligence Artificielle et
          Blockchain, conçus pour inspirer la curiosité, stimuler la créativité
          et favoriser l'innovation. Avec des instructeurs experts de
          l'industrie, des projets pratiques captivants et des certifications de
          renommée, nous vous invitons à explorer un monde d'opportunités.`}
        </p>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Acceuil
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/faq"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          FAQ
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          {"Droits d'auteur"}
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/courses"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Cours
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          {"Guide d’utilisation"}
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Politique
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          A propos
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Confidentialité
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Button
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/contact"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Contact
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Payement
        </Link>
      </div>
      <div className="flex items-center justify-start gap-3">
        <img className="w-[1.5rem]" src="/right-arrow.png" alt="" />
        <Link
          href={"/"}
          className="text-base font-bold text-gray-800 cursor-pointer font-inter"
        >
          Button
        </Link>
      </div>
      <div className="col-span-5">
        <hr className="border-2 border-aqua-blue" />
      </div>
      <div className="col-span-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-8 ">
            <Link href={"/"} className="flex items-center justify-start gap-2 ">
              <img className="w-8 h-8" src="/fileiconsbrainfuck.svg" alt="" />
              <div className="font-aladin  lg:text-2xl xl:text-3xl 2xl:text-4xl fhd:text-5xl">
                <p className="flex gap-1 ">
                  <span className="text-aqua-blue">Couri</span>
                  <span className="text-purple">ai</span>
                </p>
              </div>
            </Link>
            <p className="text-xl font-medium tracking-wide text-gray-400 font-poppins ">
              © 2024 Courai, tout les droits sont réservés.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-5 py-2 font-bold text-white rounded-full font-inter bg-aqua-blue"
          >
            Retour en haut
          </button>
        </div>
      </div>
    </footer>
  );
}
