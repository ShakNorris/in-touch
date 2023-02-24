import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'


export default function Home() {
  return (
    <div className="">
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Sidebar />
    </div>
  )
} 