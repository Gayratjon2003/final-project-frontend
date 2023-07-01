import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_ITEMS } from "../../constant";
import { Card } from "../index";
import noImage from "../../assets/images/no-image.jpg";
import { convertTimestamp } from "../../utils/convertTimestamp";
import { useTranslation } from "react-i18next";

const SearchResult = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_ITEMS}?search=${id}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      setData(data1);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, [id]);
  return (
    <section className="search-result pt-20">
      <div className="container">
        <div className="search-result-box">
          <h1 className="text-3xl text-center mt-10 mb-4">{t("results")}</h1>
          <div className="cards flex w-full justify-center flex-wrap gap-4">
            {data?.map((item) => (  
              <Card
                title={item.name}
                author={item?.author || "Author"}
                img={item?.image?.url || noImage}
                addedBy={item.addedBy.name}
                createdAt={convertTimestamp(item.publishedAt)}
                key={item._id}
                itemLink={`/item/${item._id}`}
                collectionLink={`/collection/${item.collections._id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchResult;
