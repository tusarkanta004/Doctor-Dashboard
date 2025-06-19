import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import Doctor from "@/models/Doctor";
// import bcrypt from "bcryptjs"; // Not needed if using plain text comparison

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        console.log("🟡 Starting login...");

        if (!credentials?.email || !credentials?.password) {
          console.log("🔴 Missing email or password");
          return null;
        }

        await connectToDatabase();
        console.log("🟢 DB connected");

        const user = await Doctor.findOne({ email: credentials.email });
        console.log("🟡 Fetched user:", user);

        if (!user) {
          console.log("🔴 No user found for:", credentials.email);
          return null;
        }

        // Compare plain text password
        if (credentials.password !== user.password) {
          console.log("🔴 Invalid password");
          return null;
        }

        console.log("✅ Login success for:", user.email);

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
  session.user = {
    ...session.user,
    id: token.id as string,
    email: token.email as string,
    name: token.name as string
  };
  console.log("🔎 Session user:", session.user);
  return session;
}

  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
