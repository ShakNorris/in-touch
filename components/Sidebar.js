import React from 'react'
import SidebarOption from './SidebarOption';
import { HomeIcon,
    MagnifyingGlassIcon, 
    PlusCircleIcon,
    HeartIcon,
    Bars3Icon,
    ChatBubbleOvalLeftEllipsisIcon} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react';

function Sidebar() {

    const {data: session} = useSession();

    console.log(session)

    return ( 
    <div className='Sidebar'>
        <div className="float-left shadow-sm border-r bg-white h-screen w-60">

            <div className='webName'>
                {/* <img className='icon' src="./fire.png" alt='logo'/> */}
                <p className='animate-text mt-6 mb-6' >InTouch</p>
            </div>

            <div className='flex flex-col'>
                <SidebarOption Icon={HomeIcon} Title="Home" />
                <SidebarOption Icon={MagnifyingGlassIcon} Title="Search" />
                <SidebarOption Icon={ChatBubbleOvalLeftEllipsisIcon} Title="Messages" />
                <SidebarOption Icon={HeartIcon} Title="Notifications" />
                <SidebarOption Icon={PlusCircleIcon} Title="Create" />
                
                <div className='navBtn m-4 h-10'>
                    <img src= {session?.user?.image}
                    alt="pfp" className='h-7 w-7 rounded-full cursor-pointer object-cover'/>
                    <h3>Profile</h3>
                </div>

            </div>
            <div className="fixed bottom-0">
                <SidebarOption Icon={Bars3Icon} Title="Menu"  />
            </div>
        </div>
    </div>
    )
}

export default Sidebar