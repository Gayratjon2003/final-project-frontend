import React from "react";
import { Card2 } from "../index";
import img from "../../assets/images/book.png";
import { useTranslation } from "react-i18next";

const arr = [
  {
    id: 1,
    title: "Basic Javascript",
    volume: 1255,
    img,
  },
  {
    id: 2,
    title: "Basic Javascript",
    volume: 1255,
    img,
  },
  {
    id: 3,
    title: "Basic Javascript",
    volume: 1255,
    img,
  },
  {
    id: 4,
    title: "Basic Javascript",
    volume: 1255,
    img,
  },
  {
    id: 5,
    title: "Basic Javascript",
    volume: 1255,
    img,
  },
];
const LargestCollections = () => {
  const { t } = useTranslation();

  return (
    <section className="largestCollections w-full bg-white dark:bg-black">
      <div className="container">
        <div className="largestCollections-box">
          <div className="top">
            <h1 className="text-center text-3xl mb-5">{t("largestCollections.title")}</h1>
          </div>
          <div className="center py-4">
            <div className="cards flex w-full justify-between">
              {arr?.map((item, id) => (
                <Card2
                  key={id}
                  title={item.title}
                  img={item.img}
                  collectionLink={`/collection/${item.id}`}
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
