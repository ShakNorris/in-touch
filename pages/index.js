import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import UploadModal from "../components/UploadModal";
import SearchModal from "../components/SearchModal";
import { useSession, getSession } from "next-auth/react";
import {
  addDoc,
  setDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import PostModal from "../components/PostModal";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <Feed />

      <UploadModal />
      <SearchModal />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if(session){
    const user = await getDoc(doc(db, "Users", session?.user?.uid));

    if (!user?.exists()) {
      await setDoc(doc(db, "Users", session?.user.uid), {
        email: session?.user.email,
        profileImg: session?.user.image,
        name: session?.user.name,
        username: session?.user.username,
        provider: session?.user.provider,
        id: session?.user.uid,
      });
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
      },
    };
  }

  return {
    props: { session },
  };
}
