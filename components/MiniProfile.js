import React from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

function MiniProfile() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mt-[-25px] ml-10">
      <img
        src={session?.user?.image}
        alt={session?.user?.username?.slice(0,2).toUpperCase()}
        className="w-14 h-14 rounded-full cursor-pointer object-cover border p-[2px]"
        onClick={() => router.push(`/${session?.user.username}`)}
      />

      <div className="flex-1 mx-5">
        <h2 className="font-bold"  onClick={() => router.push(`/${session?.user.username}`)}>{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">{session?.user?.name}</h3>
      </div>

      <button
        className="text-blue-400 text-sm font-semibold"
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}

export default MiniProfile;
