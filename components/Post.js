import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import {IoOpenOutline} from 'react-icons/io5'
import { BiComment } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GrSend } from "react-icons/gr";
import { FaRegBookmark } from "react-icons/fa";
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
import Moment from "react-moment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import PostModal from "../components/PostModal";
import { useDisclosure } from "@mantine/hooks";

function Post({
  id,
  username,
  userImg,
  img,
  caption,
  timeStamp,
  fileType,
  emojiPicker,
}) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const commentRef = useRef(null);

  const videoTypes = ["video/mp4", "video/mov", "video/avi"];

  const handleComment = () => {
    commentRef.current.focus();
  };

  const ShowEmojis = () => {
    if (showEmojis == false) return setShowEmojis(true);
    return setShowEmojis(false);
  };

  const commentCollectionRef = collection(db, "Posts", id, "Comments");

  const SendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "Posts", id, "Comments"), {
      comment: commentToSend,
      username: session.user.username,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  useEffect(() => {
    const getComments = async () => {
      const data = await getDocs(commentCollectionRef);
      setComments(data.docs);
    };

    getComments();
  }, [db]);

  useEffect(
    () =>
      onSnapshot(collection(db, "Posts", id, "Likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  const likePost = async () => {
    if (hasLiked)
      return await deleteDoc(doc(db, "Posts", id, "Likes", session.user.uid));
    return await setDoc(doc(db, "Posts", id, "Likes", session.user.uid), {
      username: session.user.username,
    });
  };

  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session.user.uid) !== -1
      ),
    [likes]
  );

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setComment(comment + emoji);
  };

  return (
    <div className="relative bg-white my-5 border rounded-sm">
      <div className="flex items-center p-5">
        <img
          className="rounded-full h-8 w-8 object-contain
            border p-1 mr-3"
          src={userImg}
          alt=""
        />
        <p className="font-bold">{username}</p>
        <Moment className="pl-2 text-sm text-gray-400 flex-1" fromNow>
          {timeStamp?.toDate()}
        </Moment>
        <IoOpenOutline className="h-5 w-5" onClick={open}/>
      </div>

      {videoTypes.includes(fileType) ? (
        <>
          {" "}
          <video className="w-[800px]" controls>
            <source src={img} type={fileType} />
          </video>
        </>
      ) : (
        <img
          src={img}
          onClick={open}
          className="object-cover w-full cursor-pointer"
          alt=""
        />
      )}

      <PostModal
        id={id}
        username={username}
        userImg={userImg}
        img={img}
        caption={caption}
        timeStamp={timeStamp}
        fileType={fileType}
        opened={opened}
        close={close}
      />

      <div className="flex justify-between px-4 p-3">
        <div className="flex space-x-2">
          {hasLiked ? (
            <AiFillHeart
              onClick={likePost}
              className="postBtn text-red-500 w-7"
            />
          ) : (
            <AiOutlineHeart onClick={likePost} className="postBtn w-7" />
          )}
          <BiComment onClick={handleComment} className="postBtn w-7" />
          <GrSend className="postBtn w-7" />
          {likes.length > 0 &&
            (likes.length > 1 ? (
              <p className="pl-2 text-md text-gray-500">
                {" "}
                {likes.length} Likes
              </p>
            ) : (
              <p className="pl-2 text-md text-gray-500"> {likes.length} Like</p>
            ))}
        </div>

        <FaRegBookmark className="postBtn" />
      </div>

      <div>
        <p className="p-5 mt-[-25px] mb-[-20px] truncate">
          <span className="font-bold mr-1">{username}</span>
          {caption}
        </p>
      </div>

      <div>
        {comments.length > 0 && (
          <div className="ml-10 h-15 overflow-y-scroll scrollbar-thin">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-center space-x-2">
                <img
                  className="h-7 rounded-full"
                  src={comment.data().profileImg}
                />
                <p className="text-sm flex-1">
                  <span className="font-bold mr-1">
                    {comment.data().username}
                  </span>
                  {comment.data().comment}
                </p>
                <Moment className="pr-5 text-xs text-gray-400" fromNow>
                  {comment.data().timestamp?.toDate()}
                </Moment>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* )} */}

      <form className="flex items-center p-4">
        <BsEmojiSmile className="h-5 w-5 cursor-pointer" onClick={ShowEmojis} />
        <input
          ref={commentRef}
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border-none focus:ring-0 outline-none"
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          onClick={SendComment}
          className="font-semibold text-blue-500"
        >
          Post
        </button>
      </form>

      {showEmojis && (
        <div className="emojiPlacement">
          <Picker data={data} onEmojiSelect={addEmoji} theme="light" />
        </div>
      )}
    </div>
  );
}

export default Post;
