import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { db } from "../firebase";

function ChatContent({ message, user, file, type, timestamp }) {
  const [opened, { open, close }] = useDisclosure(false);
  const videoTypes = ["video/mp4", "video/mov", "video/avi"];
  const [decryptedFile, setDecryptedFile] = useState("");

  var CryptoJS = require("crypto-js");

  useEffect(() => {
    const DecryptFile = async () => {
      await fetch(file)
        .then((r) => r.text())
        .then((t) =>
          setDecryptedFile(
            CryptoJS.AES.decrypt(
              t,
              process.env.NEXT_PUBLIC_CRYPTO_KEY
            ).toString(CryptoJS.enc.Latin1)
          )
        );
    };
    DecryptFile();
  }, [decryptedFile]); //test this

  return (
    <>
      <div className="ml-3 flex items-center mt-3">
        <img
          className="w-8 h-8 rounded-full"
          src={user.image}
          alt="pfp"
        />

        <div className="flex-1 ml-3">
          <div className="flex text-sm">
            <p className="text-gray-900">{user.username}</p>
            <Moment class="text-gray-500 ml-2" fromNow>
              {timestamp?.toDate()}
            </Moment>
          </div>

          <h3 className="text-md">
            {CryptoJS.TripleDES.decrypt(
              message,
              process.env.NEXT_PUBLIC_DES_KEY
            ).toString(CryptoJS.enc.Latin1)}
          </h3>

          {file &&
            (videoTypes.includes(type) ? (
              <>
                <video src={decryptedFile} className="w-[250px]" controls />
              </>
            ) : (
              <img
                onClick={open}
                className="w-[250px] h-[250px]"
                src={decryptedFile}
              />
            ))}
        </div>
      </div>

      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        {videoTypes.includes(type) ? (
          <>
            <video src={decryptedFile} controls />
          </>
        ) : (
          <img src={decryptedFile} />
        )}
      </Modal>
    </>
  );
}

export default ChatContent;
