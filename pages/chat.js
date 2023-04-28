import React, { useEffect, useState } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import UploadModal from "../components/UploadModal";
import SearchModal from "../components/SearchModal";
import { useSession, getSession } from "next-auth/react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { GrSend } from "react-icons/gr";
import {
  IoCallOutline,
  IoVideocamOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { useRouter } from "next/router";
import ChatContent from "../components/ChatContent";
import ChatInput from "../components/ChatInput";

function chat() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    collection(db, "Users");
    const userQuery = query(
      collection(db, "Users"),
      where("id", "not-in", [session.user.uid])
    );
    onSnapshot(userQuery, (snap) => {
      let users = [];
      snap.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
  }, []);

  const selectChat = (user) => {
    setChat(user);

    const combinedId =
      session.user.uid > user.id
        ? `${session.user.uid + user.id}`
        : `${user.id + session.user.uid}`;
    const messageQuery = query(
      collection(db, "Messages", combinedId, "Chat"),
      orderBy("timestamp", "asc")
    );
    onSnapshot(messageQuery, (snap) => {
      let messages = [];
      snap.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
    });
  };

  return (
    <div className="">
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex justify-center">
        <div className="flex mt-3 grid-cols-5 w-[935px] h-[670px] shadow-sm border bg-white">
          <div className="col-span-2 w-[450px]">
            {users?.map((profile) => (
              <div
                key={profile.id}
                onClick={() => selectChat(profile)}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
              >
                <img
                  className="w-12 h-12 rounded-full"
                  src={profile.profileImg}
                />
                <h2 className="font-semibold text-md ml-2">
                  {profile.username}
                </h2>
              </div>
            ))}
          </div>
          <div className="col-span-3 shadow-sm border-l w-full">
            {chat ? (
              <>
                <div className="flex justify-between p-4 shadow-sm border-b bg-white">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push(`/${chat.username}`)}
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src={chat.profileImg}
                    />
                    <h2 className="font-semibold text-sm ml-2">
                      {chat.username}
                    </h2>
                  </div>

                  <div className="flex items-center">
                    <IoCallOutline className="w-5 h-5 cursor-pointer mr-2" />
                    <IoVideocamOutline className="w-5 h-5 cursor-pointer mr-2" />
                    <IoInformationCircleOutline className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>

                <div className="h-[540px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-hide">
                  {messages.map((message) => (
                    <ChatContent
                      message={message.message}
                      user={message.user}
                      file={message.file}
                      type={message.type}
                      timestamp={message.timestamp}
                      className="h-fit"
                    />
                  ))}
                </div>

                <ChatInput
                  className="fixed bottom-0"
                  chat={chat}
                  sessionUser={session.user}
                />
              </>
            ) : (
              <>
                <div className="flex items-center justify-center m-auto text-center h-full">
                  <div>
                    <GrSend className="w-20 h-20 inline" />
                    <h2 className="mt-2 text-2xl">Your Messages</h2>
                    <h3 className="text-lg">
                      Select a user you want to chat with!
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <UploadModal />
      <SearchModal />
    </div>
  );
}

export default chat;

export async function getServerSideProps(context) {
  const session = await getSession(context);

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
