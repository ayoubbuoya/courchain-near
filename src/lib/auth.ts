import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import User from "@/models/user";
import connectDB from "./db";
import initAdminBlockchainConnection from "./blockchain";
import { CONTRACTID } from "./config";

export const authConfig: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Authorizing..............");
        // log credentials
        console.log("Credentials : ", credentials);

        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        await connectDB();

        // Check the user in the Mongoose db
        const user = await User.findOne({
          email: credentials.email,
        });

        // if user not found return null
        if (!user) {
          console.log("User not found");
          return null;
        }

        if (!user.password && user.byGoogle) {
          console.log("User Related With a Google Account");
          return null;
        }

        // check if the password is correct
        const passwordMatch = await compare(
          credentials.password,
          user.password as string
        );

        // if password not match return null
        if (!passwordMatch) {
          console.log("Passwords not match");
          return null;
        }

        // get the user from blockchain
        const adminAccount = await initAdminBlockchainConnection();
        const userBlockchainData = await adminAccount.viewFunction({
          contractId: CONTRACTID,
          methodName: "get_user_by_email",
          args: {
            email: credentials.email,
          },
        });
        console.log("User Blockchain Data : ", userBlockchainData);

        return {
          id: userBlockchainData.id,
          email: userBlockchainData.email,
          name: userBlockchainData.name,
          username: userBlockchainData.username,
          image: userBlockchainData.picture,
          picture: userBlockchainData.picture,
          role: userBlockchainData.role,
          byGoogle: userBlockchainData.byGoogle,
          createdAt: userBlockchainData.createdAt,
          updatedAt: userBlockchainData.updatedAt,
          bio: userBlockchainData.bio,
          skills: userBlockchainData.skills,
          certifications: userBlockchainData.certifications,
          education: userBlockchainData.education,
          phone: userBlockchainData.phone,
          isMentor: user.isMentor || false,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, isNewUser, session }) {
      if (trigger === "update") {
        console.log("Trigger Update");
        // token.test = session.test;
        token.isMentor = session.isMentor;
        return token;
      }

      // token.test = "test1";
      // default value

      if (user) {
        token.user_id = user.id;
        token.role = user.role;
        token.byGoogle = user.byGoogle;
        token.username = user.username;
        token.picture = user.picture;
        token.bio = user.bio;
        token.skills = user.skills;
        token.certifications = user.certifications;
        token.education = user.education;
        token.phone = user.phone;
        token.isMentor = user.isMentor;
      }

      return token;
    },
    async session({ session, token, user, newSession, trigger }) {
      // console.log("Token Session : ", token);

      if (token) {
        session.user.id = token.user_id as string;
        session.user.role = token.role as string;
        session.user.byGoogle = token.byGoogle as boolean;
        session.user.username = token.username as string;
        session.user.picture = token.picture as string;
        session.user.bio = token.bio as string;
        session.user.skills = token.skills as string[];
        session.user.certifications = token.certifications as string[];
        session.user.education = token.education as string[];
        session.user.phone = token.phone as string;
        // session.test = token.test as string;
        session.isMentor = token.isMentor as boolean;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // Check if user exists in Mongoose
          const userExists = await User.findOne({
            email: user.email,
          });

          if (!userExists) {
            const createtUser = await User.create({
              email: user.email,
              name: user.name,
              username: user.email?.split("@")[0],
              byGoogle: true,
              picture: user.image,
            });
            user.role = createtUser.role;
            user.byGoogle = createtUser.byGoogle;
            user.username = createtUser.username;
            user.picture = createtUser.picture;
            user.bio = createtUser.bio;
            user.skills = createtUser.skills;
            user.certifications = createtUser.certifications;
            user.education = createtUser.education;
            user.phone = createtUser.phone;
            user.id = createtUser._id as string;
            user.isMentor = false;
          } else {
            // get the user data from blockchain
            const adminAccount = await initAdminBlockchainConnection();
            const userBlockchainData = await adminAccount.viewFunction({
              contractId: CONTRACTID,
              methodName: "get_user_by_email",
              args: {
                email: user.email,
              },
            });
            console.log("User Blockchain Data : ", userBlockchainData);
            user.role = userBlockchainData.role;
            user.id = userBlockchainData.id as string;
            user.byGoogle = userBlockchainData.byGoogle;
            user.username = userBlockchainData.username;
            user.picture = userBlockchainData.picture;
            user.bio = userBlockchainData.bio;
            user.skills = userBlockchainData.skills;
            user.certifications = userBlockchainData.certifications;
            user.education = userBlockchainData.education;
            user.phone = userBlockchainData.phone;
            user.isMentor = false;
          }
        } catch (e) {
          console.error(e);
          return false;
        }
      }

      return true;
    },
  },
};
