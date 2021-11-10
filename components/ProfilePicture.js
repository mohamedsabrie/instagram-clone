import Image from 'next/image'
import { useSession } from "next-auth/react"


function ProfilePicture({handleSignOut}) {
    const { data: session} = useSession();

    return (
        <div>
             {session?.user?.image && (
                <div className="relative w-10 h-10 cursor-pointer">
                <Image
                className="rounded-full"
                  src= {session.user.image}
                  layout="fill"
                  objectFit="contain"
                  onClick = {handleSignOut}
                />
                </div>
          )}
        </div>
    )
}

export default ProfilePicture
