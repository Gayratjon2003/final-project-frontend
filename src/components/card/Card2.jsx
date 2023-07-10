import React from "react";
import { Link } from "react-router-dom";
import millify from "millify";
import { useTranslation } from "react-i18next";

const Card2 = ({ collectionLink, img, title, volume }) => {
  const { t } = useTranslation();
  return (
    <div className="card flex items-center flex-col min-w-[160px] max-sm:w-full">
      <div className="top p-3">
        <img
          src={img}
          alt={title}
          className="w-[150px] h-[150px] object-cover rounded-md"
        />
      </div>
      <div className="center text-center">
        <h1 className="text-xl">{title}</h1>
        <span className="py-2">{t("largestCollections.volume")}</span>
        <h3 className="text-xl">{millify(volume, { precision: 2 })}</h3>
        <Link to={collectionLink}>
          <button className="px-4 py-2 bg-green-500 rounded-md dark:bg-white mt-2 text-white dark:text-black max-sm:text-sm">
            {t("largestCollections.view")}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Card2;
