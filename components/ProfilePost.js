import React, { useEffect, useState } from "react";
import PostModal from "./PostModal";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";


function ProfilePost({post}) {
    const videoTypes = ["video/mp4", "video/mov", "video/avi"];


  useEffect(() => {
    const DecryptFile = async () => {
      await fetch(post.value.image)
        .then((r) => r.text())
        .then((t) =>
          setDecryptedFile(
            CryptoJS.AES.decrypt(t, process.env.NEXT_PUBLIC_CRYPTO_KEY).toString(CryptoJS.enc.Latin1)
          )
        );
    };
    DecryptFile();
  }, []);

  function getPostData(post) {
    setClickedPost(post);
    console.log(clickedPost);
    open;
  }

  const [clickedPost, setClickedPost] = useState();
  const [decryptedFile, setDecryptedFile] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  var CryptoJS = require("crypto-js");

  return (
    <>
      <div
        key={post.id}
        id={post.id}
        className="navBtn mx-5 my-5 w-[300px] h-[300px] cursor-pointer"
        onClick={open}

      >{videoTypes.includes(post.value.type) ? (
        <>
          {" "}
          <video src={decryptedFile} className="w-[300px] h-[300px] object-cover" />
        </>
      ) : (
        <Image
          onClick={() => {
            getPostData(post);
          }}
          src={decryptedFile}
          width={300}
          height={300}
          className="w-[300px] h-[300px] object-cover"
        />)}
      </div>

      <PostModal
        id={post.id}
        username={post.value.username}
        userImg={post.value.profileImg}
        img={post.value.image}
        caption={post.value.caption}
        timeStamp={post.value.timestamp}
        fileType={post.value.type}
        opened={opened}
        close={close}
      />
    </>
  );
}

export default ProfilePost;
