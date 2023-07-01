import React from "react";
import { Hero, LatestItems, LargestCollections, Tags } from "../index";
const Home = () => {
  return (
    <main>
      <Hero />
      <LatestItems />
      <LargestCollections />
      <Tags />
    </main>
  );
};

export default Home;
