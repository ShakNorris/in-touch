import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";

const bcrypt = require('bcryptjs');
let provider = '';

const signinUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Please enter password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password Incorrect.");
  }
  return user;
};


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials, req) {
        connectMongo().catch((error) => {
          error: "Connection Failed...!";
        });

        const email = credentials.email;
        const password = credentials.password;
        const user = await Users.findOne({ email });
        if (!user) {
          throw new Error("You haven't registered yet");
        }

        if (user) {
          return signinUser({ password, user });
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account.provider === "google") {
        provider = 'google';
      }
      if (account.provider === 'credentials'){
        provider = 'credentials';
      }
      return true;
    },
    async jwt({ user, token }) {
      if (user !== undefined) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // if(provider === 'google'){
      //   session.user.username = session.user.name
      //   .split(" ")
      //   .join("")
      //   .toLocaleLowerCase();
      //   session.user.provider= 'google'
      // }
      if(provider === 'credentials'){
        session.user.name = token.user.firstname + ' ' + token.user.lastname;
        session.user.username = token.user.username;
        session.user.image = `http://gravatar.com/avatar/?d=mp`;
        session.user.provider = 'credentials'
      }
      else{
        session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();
        session.user.provider = 'other';
      }
      
      session.user.uid = token.sub;
      session.user.accessToken = token.accessToken;
      
      return session;
    },
  },
};

export default NextAuth(authOptions);
