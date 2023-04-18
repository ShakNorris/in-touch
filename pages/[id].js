import { getAllUsersFirebase, getAllPostsFirebase } from "../lib/datahelper";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PostModal from "../components/PostModal";
import { useDisclosure } from "@mantine/hooks";
import UploadModal from '../components/UploadModal'
import SearchModal from '../components/SearchModal'

export default function User({ user }) {
  const [posts, setPosts] = useState();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: session } = useSession();
  const [clickedPost, setClickedPost] = useState();

  async function fetchData() {
    const response = await getAllPostsFirebase(user);
    setPosts(response);
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  function getPostData(p) {
    setClickedPost(p);
    console.log(clickedPost)
    open;
  }

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
            <Header user={u} id={u.id} />

            <div className="p-10 flex flex-wrap">
              {posts?.map((p) => (
                <>
                  <div
                    key={p.id}
                    id={p.id}
                    className="navBtn mx-5 my-5 w-[300px] h-[300px] cursor-pointer"
                    onClick={open}
                  >
                    <Image
                      onClick={() => {getPostData(p)}} 
                      src={p.value.image}
                      width={300}
                      height={300}
                      className="w-[300px] h-[300px] object-cover"
                    />
                  </div>
                </>
              ))}
            </div>
          </>
        ))}
        <PostModal
          id={clickedPost?.id}
          username={clickedPost?.value.username}
          userImg={clickedPost?.value.profileImg}
          img={clickedPost?.value.image}
          caption={clickedPost?.value.caption}
          timeStamp={clickedPost?.value.timestamp}
          opened={opened}
          close={close}
        />

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

  // const user = getAllUsers(id);

  // return {
  //     props: {user}
  // }
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
