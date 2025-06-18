import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/utils/db";
import Doctor from "@/models/Doctor";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider(
        {
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials, req) {
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password")
                }

                try {
                    await connectToDatabase()
                    const user = await Doctor.findOne({email:credentials.email})

                    if(!user){
                        throw new Error("No user found")
                    }

                    const isvalid = await bcrypt.compare(credentials.password,user.password)

                    if(!isvalid){
                        throw new Error("Invalid Credentials")
                    }

                    return {
                        id:user._id.toString(),
                        email:user.email,
                        name:user.fullName
                    }

                } catch (error) {
                    console.error("Auth Error:",error);
                    throw error
                }
            },
        }
    )
  ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    },

    pages:{
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60,
    },
    secret:process.env.NEXTAUTH_SECRET,
};
