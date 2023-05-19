import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";

function LikeModal({ opened, close, likes }) {
  const [users, setUsers] = useState([]);
  const likesMap = likes?.map((likes) => likes.data());
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const docs = querySnapshot.docs.map((doc) => doc.data());
      setUsers(docs);
    };

    getUsers();
  }, []);

  const likeList = likesMap.map((like) => {
    let userItem = users?.find((user) => user.id === like.id);

    like.profileImg = userItem?.profileImg;
    like.email = userItem?.email;

    return like;
  });

  return (
    <Modal centered opened={opened} onClose={close} size="md">
      <>
        <h1 className="flex items-center justify-center text-lg mb-2 font-sans">
          Likes
        </h1>
        {likeList?.map((followers) => (
          <div
            onClick={() => {
              router.push(`/${followers.username}`);
              setOpen(false);
            }}
            key={followers.id}
            className="flex justify-between cursor-pointer hover:bg-gray-100 mt-1"
          >
            <img
              className="ml-2 w-10 h-10 rounded-full"
              src={followers.profileImg}
            />
            <div className="flex-1 ml-4">
              <h2 className="font-semibold text-sm">{followers.username}</h2>
              <h3 className="text-xs text-gray-400">{followers.email}</h3>
            </div>
          </div>
        ))}
      </>
    </Modal>
  );
}

export default LikeModal;
