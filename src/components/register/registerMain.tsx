"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RegisterEmail from "./registerEmail";
import RegisterRole from "./regsiterRole";
import RegisterDetails from "./registerDetails";
import { Session } from "next-auth";

export default function RegisterMain({ session }: { session: Session | null }) {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step")) || 1;
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen text-center">
      <div
        className={`custom-linear-border shadow-custom-green rounded-xl w-[95%] sm:w-[80%] md:w-[60%] lg:w-[55%] xl:w-[43%] 2xl:w-[42%] mx-auto ${
          step === 2 ? "mt-12 md:mt-[1.3%]" : "mt-16 md:mt-[5%]"
        } 2xl:mt-[6%]`}
      >
        <div className="md:py-12">
          {step === 1 && <RegisterEmail />}
          {step === 2 && <RegisterDetails email={email} />}
          {step === 3 && <RegisterRole />}
        </div>
      </div>
    </main>
  );
}
