import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { done, start } from "../store/loaderSlice";
import axios from "axios";
import { GET_COLLECTION } from "../constant";
import { Card2 } from "./index";
import noImage from "../assets/images/no-image.jpg";
import { Pagination, PaginationItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const AllCollections = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, selectedPage) => {
    setCurrentPage(selectedPage);
  };
  const getData = async () => {
    dispatch(start());
    try {
      const { data: data1 } = await axios({
        method: "get",
        url: `${GET_COLLECTION}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {},
      });
      if (Array.isArray(data1) && data1?.length !== 0) {
        setItems(data1);
      }
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
    <section className="pt-20">
      <div className="container">
        <div className="All-items-box">
          <div className="top">
            <h1 className="text-center my-6 text-3xl max-sm:text-2xl">{t("allCollections")}</h1>
          </div>
          <div className="center">
            <div className="cards flex w-full justify-between flex-wrap gap-3">
              {currentItems?.map((item, id) => (
                <Card2
                  key={id}
                  title={item?.name}
                  img={item?.image?.url || noImage}
                  collectionLink={`/collection/${item._id}`}
                  volume={item.volume}
                />
              ))}
            </div>
          </div>
          <div className="bottom flex justify-center items-center my-10">
            <Pagination
              count={Math.ceil(items.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              className="pagination"
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  className={`text-black dark:text-white ${
                    item.selected ? "dark:!bg-white !text-black" : ""
                  }`}
                />
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCollections;
