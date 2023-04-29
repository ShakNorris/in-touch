import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function ChatContent({ message, user, file, type, timestamp, search }) {
  const [opened, { open, close }] = useDisclosure(false);
  const videoTypes = ["video/mp4", "video/mov", "video/avi"];
  const [decryptedFile, setDecryptedFile] = useState("");
  var CryptoJS = require("crypto-js");

  message = CryptoJS.TripleDES.decrypt(
    message,
    process.env.NEXT_PUBLIC_DES_KEY
  ).toString(CryptoJS.enc.Latin1);

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

  const FilterMessages = () => {
    if (type == "message") {
      let filteredMessages;
      if (message?.toLowerCase().includes(search.toLowerCase())) {
        filteredMessages = message;
      }
      return filteredMessages;
    }
  };

  let searchedMessage = FilterMessages();

  return (
    <>
      {search ? (
        <>
          {searchedMessage && type == "message" ? (
            <>
              <div className="ml-3 flex items-center mt-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.image}
                  alt={user.username.slice(0, 2)}
                />

                <div className="flex-1 ml-3">
                  <div className="flex text-sm">
                    <p className="text-gray-900">{user.username}</p>
                    <Moment class="text-gray-500 ml-2" fromNow>
                      {timestamp?.toDate()}
                    </Moment>
                  </div>

                  <h3 className="text-md">{searchedMessage}</h3>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div className="ml-3 flex items-center mt-3">
            <img
              className="w-8 h-8 rounded-full"
              src={user.image}
              alt={user.username.slice(0, 2)}
            />

            <div className="flex-1 ml-3">
              <div className="flex text-sm">
                <p className="text-gray-900">{user.username}</p>
                <Moment class="text-gray-500 ml-2" fromNow>
                  {timestamp?.toDate()}
                </Moment>
              </div>

              <h3 className="text-md">{message}</h3>

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
          <Modal
            opened={opened}
            onClose={close}
            withCloseButton={false}
            centered
          >
            {videoTypes.includes(type) ? (
              <>
                <video src={decryptedFile} controls />
              </>
            ) : (
              <img src={decryptedFile} />
            )}
          </Modal>
        </>
      )}
    </>
  );
}

export default ChatContent;
