import React from "react";
import SidebarOption from "./SidebarOption";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";
import {
  AiOutlineMessage,
  AiOutlineHeart,
  AiOutlinePlusCircle,
  AiOutlineMenu,
} from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import { createModalState, searchModalState } from "../atoms/modalAtom";
import OptionsModal from "../components/OptionsModal";
import { useDisclosure } from '@mantine/hooks';
import { Menu } from "@mantine/core";

function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [openCreate, setOpenCreate] = useRecoilState(createModalState);
  const [openSearch, setOpenSearch] = useRecoilState(searchModalState);
  const [settingsOpened, { open, close }] = useDisclosure(false);

  //const open = useRecoilValue(modalState)
  console.log(session);

  return (
    <div className="Sidebar">
      <div className="float-left shadow-sm border-r bg-white h-screen w-60">
        <div className="webName">
          {/* <img className='icon' src="./fire.png" alt='logo'/> */}
          <p className="animate-text mt-6 mb-6">InTouch</p>
        </div>

        <div className="flex flex-col">
          <SidebarOption
            func={() => router.push("/")}
            Icon={IoHomeOutline}
            Title="Home"
          />
          <SidebarOption
            func={() => setOpenSearch(true)}
            Icon={HiMagnifyingGlass}
            Title="Search"
          />
          <SidebarOption
            func={() => router.push("/chat")}
            Icon={AiOutlineMessage}
            Title="Messages"
          />
          <SidebarOption Icon={AiOutlineHeart} Title="Notifications" />
          <SidebarOption
            func={() => setOpenCreate(true)}
            Icon={AiOutlinePlusCircle}
            Title="Create"
          />

          <div
            className="navBtn m-4 h-10"
            onClick={() => router.push(`/${session.user.username}`)}
          >
            <img
              src={session?.user?.image}
              alt="pfp"
              className="h-7 w-7 rounded-full cursor-pointer object-cover"
            />
            <h3>Profile</h3>
          </div>
        </div>
        <div className="fixed bottom-0">
          <Menu shadow="md" width={200}>
            {" "}
            <Menu.Target>
              <div className="navBtn m-4 mt-3 h-10 pt-1 items-center text-xl font-medium">
                <AiOutlineMenu />
                <h3>Menu</h3>
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={open}>Settings</Menu.Item>
              <Menu.Item>Log Out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>

        <OptionsModal opened={settingsOpened} close={close} />
      </div>
    </div>
  );
}

export default Sidebar;
