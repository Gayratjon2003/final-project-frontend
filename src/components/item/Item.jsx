import React from "react";
import { Link, useParams } from "react-router-dom";
import img from "../../assets/images/book.png";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
const tags = ["Book", "Kitob", "Ruchka", "Universitet"];
const user = true;
const Item = () => {
  const { id } = useParams();
  // console.log("id: ", id);
  return (
    <div className="item pt-20 dark:bg-black">
      <div className="container">
        <div className="item-box flex flex-col items-center">
          <div className="top flex justify-between w-full mt-10">
            <div className="left w-2/5">
              <img src={img} alt="Book" className="object-cover" />
            </div>
            <div className="right w-3/5 ml-10">
              <div className="p-4">
                <div className="top">
                  <Link to={`/collection/1`} className="mb-2 text-lg block dark:text-white">Book author</Link>
                  <h1 className="text-5xl mb-2">Book name</h1>
                  <div className="tags flex flex-wrap items-center gap-x-2">
                    {tags?.map((item, i) => (
                      <div
                        className="tag px-2 bg-green-500 rounded-md"
                        key={i}
                      >
                        <p>#{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bottom">
                  <p className="my-3 text-base">
                    decsription Lorem ipsum dolor, sit amet consectetur
                    adipisicing elit. Mollitia illum perspiciatis rem deleniti
                    in veniam ratione, optio amet. Illum nostrum ipsa ab
                    provident fugit unde laudantium laboriosam saepe a rerum.
                  </p>
                  <p className="my-3">Added 30.05.2023 by "User"</p>
                  <div className="flex items-center">
                    <button className="">
                      {user ? (
                        <FavoriteBorderIcon className="dark:text-white" />
                      ) : (
                        <FavoriteIcon className="text-red-500" />
                      )}
                    </button>
                    <span className="ml-1">55</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom w-1/2 mt-20">
            <div className="comments">
              <h2 className="mb-3">Replies: 2</h2>
              <hr className="" />
              <div className="comments-box flex flex-col gap-y-3 py-4">
              <div className="comment">
                <div className="flex items-center">
                  <div className="left mr-3 w-1/5">
                    <img
                      src={img}
                      alt="Img"
                      className="w-[30px] h-[30px] object-cover rounded-full"
                    />
                  </div>
                  <div className="right">
                    <span className="text-xs opacity-80">User</span>
                    <p>
                      This is a comment Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Saepe alias aliquid minima sapiente.
                      Saepe, incidunt id ratione exercitationem alias
                      voluptatem?{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="comment">
                <div className="flex items-center">
                  <div className="left mr-3 w-1/5">
                    <img
                      src={img}
                      alt="Img"
                      className="w-[30px] h-[30px] object-cover rounded-full"
                    />
                  </div>
                  <div className="right">
                    <span className="text-xs opacity-80">User</span>
                    <p>
                      This is a comment Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Saepe alias aliquid minima sapiente.
                      Saepe, incidunt id ratione exercitationem alias
                      voluptatem?{" "}
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
