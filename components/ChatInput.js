import React, { useEffect, useState, useRef } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImUpload } from "react-icons/im";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { db, storage } from "../firebase";

function ChatInput({ chat, sessionUser }) {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState("");
  const chooseFileRef = useRef(null);
  const combinedId =
    sessionUser.uid > chat.id
      ? `${sessionUser.uid + chat.id}`
      : `${chat.id + sessionUser.uid}`;
  var CryptoJS = require("crypto-js");

  const acceptedFileType = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/quicktime",
    "video/ogg",
  ];

  const acceptedVideoType = [
    "video/mp4",
    "video/mov",
    "video/avi",
    "video/quicktime",
    "video/ogg",
  ];

  const ShowEmojis = () => {
    if (showEmojis == false) return setShowEmojis(true);
    return setShowEmojis(false);
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage(message + emoji);
  };

  const SendMessage = async (e) => {
    e.preventDefault();

    try {
      const res = await getDoc(doc(db, "Chats", combinedId));

      const encryptedMessage = CryptoJS.TripleDES.encrypt(
        message,
        process.env.NEXT_PUBLIC_DES_KEY
      );

      if (!res.exists()) {
        await addDoc(collection(db, "Messages", combinedId, "Chat"), {
          message: encryptedMessage.toString(),
          user: sessionUser,
          timestamp: serverTimestamp(),
          type: "message",
        });
      }
    } catch (e) {
      console.log(e);
    }
    setMessage("");
  };

  const getFile = (e) => {
    if (e.files[0]) {
      if (e.files[0].size / 1000 ** 2 > 25) {
        return alert("Your chosen file is too large :(");
      }

      const reader = new FileReader();

      if (e.files[0] && acceptedFileType.includes(e.files[0].type)) {
        reader.readAsDataURL(e.files[0]);
      }

      reader.onload = (readerEvent) => {
        sendFile(String(CryptoJS.AES.encrypt(readerEvent.target.result, process.env.NEXT_PUBLIC_CRYPTO_KEY)), e.files[0].type);
      };
    }
  };

  const sendFile = async (file, type) => {
    const docRef = await addDoc(
      collection(db, "Messages", combinedId, "Chat"),
      {
        message: message,
        user: sessionUser,
        timestamp: serverTimestamp(),
      }
    );

    const imageRef = ref(storage, `Chats/${docRef.id}/file`);

    // await uploadString(imageRef, file, "data_url").then(async (snapshot) => {
    await uploadString(imageRef, file).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "Messages", combinedId, "Chat", docRef.id), {
        file: downloadURL,
        type: type,
      });
    });
  };

  return (
    <>
      <div className="relative">
        <form
          className="flex items-center p-4"
          onSubmit={(e) => SendMessage(e)}
        >
          <BsEmojiSmile
            className="h-5 w-5 cursor-pointer"
            onClick={ShowEmojis}
          />
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 border-none focus:ring-0 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ImUpload
            onClick={() => chooseFileRef.current.click()}
            className="h-5 w-5 mr-2 mb-1 cursor-pointer"
          />
          <button
            type="submit"
            className="font-semibold text-blue-500"
            onClick={(e) => SendMessage(e)}
          >
            Send
          </button>
          <input
            ref={chooseFileRef}
            type="file"
            hidden
            onChange={(e) => getFile(e.target)}
          ></input>
        </form>
        {showEmojis && (
          <div className="emojiPlacement">
            <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
          </div>
        )}
      </div>
    </>
  );
}

export default ChatInput;
