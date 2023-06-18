import React from "react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="pt-20 bg-red-500 hero">
      <div className="container">
        <div className="hero-box flex justify-center items-center w-full pb-20 flex-col">
          <div className="opacity-95">
            <p className="text-2xl text-center font-bold">
              {t("hero.title1")} <span className="text-4xl">Collections Manager</span>
              {t("hero.title2")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
