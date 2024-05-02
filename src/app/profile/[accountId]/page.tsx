"use client";

import Header from "@/components/header/header";
import Loading from "@/components/loading";
import { CONTRACTID } from "@/lib/config";
import { User } from "@/lib/types";
import { useWalletStore } from "@/stores/wallet";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage({
  params,
}: {
  params: {
    accountId: string;
  };
}) {
  const { accountId } = params;
  const { wallet, signedAccountId } = useWalletStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "experience" | "education" | "certifications"
  >("experience");

  async function getUserData() {
    setIsLoading(true);
    const fetchedUser = await wallet.viewMethod({
      contractId: CONTRACTID,
      method: "get_user_by_id",
      args: { id: accountId },
    });
    setUser(fetchedUser);
    console.log("Fetched User : ", fetchedUser);
    setIsLoading(false);
  }

  // get user data
  useEffect(() => {
    if (!wallet) return;

    getUserData();

    // get user data
  }, [wallet]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <main className="">
        <div className="px-10 py-10 bg-profile-gradient min-h-52">
          <div className="container flex items-center justify-between mx-auto ">
            <div className="">
              <Image
                src={user?.picture || "/avatar.png"}
                alt="avatar"
                width={100}
                height={100}
                className="object-cover bg-transparent p-2 w-32 h-32 rounded-full "
              />
              <h1 className="mt-4 text-xl font-semibold text-center font-poppins text-aqua-blue">
                {user?.name}
              </h1>
              <p className="text-base font-normal text-center text-schemes-secondary font-poppins">
                {user?.account_id}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-start gap-5 py-4 pl-2 pr-10 bg-white justify-normal rounded-xl">
                <div className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="#45A1BE"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 6L12 13L2 6"
                      stroke="#45A1BE"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="text-sm font-normal text-left text-schemes-secondary font-poppins">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.0004 16.9201V19.9201C22.0016 20.1986 21.9445 20.4743 21.8329 20.7294C21.7214 20.9846 21.5577 21.2137 21.3525 21.402C21.1473 21.5902 20.905 21.7336 20.6412 21.8228C20.3773 21.912 20.0978 21.9452 19.8204 21.9201C16.7433 21.5857 13.7874 20.5342 11.1904 18.8501C8.77425 17.3148 6.72576 15.2663 5.19042 12.8501C3.5004 10.2413 2.44866 7.27109 2.12042 4.1801C2.09543 3.90356 2.1283 3.62486 2.21692 3.36172C2.30555 3.09859 2.44799 2.85679 2.63519 2.65172C2.82238 2.44665 3.05023 2.28281 3.30421 2.17062C3.5582 2.05843 3.83276 2.00036 4.11042 2.0001H7.11042C7.59573 1.99532 8.06621 2.16718 8.43418 2.48363C8.80215 2.80008 9.0425 3.23954 9.11042 3.7201C9.23704 4.68016 9.47187 5.62282 9.81042 6.5301C9.94497 6.88802 9.97408 7.27701 9.89433 7.65098C9.81457 8.02494 9.62928 8.36821 9.36042 8.6401L8.09042 9.9101C9.51398 12.4136 11.5869 14.4865 14.0904 15.9101L15.3604 14.6401C15.6323 14.3712 15.9756 14.1859 16.3495 14.1062C16.7235 14.0264 17.1125 14.0556 17.4704 14.1901C18.3777 14.5286 19.3204 14.7635 20.2804 14.8901C20.7662 14.9586 21.2098 15.2033 21.527 15.5776C21.8441 15.9519 22.0126 16.4297 22.0004 16.9201Z"
                      stroke="#45A1BE"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="text-sm font-normal text-left text-schemes-secondary font-poppins">
                    {user?.phone || "+216 23524714"}
                  </span>
                </div>
              </div>
              {signedAccountId === accountId && (
                <button className="flex items-center justify-center w-full gap-2 py-2 rounded-full bg-aqua-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 20H21"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-base font-normal text-center text-white capitalize font-roboto ">
                    Edit your profile info
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-5 ">
          <div className="flex items-center justify-between">
            <div
              onClick={() => setCurrentSection("experience")}
              className={`pb-2 cursor-pointer ${
                currentSection === "experience"
                  ? "border-b-2 border-aqua-blue"
                  : "border-none"
              } `}
            >
              <h3
                className={`uppercase tracking-wide font-poppins font-semibold text-xl  text-left ${
                  currentSection === "experience"
                    ? "text-aqua-blue"
                    : "text-schemes-secondary"
                } `}
              >
                Experience
              </h3>
            </div>
            <div
              onClick={() => setCurrentSection("education")}
              className={`pb-2 cursor-pointer ${
                currentSection === "education"
                  ? "border-b-2 border-aqua-blue"
                  : "border-none"
              } `}
            >
              <h3
                className={`font-poppins uppercase tracking-wide font-semibold text-xl text-left ${
                  currentSection === "education"
                    ? "text-aqua-blue"
                    : "text-schemes-secondary"
                } `}
              >
                Education
              </h3>
            </div>
            <div
              onClick={() => setCurrentSection("certifications")}
              className={`pb-2 cursor-pointer ${
                currentSection === "certifications"
                  ? "border-b-2 border-aqua-blue"
                  : "border-none"
              } `}
            >
              <h3
                className={`font-poppins uppercase tracking-wide font-semibold text-xl text-left ${
                  currentSection === "certifications"
                    ? "text-aqua-blue"
                    : "text-schemes-secondary"
                } `}
              >
                Certifications
              </h3>
            </div>
          </div>
          <div className="mt-5">
            {/* {currentSection === "experience" && (
              <div className="flex flex-col gap-4">
                {user?.skills.map((exp, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 bg-white rounded-xl"
                  >
                    <h3 className="text-lg font-semibold text-schemes-secondary font-poppins">
                      {exp.title}
                    </h3>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {exp.company}
                    </p>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {currentSection === "education" && (
              <div className="flex flex-col gap-4">
                {user?.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 bg-white rounded-xl"
                  >
                    <h3 className="text-lg font-semibold text-schemes-secondary font-poppins">
                      {edu.degree}
                    </h3>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {edu.school}
                    </p>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {currentSection === "certifications" && (
              <div className="flex flex-col gap-4">
                {user?.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 bg-white rounded-xl"
                  >
                    <h3 className="text-lg font-semibold text-schemes-secondary font-poppins">
                      {cert.title}
                    </h3>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {cert.issuer}
                    </p>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {cert.issueDate}
                    </p>
                    <p className="text-base font-normal text-schemes-secondary font-poppins">
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        </div>
      </main>
    </>
  );
}
