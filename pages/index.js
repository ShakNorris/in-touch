import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'
import { getSession } from 'next-auth/react'


export default function Home() {
  return (
    <div className="">
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Sidebar />
      <Feed />
    </div>
  )
} 

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
      },
    };
  }

  return {
    props: {},
  };
}