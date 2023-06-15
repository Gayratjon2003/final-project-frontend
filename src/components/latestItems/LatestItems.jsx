import React from "react";
import { Card } from "../index";
const LatestItems = () => {
  return (
    <section className="latestItems w-full my-20">
      <div className="container">
        <div className="latestItems-box">
          <div className="top">
            <h1 className="text-center text-3xl">Latest Items</h1>
          </div>
          <div className="center">
            <Card />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestItems;
