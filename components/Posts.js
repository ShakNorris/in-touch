import { faker } from "@faker-js/faker";
import { db } from "../firebase";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Post from "./Post";

const temp_data = [
  // {
  //     id: '1',
  //     username: 'some random donny',
  //     avatar: faker.image.avatar(),
  //     img: 'https://i.ytimg.com/vi/pAt2f0GQhtw/maxresdefault.jpg',
  //     caption: "This is DOPE"
  // },
  // {
  //     id: '2',
  //     username: 'another fella',
  //     avatar: faker.image.avatar(),
  //     img: 'https://i.ytimg.com/vi/pAt2f0GQhtw/maxresdefault.jpg',
  //     caption: "This is DOPE"
  // }
];

function Posts() {
  const [posts, setPosts] = useState();

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "Posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );

  return (
    <div>
      {posts?.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImg}
          img={post.data().image}
          caption={post.data().caption}
          timeStamp={post.data().timestamp}
        />
      ))}
      {temp_data.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.avatar}
          img={post.img}
          caption={post.caption}
        />
      ))}

    </div>
  );
}

export default Posts;
