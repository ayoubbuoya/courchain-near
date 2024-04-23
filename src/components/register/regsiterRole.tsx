import { getUserRole, updateUserRole } from "@/utils/userRole";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterRole() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const handleStudentClick = async () => {
    const loadingToast = toast.loading("Changement de rôle en cours...");
    await update({
      ...session,
      user: {
        ...session?.user,
        role: "student",
      },
    });

    const response = await fetch("/api/user/role", {
      method: "PUT",
      body: JSON.stringify({
        userId: session?.user.id,
        role: "student",
      }),
    });

    if (response.ok) {
      toast.update(loadingToast, {
        render: "Rôle changé avec succès",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        transition: Bounce,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2100);
    } else {
      toast.update(loadingToast, {
        render: "Erreur lors du changement de rôle",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        transition: Bounce,
      });
      console.error("Error: ", response);
    }
  };

  const handleMentorClick = async () => {
    const loadingToast = toast.loading("Changement de rôle en cours...");
    await update({
      ...session,
      user: {
        ...session?.user,
        role: "mentor",
      },
    });

    const response = await fetch("/api/user/role", {
      method: "PUT",
      body: JSON.stringify({
        userId: session?.user.id,
        role: "mentor",
      }),
    });

    if (response.ok) {
      toast.update(loadingToast, {
        render: "Rôle changé avec succès",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        transition: Bounce,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2100);
    } else {
      toast.update(loadingToast, {
        render: "Erreur lors du changement de rôle",
        type: "error",
        isLoading: false,
        autoClose: 2000,
        transition: Bounce,
      });
      console.error("Error: ", response);
    }
  };

  return (
    <>
      <h1 className="font-poppins font-semibold text-[1.568rem] mt-8 text-aqua-blue">
        Ravie de vous recevoir parmis nous
      </h1>
      <p className="text-base font-normal text-dimgray-200 font-poppins py-2">
        {"Créez un compte et profitez d’"}
        <span className="font-semibold">un mois gratuit.</span>
      </p>

        <h3 className="text-aqua-blue font-poppins font-medium text-[1.568rem] py-10 ">
          {"Je veux m’inscrire en tant que :"}
        </h3>

      <div className="text-base font-normal font-poppins flex flex-col items-center gap-4 ">
        <button
          // to="/register?step=2&role=student"
          onClick={
            session?.user.role === "waiting" ? handleStudentClick : () => {}
          }
          className="text-white bg-aqua-blue py-2 w-[60%] rounded-full "
        >
          Etudiant
        </button>
        <button
          onClick={
            session?.user.role === "waiting" ? handleMentorClick : () => {}
          }
          // to="/register?step=2&role=teacher"
          className="text-white bg-aqua-blue py-2 w-[60%] rounded-full "
        >
          Mentor
        </button>

        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-1 text-center text-base text-dimgray-200 leading-4 font-normal font-poppins">
            <span>{"Vous avez déjà un compte ?"}</span>
            <Link
              href={"/login"}
              className="text-base font-normal underline decoration-aqua-blue decoration-1 text-aqua-blue "
            >
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
