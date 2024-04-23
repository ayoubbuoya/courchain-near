import Image from "next/image";
import RegisterForm from "../../components/register/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import GoogleAuthButton from "@/components/googleAuthButton";
import RegisterMain from "@/components/register/registerMain";
import { authConfig } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authConfig);

  if (session && session.user.role !== "waiting") {
    redirect("/dashboard");
  }

  return (
    <>
      <Header />
      <RegisterMain session={session} />
      <Footer />
    </>
  );
}
