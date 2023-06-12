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
  getDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import { GrSend } from "react-icons/gr";
import {
  IoCallOutline,
  IoVideocamOutline,
  IoInformationCircleOutline,
  IoSearch,
} from "react-icons/io5";
import { useRouter } from "next/router";
import ChatContent from "../components/ChatContent";
import ChatInput from "../components/ChatInput";
import { Popover, Input } from "@mantine/core";
import UserInChat from "../components/UserInChat";

function chat() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchState, setSearchState] = useState("");
  const { data: session } = useSession();
  const [opened, setOpened] = useState(false);
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

  const selectChat = async (user) => {
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

    const docSnap = await getDoc(doc(db, "Messages", combinedId, "LastMsg", combinedId));
    if (docSnap.data() && docSnap.data().user.uid !== session.user.uid) {
      await updateDoc(doc(db, "Messages", combinedId, "LastMsg", combinedId), { unread: false });
    }
  };

  useEffect(() => {
    const element = document.getElementById("scroll");
    element?.scrollIntoView();
  }, [messages]);

  return (
    <div className="">
      <Head>
        <title>InTouch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <div className="flex justify-center">
        <div className="flex grid-cols-5 w-full h-screen shadow-sm border bg-white">
          <div className="col-span-2 w-[450px]">
            {users?.map((profile) => (
              // <div
              //   key={profile.id}
              //   onClick={() => selectChat(profile)}
              //   className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
              // >
              //   <img
              //     className="w-12 h-12 rounded-full"
              //     src={profile.profileImg}
              //   />
              //   <h2 className="font-semibold text-md ml-2">
              //     {profile.username}
              //   </h2>
              // </div>
              <UserInChat sessionUser={session?.user} user={profile} selectChat={() => selectChat(profile)}/>
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

                  <div className="relative flex items-center">
                    <Popover
                      opened={opened}
                      onChange={setOpened}
                      position="bottom"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <IoSearch
                          onClick={() => setOpened((o) => !o)}
                          className="w-5 h-5 cursor-pointer mr-2"
                        />
                      </Popover.Target>

                      <Popover.Dropdown className="mt-8">
                        <Input
                          placeholder="Search"
                          size="md"
                          onChange={(e) => setSearchState(e.target.value)}
                        />
                      </Popover.Dropdown>
                    </Popover>
                    <IoCallOutline className="w-5 h-5 cursor-pointer mr-2" />
                    <IoVideocamOutline className="w-5 h-5 cursor-pointer mr-2" />
                    <IoInformationCircleOutline className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>

                <div className="h-[530px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-hide">
                  {messages.map((message) => (
                    <ChatContent
                      message={message.message}
                      user={message.user}
                      file={message.file}
                      type={message.type}
                      timestamp={message.timestamp}
                      search={searchState}
                      className="h-fit"
                    />
                  ))}
                  <div id="scroll"></div>
                </div>

                <ChatInput
                  className="fixed bottom-0"
                  chat={chat}
                  sessionUser={session?.user}
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
