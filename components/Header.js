import React from 'react'
import Image from 'next/image'
import { HomeIcon,
  MagnifyingGlassIcon, 
  PlusCircleIcon,
  HeartIcon,
  Bars3Icon,
  PaperAirplaneIcon} from '@heroicons/react/24/outline'

function Header() {
  return (
    <div className='shadow-sm border-b bg-white sticky top-0 z-50'>
     <div className='flex justify-between bg-white max-w-7xl mx-5 h-20 lg:mx-auto'>
      <div className="relative hidden cursor-pointer lg:inline-grid h-24 w-24">
        <Image src="https://links.papareact.com/ocw" alt='name' fill style={{objectFit:"contain"}}/>
      </div>

      <div className="relative lg:hidden h-10 w-10 flex-shrink-0 cursor-pointer">
        <Image src="https://links.papareact.com/jjm" alt='logo' fill style={{objectFit:"contain"}}/>
      </div>

      <div className='max-w-xs'>
        <div className='relative mt-1 p-3 rounded-md'>
          <div className='absolute mt-2 insert-y-0 pl-3 flex items-center pointer-events-none'>
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400"/>
          </div>
          <input className='bg-gray-50 block w-full pl-10 sm:text-sm 
          border-gray-300 focus:ring-black focus:border-black rounded-md' type='text' placeholder='Search'/>
        </div>
      </div>

      <div className='flex items-center justify-end space-x-4'>
        <HomeIcon className='navBtn'/>
        <PaperAirplaneIcon className='navBtn' />
        <HeartIcon className='navBtn'/>
        <PlusCircleIcon className='navBtn'/>
        <Bars3Icon className='navBtn'/>

        <img src="https://assets-prd.ignimgs.com/2023/01/04/trigunstampedeexclusiveclip-ign-blogroll-1672791267600.jpg"
        alt="profile" className='h-10 w-10 rounded-full cursor-pointer object-cover'/>
      </div>
     </div> 
    </div>
  )
}

export default Header