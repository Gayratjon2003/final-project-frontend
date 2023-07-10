import React, { useEffect, useState } from "react";
import { Card2 } from "../index";
import { useTranslation } from "react-i18next";
import noImage from "../../assets/images/no-image.jpg";
import axios from "axios";
import { GET_LATEST_COLLECTIONS, routes } from "../../constant";
import { useDispatch } from "react-redux";
import { start, done } from "../../store/loaderSlice";
import { Link } from "react-router-dom";

const LargestCollections = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: GET_LATEST_COLLECTIONS,
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
    <section className="largestCollections w-full bg-white dark:bg-black">
      <div className="container">
        <div className="largestCollections-box">
          <div className="top">
            <h1 className="text-center text-3xl mb-5 max-sm:text-2xl">
              {t("largestCollections.title")}
            </h1>
          </div>
          <div className="center py-4">
            <div className="cards flex w-full justify-between flex-wrap gap-3">
              {data?.map((item, id) => (
                <Card2
                  key={id}
                  title={item.name}
                  img={item?.image?.url || noImage}
                  collectionLink={`/collection/${item._id}`}
                  volume={item.volume}
                />
              ))}
            </div>
          </div>
          <div className="bottom mt-6 flex items-center justify-center">
            <Link to={routes.ALL_COLLECTIONS}>
              <button className="px-4 py-3 text-white dark:text-black bg-green-500 dark:bg-white rounded-md uppercase max-sm:text-sm">
                {t("allCollections")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LargestCollections;
