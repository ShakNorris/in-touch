import React from "react";
import Image from "next/image";
import {IoSettingsOutline} from 'react-icons/io5'

function Header({user}) {
  return (
    <div className="p-5 flex justify-center items-center shadow-sm border-b bg-white">
        <div className="mx-10">
            <Image className="inline rounded-full cursor-pointer object-cover border p-[2px] border-black" src={`${user.profileImg}`} alt="profile" width={150} height={150 }/>
        </div>
        <div className="mx-5 ml-10">
            <div>
                <h2 className="font-bold text-2xl">{user.username}</h2>
                <h3 className="text-lg text-gray-400">{user.name}</h3>
            </div>

            <div className="flex w-[300px] mt-3 justify-between">
                <h4>10 Posts</h4>
                <h5>-1 Followers</h5>
                <h6>1000 Following</h6>
            </div>
            
            <div className="w-[300px] mt-3">
                <p>BIO GOES HERE</p>
            </div>
        </div>
        <IoSettingsOutline className="cursor-pointer ml-10" size={25} />
      </div>
  );
}

export default Header;
