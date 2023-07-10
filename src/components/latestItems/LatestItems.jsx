import React, { useEffect, useState } from "react";
import { Card } from "../index";
import { useTranslation } from "react-i18next";
import noImage from "../../assets/images/no-image.jpg";
import axios from "axios";
import { GET_LATEST_ITEMS, routes } from "../../constant";
import { useDispatch } from "react-redux";
import { start, done } from "../../store/loaderSlice";
import { convertTimestamp } from "../../utils/convertTimestamp";
import { Link } from "react-router-dom";

const LatestItems = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: GET_LATEST_ITEMS,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      setData(data1);
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
    <section className="latestItems w-full py-20 bg-white dark:bg-black max-sm:pb-10">
      <div className="container">
        <div className="latestItems-box">
          <div className="top">
            <h1 className="text-center text-3xl mb-5 max-sm:text-2xl">
              {t("latestItems.title")}
            </h1>
          </div>
          <div className="center py-4">
            <div className="cards flex w-full justify-between flex-wrap gap-3">
              {data?.map((item) => (
                <Card
                  title={item?.name}
                  author={item?.author}
                  img={item?.image?.url || noImage}
                  addedBy={item?.addedBy?.name}
                  createdAt={convertTimestamp(item?.publishedAt)}
                  key={item?._id}
                  itemLink={`/item/${item?._id}`}
                  collectionLink={`/collection/${item?.collections?._id}`}
                />
              ))}
            </div>
          </div>
          <div className="bottom mt-6 flex items-center justify-center">
            <Link to={routes.ALL_ITEMS}>
              <button className="px-4 py-3 text-white dark:text-black bg-green-500 dark:bg-white rounded-md uppercase max-sm:text-sm">
                {t("allItems")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestItems;
