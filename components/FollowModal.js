import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { followModalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";

function FollowModal({ check, followers, following }) {
  const [open, setOpen] = useRecoilState(followModalState);
  const [users, setUsers] = useState([]);
  const followersMap = followers?.map((followers) => followers.data());
  const followingMap = following?.map((following) => following.data());
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const docs = querySnapshot.docs.map((doc) => doc.data());
      setUsers(docs);
    };

    getUsers();
  }, []);

  const followingList = followingMap.map((following) => {
    let userItem = users?.find((user) => user.id === following.id);

    following.profileImg = userItem?.profileImg;
    following.email = userItem?.email;

    return following;
  });

  const followersList = followersMap.map((followers) => {
    let userItem = users?.find((user) => user.id === followers.id);

    followers.profileImg = userItem?.profileImg;
    followers.email = userItem?.email;

    return followers;
  });

  return (
    <Modal opened={open} onClose={setOpen} withCloseButton={false} size="md">
      {check ? (
        <>
          <h1 className="flex items-center justify-center text-lg mb-2 font-sans">
            Followers
          </h1>
          {followersList?.map((followers) => (
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
      ) : (
        <>
          <h1 className="flex items-center justify-center text-lg mb-2 font-sans">
            Following
          </h1>
          {followingList?.map((following) => (
            <div
              onClick={() => {
                router.push(`/${following.username}`);
                setOpen(false);
              }}
              key={following.id}
              className="flex justify-between cursor-pointer hover:bg-gray-100 mt-1"
            >
              <img
                className="ml-2 w-10 h-10 rounded-full"
                src={following.profileImg}
              />
              <div className="flex-1 ml-4">
                <h2 className="font-semibold text-sm">{following.username}</h2>
                <h3 className="text-xs text-gray-400">{following.email}</h3>
              </div>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
}

export default FollowModal;
