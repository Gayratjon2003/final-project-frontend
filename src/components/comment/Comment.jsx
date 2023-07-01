import React from "react";

const Comment = ({ img, user, desc }) => {
  return (
    <div className="comment">
      <div className="flex items-center">
        <div className="left mr-3 w-[30px]">
          <img
            src={img}
            alt="Img"
            className="w-[30px] h-[30px] object-cover rounded-full"
          />
        </div>
        <div className="right 2/5">
          <span className="text-xs opacity-80">{user}</span>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
