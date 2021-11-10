import { signOut } from "next-auth/react"
import ProfilePicture from "./ProfilePicture"
import {useSession} from'next-auth/react'

function MiniProfile() {
    const { data: session} = useSession();

    return (
        <div className="flex items-center justify-between ml-10 mt-14 ">
           <ProfilePicture />
            <div className="flex-1 mx-4 text-sm">
                <h2 className="font-bold">{session?.user?.username}</h2>
                <h3 className="text-sm text-gray-500">Welcome to Instagram</h3>
            </div>
            <button onClick={signOut} className='text-sm font-semibold text-blue-400'>
                Sign Out
            </button>
        </div>
    )
}

export default MiniProfile
