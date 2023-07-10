import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Card = ({
  itemLink,
  collectionLink,
  img,
  title,
  author,
  addedBy,
  createdAt,
}) => {
  const { t } = useTranslation();
  return (
    <div className="card flex min-w-[350px] w-[32%] shadow-cardLight dark:shadow-cardDark">
      <div className="left overflow-hidden">
        <Link to={itemLink}>
          <img
            src={img}
            alt={title}
            className="w-[180px] min-h-[180px] max-h-[200px] object-cover"
          />
        </Link>
      </div>

      <div className="right w-1/2">
        <div className="px-5 py-4 flex justify-between flex-col h-full">
          <div>
            <h1 className="text-2xl leading-[26px]">{title} </h1>
            <Link
              to={collectionLink}
              className="text-base text-green-500 my-2 block"
            >
              {author}
            </Link>
          </div>
          <div>
            <p>
              {t("latestItems.addedBy")} {addedBy}
            </p>
            <p>
              {t("latestItems.on")} <code> {createdAt}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
