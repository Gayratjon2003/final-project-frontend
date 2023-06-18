import React from "react";
import { Card } from "../index";
import img from "../../assets/images/book.png";
import { useTranslation } from "react-i18next";

const arr = [
  {
    id: 1,
    title: "Basic Javascript",
    author: "George Alan",
    user: "G'ayratjon",
    createdAt: "20.05.2023",
    img,
  },
  {
    id: 2,
    title: "Basic Javascript",
    author: "George Alan",
    user: "G'ayratjon",
    createdAt: "20.05.2023",
    img,
  },
  {
    id: 3,
    title: "Basic Javascript",
    author: "George Alan",
    user: "G'ayratjon",
    createdAt: "20.05.2023",
    img,
  },
];
const LatestItems = () => {
  const { t } = useTranslation();

  return (
    <section className="latestItems w-full py-20 bg-white dark:bg-black">
      <div className="container">
        <div className="latestItems-box">
          <div className="top">
            <h1 className="text-center text-3xl mb-5">
              {t("latestItems.title")}
            </h1>
          </div>
          <div className="center py-4">
            <div className="cards flex w-full justify-between">
              {arr?.map((item) => (
                <Card
                  title={item.title}
                  author={item.author}
                  img={item.img}
                  user={item.user}
                  createdAt={item.createdAt}
                  key={item.id}
                  itemLink={`/item/${item.id}`}
                  collectionLink={`/collection/${item.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestItems;
