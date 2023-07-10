import React, { useEffect, useState } from "react";
import { DashboardItems } from "../../components";
import { useDispatch } from "react-redux";
import { GET_COLLECTION } from "../../constant";
import axios from "axios";
import { useParams } from "react-router-dom";
import { start, done } from "../../store/loaderSlice";
import noImage from "../../assets/images/no-image.jpg";
import { useTranslation } from "react-i18next";
import { convertTimestamp } from "../../utils/convertTimestamp";
import i18n from "../../i18n";
import { renderHTMLCell } from "../../utils/renderHTMLCell";

const Collection = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_COLLECTION}/${id}`,
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
  }, [id]);
  return (
    <div className="collection bg-white dark:bg-black pt-20">
      <div className="container">
        <div className="collection-box">
          <div className="top my-10">
            <div className="w-full h-[300px] relative">
              <img
                src={data?.image?.url || noImage}
                alt=""
                className={
                  data?.image
                    ? "w-full h-full object-cover rounded-md"
                    : "w-full h-full object-contain rounded-md"
                }
              />
              <div className="absolute top-2 left-2 z-10">
                <p className="px-2 py-1 bg-white dark:bg-black rounded-md">
                  {t("author")}: {data?.addedBy?.name}
                </p>
              </div>
              <div className="absolute top-2 right-2 z-10 max-sm:top-11">
                <p className="px-2 py-1 bg-white dark:bg-black rounded-md">
                  {t("createdOn")}: {convertTimestamp(data?.publishedAt)}
                </p>
              </div>
            </div>
          </div>
          <div className="center flex justify-center items-center flex-col">
            <h1 className="text-4xl my-3">{data?.name}</h1>
            <span className="py-2">
              {t("category")}: {data?.category?.name[i18n.language]}{" "}
            </span>
            {renderHTMLCell(data?.description)}
          </div>
          <div className="bottom my-12">
            <DashboardItems id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
