import React from 'react'
import { useSession } from 'next-auth/react';

function MiniProfile() {
  const {data: session} = useSession();

  return (
    <div className='flex items-center justify-between mt-[-25px] ml-10'>
        <img src={session.user?.image}
        alt="profile" className='w-14 h-14 rounded-full cursor-pointer object-cover border p-[2px]'/>

        <div className='flex-1 mx-5'>
            <h2 className='font-bold'>{session.user?.username}</h2>
            <h3 className='text-sm text-gray-400'>{session.user.name}</h3>
        </div>
        
        <button className='text-blue-400 text-sm font-semibold'>Sign Out</button>
    </div>
  )
}

export default MiniProfile