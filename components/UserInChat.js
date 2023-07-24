import React, { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

function UserInChat({ sessionUser, user, selectChat }) {
  const [lastMessage, setLastMessage] = useState("");
  var CryptoJS = require("crypto-js");

  useEffect(() => {
    const combinedId =
      sessionUser.uid > user.id
        ? `${sessionUser.uid + user.id}`
        : `${user.id + sessionUser.uid}`;

    let unsub = onSnapshot(
      doc(db, "Messages", combinedId, "LastMsg", combinedId),
      (doc) => {
        setLastMessage(doc.data());
      }
    );
    return () => unsub();
  }, []);

  return (
    <div
      key={user.id}
      onClick={() => selectChat(user)}
      className="relative flex items-center p-3 cursor-pointer hover:bg-gray-100"
    >
      <div className="">
        <img className="w-[50px] h-[50px] rounded-full" src={user.profileImg} />
      </div>
      <div className="ml-2">
        <h2 className="font-semibold text-md ">{user.username}</h2>
        {lastMessage && (
          <p className="block truncate text-gray-500">
            <span>
              {lastMessage.user.uid === sessionUser.uid ? "Me: " : null}
            </span>
            {CryptoJS.TripleDES.decrypt(
              lastMessage.message,
              process.env.NEXT_PUBLIC_DES_KEY
            ).toString(CryptoJS.enc.Utf8)}
          </p>
        )}
      </div>
      {lastMessage?.user?.uid !== sessionUser.uid && lastMessage?.unread && (
        <div class="absolute inline-flex items-center justify-center w-7 h-7 text-[10px] font-bold text-white bg-blue-500 border-2 border-white rounded-full top-2 right-2 dark:border-gray-900">
          New
        </div>
      )}
    </div>
  );
}

export default UserInChat;
