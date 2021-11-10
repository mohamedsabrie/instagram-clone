function Story({ image, username }) {
  return (
    <div className="">
      <img
        className="h-14 w-14 p-[2px] border-2 border-red-500 rounded-full transition transform duration-200 ease-out hover:scale-110 cursor-pointer"
        src={image}
        alt="story-image"
      />
      <p className="w-14 truncate text-center text-sm">{username}</p>
    </div>
  );
}

export default Story;
