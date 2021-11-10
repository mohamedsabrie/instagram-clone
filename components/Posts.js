import { collection, onSnapshot, orderBy, query } from "@firebase/firestore"
import { useEffect, useState } from "react";
import { db } from "../firebase";
import Post from "./Post"



function Posts() {
    const [posts , setPosts] = useState([]);
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
       const unsubscribe =   onSnapshot(q, (snapshot) => {
           setPosts(snapshot.docs);
       });

       return unsubscribe;
        
    }, [db]);

    return (
        <div>
           {posts.map((post) => (
               <Post
                 key = {post.id}
                 id = {post.id}
                 username = {post.data().username}
                 userimg = {post.data().profileImage}
                 img = {post.data().image}
                 caption = {post.data().caption}
               />
           ))}
        </div>
    )
}

export default Posts;


