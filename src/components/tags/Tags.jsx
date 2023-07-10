import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_TAGS } from "../../constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import { start, done } from "../../store/loaderSlice";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (tag) => {
    navigate(`/search/tag=${tag}`);
  };
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_TAGS}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      setTags(data1);
      dispatch(done());
    } catch (err) {
      console.log(err);
      dispatch(done());
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="tags w-full bg-white dark:bg-black pt-20 max-sm:pt-10">
      <div className="container">
        <div className="tags-box border-t-[1px] border-gray-500">
          <div className="flex items-center justify-center gap-x-3 flex-wrap gap-y-3 mt-20 pb-20 max-sm:mt-10 max-sm:pb-10">
            {tags?.map((item, id) => (
              <p
                className="px-4 py-[5px] bg-blue-500 rounded-full cursor-pointer dark:bg-white dark:text-black max-sm:text-sm"
                key={id}
                onClick={() => handleClick(item)}
              >
                #{item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tags;
