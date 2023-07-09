import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import userImg from "../../assets/images/user-img.jpg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { GET_ITEMS, GET_LIKE, SEND_COMMENT } from "../../constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { start, done } from "../../store/loaderSlice";
import noImage from "../../assets/images/no-image.jpg";
import { convertTimestamp } from "../../utils/convertTimestamp";
import { useTranslation } from "react-i18next";
import { Comment } from "../index";
import { InputBase } from "@mui/material";
const Item = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user, token } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [extraFields, setExtraFields] = useState([]);
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_ITEMS}/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      if (
        Array.isArray(data1?.customFields.values) &&
        data1?.customFields.values?.length !== 0
      ) {
        const newArray = data1?.customFields.values?.filter(
          (item) =>
            item.name !== "name" && item.name !== "tags" && item.name !== "id"
        );
        setExtraFields(newArray);
      }
      setData(data1);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
    }
  };
  const getLike = async () => {
    try {
      const { data } = await axios({
        method: "post",
        url: GET_LIKE,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {
          itemId: id,
        },
      });
      getData();
    } catch (err) {
      console.log(err);
    }
  };
  const sendComment = async () => {
    dispatch(start());
    try {
      const { data } = await axios({
        method: "post",
        url: SEND_COMMENT,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "x-auth-token": token,
        },
        data: {
          itemId: id,
          comment: commentText,
        },
      });
      getData();
      dispatch(done());
      setCommentText("");
    } catch (err) {
      console.log(err);
      dispatch(done());
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    setIsLike(data?.likes?.includes(user?._id));
  }, [data]);
  const handleLike = () => {
    getLike();
  };
  const handleSendComment = () => {
    if (commentText.trim().length !== 0) {
      sendComment();
    }
  };
  return (
    <div className="item pt-20 dark:bg-black">
      <div className="container">
        <div className="item-box flex flex-col items-center">
          <div className="top flex justify-between w-full mt-10">
            <div className="left w-2/5">
              <img
                src={data?.image?.url || noImage}
                alt="Book"
                className="object-cover"
              />
            </div>
            <div className="right w-3/5 ml-10">
              <div className="p-4">
                <div className="top">
                  <Link
                    to={`/collection/${data?.collections?._id}`}
                    className="mb-2 text-lg block dark:text-white"
                  >
                    {data?.author}
                  </Link>
                  <h1 className="text-5xl mb-2">{data?.name}</h1>
                  <div className="tags flex flex-wrap items-center gap-x-2">
                    {data?.tags?.map((item, i) => (
                      <div className="tag px-2 bg-green-500 rounded-md" key={i}>
                        <p>#{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bottom">
                  <p className="my-3">
                    {t("itemId.added")} {convertTimestamp(data?.publishedAt)}{" "}
                    {t("itemId.by")} "{data?.addedBy?.name}"
                  </p>
                  <div className="extra-fields flex flex-col flex-wrap">
                    {extraFields?.map((item, id) => (
                      <div key={id}>
                        <span className="mr-2 capitalize">
                          {" "}
                          {item?.label} :
                        </span>
                        <span className="capitalize">
                          {item?.value.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <button
                      className={
                        user?.status === "Active"
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      }
                      disabled={user?.status === "Active" ? false : true}
                      onClick={handleLike}
                    >
                      {!isLike ? (
                        <FavoriteBorderIcon className="dark:text-white" />
                      ) : (
                        <FavoriteIcon className="text-red-500" />
                      )}
                    </button>
                    <span className="ml-1">{data?.likes?.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom w-1/2 mt-20">
            <div className="comments">
              <h2 className="mb-3">
                {t("replies")}: {data?.comments?.length}
              </h2>
              <hr />
              <div className="comments-box flex flex-col gap-y-3 py-4 pb-6 max-h-[600px] overflow-auto">
                {data?.comments?.map((comment, id) => (
                  <Comment
                    img={comment?.image || userImg}
                    user={comment?.name}
                    desc={comment?.comment}
                    key={id}
                  />
                ))}
              </div>
              {user?.status === "Active" && (
                <div className="send-comment my-3 rounded-md">
                  <div className="p-4 flex items-center w-full gap-x-3 ">
                    <img
                      src={user?.image || userImg}
                      alt="Img"
                      className="w-[40px] h-[40px] object-cover rounded-full"
                    />
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder={t("itemId.comment")}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className=" dark:!text-white w-[200px]"
                    />
                    <button
                      onClick={handleSendComment}
                      className="text-white dark:text-black bg-green-500 dark:bg-white px-4 py-3 rounded-md"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
