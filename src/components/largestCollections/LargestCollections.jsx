import React, { useEffect, useState } from "react";
import { Card2 } from "../index";
import { useTranslation } from "react-i18next";
import noImage from "../../assets/images/no-image.jpg";
import axios from "axios";
import { GET_LATEST_COLLECTIONS } from "../../constant";
import { useDispatch } from "react-redux";
import { start, done } from "../../store/loaderSlice";

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
            <h1 className="text-center text-3xl mb-5">
              {t("largestCollections.title")}
            </h1>
          </div>
          <div className="center py-4">
            <div className="cards flex w-full justify-between">
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
        </div>
      </div>
    </section>
  );
};

export default LargestCollections;
