import React from 'react'
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import UploadModal from "../components/UploadModal";
import SearchModal from "../components/SearchModal";

function chat() {
  return (
    <div className="">
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Sidebar />

      {/* chatbox 935 x 675 */}

      <UploadModal />
      <SearchModal />
    </div>
  )
}

export default chat