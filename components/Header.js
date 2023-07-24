import React from "react";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  doc,
  query,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { BsCheck } from "react-icons/bs";
import OptionsModal from "../components/OptionsModal";
import { useDisclosure } from "@mantine/hooks";
import FollowModal from "../components/FollowModal";
import { followModalState } from "../atoms/modalAtom";
import { useRecoilState } from "recoil";

function Header({ user, postAmount }) {
  const { data: session } = useSession();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [settingsOpened, { open, close }] = useDisclosure(false);
  const [openFollow, setOpenFollow] = useRecoilState(followModalState);
  const [check, setCheck] = useState(false);

  const FollowUser = async () => {
    if (hasFollowed) {
      return [
        await deleteDoc(
          doc(db, "Users", session?.user.uid, "Following", user.id)
        ),
        await deleteDoc(
          doc(db, "Users", user.id, "Followers", session?.user.uid)
        ),
      ];
    } else {
      return [
        await setDoc(
          doc(db, "Users", session?.user.uid, "Following", user.id),
          {
            username: user.username,
            id: user.id,
          }
        ),
        await setDoc(
          doc(db, "Users", user.id, "Followers", session?.user.uid),
          {
            username: session?.user.username,
            id: session?.user.uid,
          }
        ),
      ];
    }
  };

  useEffect(
    () =>
      setHasFollowed(
        followers.findIndex((follows) => follows.id === session?.user.uid) !==
          -1
      ),
    [followers]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "Users", user.id, "Followers"), (snapshot) =>
        setFollowers(snapshot.docs)
      ),
    [db, user.id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "Users", user.id, "Following"), (snapshot) =>
        setFollowing(snapshot.docs)
      ),
    [db, user.id]
  );

  return (
    <div className="p-5 flex justify-center items-center shadow-sm border-b bg-white">
      <div className="mx-10">
        <img
          className="w-[150px] h-[150px] rounded-full inline cursor-pointer object-cover border p-[2px] border-black"
          src={`${user.profileImg}`}
          alt="profile"
          width={150}
          height={150}
        />
      </div>
      <div className="mx-5 ml-10">
        <div>
          <div className="float-left">
            <h2 className="font-bold text-2xl">{user.username}</h2>
            <h3 className="text-lg text-gray-400">{user.name}</h3>
          </div>

          {session?.user.uid !== user.id && !hasFollowed && (
            <button
              onClick={FollowUser}
              class="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Follow
            </button>
          )}

          {session?.user.uid !== user.id && hasFollowed && (
            <button
              onClick={FollowUser}
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              <div className="flex">
                <BsCheck className="mr-1" /> <p className="mr-1">Followed</p>
              </div>
            </button>
          )}
        </div>

        <div className="flex w-[300px] mt-3 justify-between">
          <h4>{postAmount} Posts</h4>
          {followers.length >= 0 &&
            (followers.length > 1 ? (
              <p
                onClick={() => {
                  setOpenFollow(true);
                  setCheck(true);
                }}
                className="pl-2 text-md cursor-pointer"
              >
                {likes.length} Followers
              </p>
            ) : (
              <p
                onClick={() => {
                  setOpenFollow(true);
                  setCheck(true);
                }}
                className="pl-2 text-md cursor-pointer"
              >
                {followers.length} Follower
              </p>
            ))}
          <h6
            onClick={() => {
              setOpenFollow(true);
              setCheck(false);
            }}
            className="text-md cursor-pointer"
          >
            {following.length} Following
          </h6>
        </div>
        <div className="mt-3 Bio">{user.bio}</div>
      </div>
      <IoSettingsOutline
        onClick={open}
        className="cursor-pointer ml-10"
        size={25}
      />

      <OptionsModal opened={settingsOpened} close={close} />
      <FollowModal check={check} followers={followers} following={following} />
    </div>
  );
}

export default Header;
