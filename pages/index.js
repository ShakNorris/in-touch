import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import UploadModal from '../components/UploadModal'
import { useSession, getSession } from 'next-auth/react';
import {addDoc,setDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {db, storage} from '../firebase';

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
    </div>
  )
} 

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if(session !== null){
    // addDoc(collection(db, 'Users'), {
    //     email: session.user.email,
    //     profileImg: session.user.image,
    //     name: session.user.name,
    //     username: session.user.username,
    //     joinDate: serverTimestamp(),
    // })
    // setDoc(doc(db, 'Users', session.user.uid), {
    //   email: session?.user.email,
    //   profileImg: session?.user.image,
    //   name: session?.user.name,
    //   username: session?.user.username,
    //   provider: session?.user.provider,
    // })
  }

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
      },
    };
  }

  return {
    props: {session},
  };
}