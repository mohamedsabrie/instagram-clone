import Image from "next/image";
import { SearchIcon, HomeIcon, MenuIcon,   } from "@heroicons/react/solid";
import { PaperAirplaneIcon, PlusCircleIcon, HeartIcon, UserGroupIcon } from "@heroicons/react/outline";
import ProfilePicture from "./ProfilePicture";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react"
import {useRouter} from 'next/router'
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";





function Header() {

  const { data: session} = useSession();
  const router = useRouter();
  const [openModal, setOpenModal ] = useRecoilState(modalState)


  const handleSignOut = () =>{
    signOut()
  }

  return (
    <header className="shadow-sm border-b h-16 sticky top-0 bg-white z-50">
      <div className="flex items-center max-w-6xl mx-5 xl:mx-auto justify-between">
        {/* left side */}
        <div className="h-16">
          <div className="relative hidden lg:inline-flex w-24 h-16   cursor-pointer">
            <Image
              src="https://links.papareact.com/ocw"
              layout="fill"
              objectFit="contain"
              priority = {true}
              onClick = {() => router.push('/')}
            />
          </div>
          <div className="relative  lg:hidden w-10 h-16 cursor-pointer flex-shrink-0">
            <Image
              src="https://links.papareact.com/jjm"
              layout="fill"
              objectFit="contain"
              onClick = {() => router.push('/')}
            />
          </div>
        </div>
        {/* middle side */}
        <div className=" bg-gray-50 flex relative rounded-md max-w-xs">
          <div className="absolute left-0 top-0 pl-3 pointer-events-none flex h-full items-center">
            <SearchIcon className="w-5 h-5 text-gray-500" />
          </div>
          <input
            className="pl-10 block w-full py-2 border border-gray-100 focus:border-black rounded-md"
            type="text"
            placeholder="Search"
          />
        </div>

        {/* right side */}
        <div className="flex items-center space-x-3">
          <HomeIcon onClick = {() => router.push('/')} className="btn hidden md:inline-flex " />
          <MenuIcon className=" btn md:hidden " />
          {session ? (
            <>
            <div className="relative hidden md:inline-flex">
            <span className="absolute -top-3 -right-3 bg-red-400 text-white text-sm rounded-full w-5 h-5 grid place-items-center animate-pulse"> 9 </span>
           <PaperAirplaneIcon className="btn rotate-[60deg] -mt-1 ml-1 " />
            </div>
           <PlusCircleIcon className="btn hidden md:inline-flex " onClick = {() => setOpenModal(true)} />
           <UserGroupIcon className="btn hidden md:inline-flex" />
           <HeartIcon className="btn hidden md:inline-flex" />
           
          <ProfilePicture handleSignOut = {handleSignOut} />
          </>
          ):(
          <button onClick = {signIn}>Sign In</button>
          )}
          
         

          
        </div>
      </div>
    </header>
  );
}

export default Header;
