import React, { useEffect, useState } from 'react'
import faker from 'faker'
import Story from './Story';
import {useSession} from 'next-auth/react'

function Stories() {
    const {data: session} = useSession();

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const suggestions  = [...Array(20)].map((_,i) => ({
            ...faker.helpers.contextualCard(),
            id: i
        }));

        setSuggestions(suggestions)
        
    }, [])

    return (
        <div className="flex items-center space-x-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-black   p-6 bg-white mt-8 border border-gray-200 rounded-md">
            {session && (
                <Story image = {session?.user?.image} username = {session.user.username} alt="" />
            )}
             {suggestions.map(item => (
                 <Story
                   key={item.id}
                   image = {item.avatar}
                   username= {item.username}

                 />
             ))}
        </div>
    )
}

export default Stories
