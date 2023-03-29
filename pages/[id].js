import { getAllUsersFirebase, getAllPostsFirebase } from "../lib/datahelper";
import Head from "next/head";
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Image from "next/image";
import { useEffect, useState } from "react";


export default function User({user}){ 

    const [posts, setPosts] = useState();

    async function fetchData() {
        const response = await getAllPostsFirebase(user);
        setPosts(response);
    }
    
    useEffect(() => {
        fetchData();
    }, [user])

    return(
        <>
        <div>
            {
                user.map(u => (
                    <>
                        <Head>
                        <title>{u.username} | InTouch</title>
                        <link rel="icon" href="/favicon.ico" />
                        </Head>

                        <Sidebar />
                        <Header user={u} />
                        
                        <div className="p-10 flex flex-wrap">
                            {posts?.map(p => (
                                <div className="navBtn mx-5 my-5 w-[300px] h-[300px] cursor-pointer">
                                    <Image src={p.image} width={300} height={300} className='w-[300px] h-[300px] object-cover'/>
                                </div>
                            ))}       
                        </div>
                    </>
                ))
            }
        </div>
        </>
    )
}

export async function getStaticProps({params}){
    const {id} = params;
    const user = await getAllUsersFirebase(id);

    return{ 
        props: {user}
    }

    // const user = getAllUsers(id);

    // return {
    //     props: {user}
    // }
}

export async function getStaticPaths(){
    // const users = getAllUsers();
    const users = await getAllUsersFirebase();

    const paths = users.map(user => ({
        params: {id: user.username.toString()}
    }));
    
    
    return{
        paths,
        fallback: false,
    }
}