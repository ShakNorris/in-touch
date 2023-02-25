import React from 'react'

function MiniProfile() {
  return (
    <div className='flex items-center justify-between mt-[-25px] ml-10'>
        <img src="https://assets-prd.ignimgs.com/2023/01/04/trigunstampedeexclusiveclip-ign-blogroll-1672791267600.jpg"
        alt="profile" className='w-14 h-14 rounded-full cursor-pointer object-cover border p-[2px]'/>

        <div className='flex-1 mx-5'>
            <h2 className='font-bold'>Profile Name</h2>
            <h3 className='text-sm text-gray-400'>Nickname</h3>
        </div>
        
        <button className='text-blue-400 text-sm font-semibold'>Sign Out</button>
    </div>
  )
}

export default MiniProfile