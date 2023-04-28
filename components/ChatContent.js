import React from "react";
import Moment from "react-moment";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function ChatContent({ messages }) {
  const [opened, { open, close }] = useDisclosure(false);
  const videoTypes = ["video/mp4", "video/mov", "video/avi"];


  return (
    <div className="h-[540px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-hide">
      {messages.map((message) => (
        <>
          <div className="ml-3 flex items-center mt-3">
            <img
              className="w-8 h-8 rounded-full"
              src={message.user.image}
              alt="pfp"
            />

            <div className="flex-1 ml-3">
              <div className="flex text-sm">
                <p className="text-gray-900">{message.user.username}</p>
                <Moment class="text-gray-500 ml-2" fromNow>
                  {message.timestamp?.toDate()}
                </Moment>
              </div>

              <h3 className="text-md">{message.message}</h3>
              {message?.file &&
                (videoTypes.includes(message.type) ? (
                  <>
                    <video src={message.file} className="w-[250px]" controls />
                  </>
                ) : (
                  <img
                    onClick={open}
                    className="w-[250px] h-[250px]"
                    src={message.file}
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
            {videoTypes.includes(message.type) ? (
              <>
                <video src={message.file} controls />
              </>
            ) : (
              <img
                src={message.file}
              />
            )}
          </Modal>
        </>
      ))}
    </div>
  );
}

export default ChatContent;
