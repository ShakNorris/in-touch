import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@mantine/core";
import Moment from "react-moment";
import { BsEmojiSmile } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
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
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function PostModal({
  opened,
  close,
  id,
  username,
  userImg,
  img,
  caption,
  timeStamp,
  fileType
}) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const videoTypes = ["video/mp4", "video/mov", "video/avi"];


  const commentRef = useRef(null);

  const handleComment = () => {
    commentRef.current.focus();
  };

  useEffect(() => {
    const getComments = async () => {
      if (id) {
        const data = await getDocs(collection(db, "Posts", id, "Comments"));
        setComments(data.docs);
      }
    };

    getComments();
  }, [db, id]);

  const ShowEmojis = () => {
    if (showEmojis == false) return setShowEmojis(true);
    return setShowEmojis(false);
  };

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
    if (id) {
      onSnapshot(collection(db, "Posts", id, "Likes"), (snapshot) =>
        setLikes(snapshot.docs)
      );
    }
  }, [db, id]);

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
    <>
      <Modal
        size="auto"
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
      >
        <div class="grid grid-cols-2 gap-3">
          <div>
          {videoTypes.includes(fileType) ? (
        <>
          {" "}
          <video className="h-[600px]" controls>
            <source src={img} type={fileType} />
          </video>
        </>
      ) : (
        <img src={img} className="w-max" />
      )} </div>
          <div className="relative">
            <div className="flex">
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
            </div>
            <div>
              <p className="p-1 pb-2 border-b bg-white font-semibold">
                {caption}
              </p>

              <div>
                {comments.length > 0 && (
                  <div className="h-15 mt-2 overflow-y-scroll scrollbar-thin">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex mt-2 items-center space-x-2"
                      >
                        <img
                          className="h-9 rounded-full"
                          src={comment.data().profileImg}
                        />
                        <p className="text-sm flex-1">
                          <span className="font-semibold mr-1">
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

                <div className="absolute bottom-0 w-full">
                  <div className="flex justify-between pt-3">
                    <div className="flex space-x-2">
                      {hasLiked ? (
                        <AiFillHeart
                          onClick={likePost}
                          className="postBtn text-red-500 w-7"
                        />
                      ) : (
                        <AiOutlineHeart
                          onClick={likePost}
                          className="postBtn w-7"
                        />
                      )}
                      <BiComment onClick={handleComment} className="postBtn w-7" />
                      {likes.length > 0 &&
                        (likes.length > 1 ? (
                          <p className="pl-2 text-md text-gray-500">
                            {" "}
                            {likes.length} Likes
                          </p>
                        ) : (
                          <p className="pl-2 text-md text-gray-500">
                            {" "}
                            {likes.length} Like
                          </p>
                        ))}
                    </div>
                  </div>

                  <form className="flex items-center w-full">
                    <BsEmojiSmile className="h-5 w-5" onClick={ShowEmojis} />
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
                </div>

                {showEmojis && (
                  <div className="emojiPlacement">
                    <Picker
                      data={data}
                      onEmojiSelect={addEmoji}
                      theme="light"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PostModal;
