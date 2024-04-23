import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function RegisterDetails({ email }: { email: string }) {
  return (
    <div className="py-5 md:py-0">
      <h1 className="font-poppins font-semibold md:text-[1.568rem] md:leading-[2.38rem] text-lg text-aqua-blue">
        Une étape pour créer votre compte
      </h1>
      <p className="text-sm md:text-base font-normal text-dimgray-200 font-poppins md:py-2 md:pb-8 ">
        {"Commençons une aventure d’apprentissage"}
      </p>

      <RegisterForm email={email} />
      <div className="flex items-center justify-center pt-2">
        <div className="flex items-center justify-start gap-1 text-center text-xs text-dimgray-200 font-normal font-poppins">
          <span>{"Vous avez déjà un compte ?"}</span>
          <Link
            href={"/login"}
            className="text-xs font-normal underline decoration-aqua-blue decoration-1 text-aqua-blue "
          >
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
