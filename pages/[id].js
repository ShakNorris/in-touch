import { getAllUsersFirebase, getAllPostsFirebase } from "../lib/datahelper";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UploadModal from "../components/UploadModal";
import SearchModal from "../components/SearchModal";
import ProfilePost from "../components/ProfilePost";
import { db } from "../firebase";

export default function User({ user }) {
  const [posts, setPosts] = useState();
  const { data: session } = useSession();

  async function fetchData() {
    const response = await getAllPostsFirebase(user);
    setPosts(response);
  }

  useEffect(() => {
    fetchData();
  }, [db, posts]);

  return (
    <>
      <div>
        {user.map((u) => (
          <>
            <Head>
              <title>{u.username} | InTouch</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <Sidebar />
            <Header user={u} postAmount={posts?.length} />

            <div className="p-10 flex flex-wrap">
              {posts?.map((p) => (
                <>
                <ProfilePost post={p}/>
                </>
              ))}
            </div>
          </>
        ))}

        {/* <PostModal
          id={clickedPost?.id}
          username={clickedPost?.value.username}
          userImg={clickedPost?.value.profileImg}
          img={clickedPost?.value.image}
          caption={clickedPost?.value.caption}
          timeStamp={clickedPost?.value.timestamp}
          opened={opened}
          close={close}
        /> */}

        <UploadModal />
        <SearchModal />
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const user = await getAllUsersFirebase(id);

  return {
    props: { user },
  };
}

export async function getStaticPaths() {
  // const users = getAllUsers();
  const users = await getAllUsersFirebase();

  const paths = users.map((user) => ({
    params: { id: user.username.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}
