import React from "react";
import Moment from "react-moment";
import { HeartIcon as HeartIconFilled  } from "@heroicons/react/solid";
import {
  TrashIcon,
  HeartIcon,
  ChatIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  addDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

function Post({ id, username, userimg, img, caption }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  const sendComment = async (e) => {
    e.preventDefault();
    const commentToSend = comment;
    setComment("");
    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.username,
      });
    }
  };

  const deletePost = async ()=>{
    await deleteDoc(doc(db, "posts", id));
  }

  useEffect(() => {
    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs);
    });
    return () => {
      unsubscribe();
    };
  }, [db, id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [db, id]);

  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session.user.uid) !== -1
      ),
    [likes]
  );

  return (
    <div className="bg-white my-7 border rounded-sm ">
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-full p-1 border mr-3 "
            src={userimg}
            alt=""
          />
          <p className="font-bold">{username}</p>
        </div>
        
        <TrashIcon className="h-6 cursor-pointer text-red-500" onClick = {deletePost} />
      </div>

      {/* Image */}
      <img className="w-full object-cover" src={img} alt="" />

      {/* Buttons */}
      {session && (
        <div className="flex items-center justify-between pt-4 px-4 ">
          <div className="flex items-center space-x-3">
            {hasLiked ? (
              <HeartIconFilled
                className="btn text-red-500"
                onClick={likePost}
              />
            ) : (
              <HeartIcon className="btn" onClick={likePost} />
            )}
            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn rotate-[60deg] -mt-1 ml-1" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}

      {/* caption */}
      {caption.trim() && (
      <div className="truncate p-4">
        <span className="font-bold  mr-1">{username}</span>
        {caption}
      </div>

      )}

      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 py-4 max-h-20 overflow-y-scroll  scrollbar-thin scrollbar-thumb-black">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
              <img
                src={comment.data().userImage}
                alt=""
                className="rounded-full h-7 w-7"
              />
              <p className="text-sm flex-1">
                <span className="font-bold mr-3">
                  {comment.data().username}
                </span>
                {comment.data().comment}
              </p>
              <Moment fromNow className="pr-5 text-xs">
                {comment?.data()?.timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* input box */}
      {session && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border-none focus:outline-none px-3"
            placeholder="Add a comment"
            type="text"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="font-semibold text-blue-400"
            onClick={sendComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
