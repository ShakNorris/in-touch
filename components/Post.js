import React from 'react'
import { BookmarkIcon,
    ChatBubbleLeftIcon, 
    AdjustmentsHorizontalIcon,
    HeartIcon,
    FaceSmileIcon,
    PaperAirplaneIcon} from '@heroicons/react/24/outline'
import {HeartIcon as HeartIconFilled} from '@heroicons/react/24/solid'; 

function Post({id, username, userImg, img, caption}) {
  return (
    <div className='bg-white my-5 border rounded-sm'>
        <div className='flex items-center p-5'>
            <img className='rounded-full h-8 w-8 object-contain
            border p-1 mr-3' src={userImg} alt=""/>
            <p className='flex-1 font-bold'>{username}</p>
            <AdjustmentsHorizontalIcon className='h-5' />
        </div>

        <img src={img} className="object-cover w-full" alt=""/>

        <div className='flex justify-between px-4 p-3'>
            <div className='flex space-x-2'>
                <HeartIcon className='postBtn'/>
                <ChatBubbleLeftIcon className='postBtn'/>
                <PaperAirplaneIcon className='postBtn'/>
            </div>

            <BookmarkIcon className='postBtn' />
        </div>

        <div>
            <p className='p-5 mt-[-25px] mb-[-20px] truncate'>
                <span className='font-bold mr-1'>{username}</span>
                {caption}
            </p>
        </div>

        <form className='flex items-center p-4'>
            <FaceSmileIcon className='h-5 w-5'/>
            <input type='text'
            placeholder='Add a comment...'
            className='flex-1 border-none focus:ring-0 outline-none' />
            <button className='font-semibold text-blue-500'>Post</button>
        </form>
    </div>
  )
}

export default Post