import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-black h-[80px] border-t-[1px] border-green-500">
      <div className="container">
        <div className="footer-box flex justify-center items-center h-[80px]">
          <p className="text-black ">
            {t("footer.title")}{" "}
            <Link
              className="underline text-blue-500"
              to="https://www.gayratjon.uz"
            >
              G'ayratjon Abdijobborov
            </Link>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
