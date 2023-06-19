import React from "react";
import { Navbar, Hero, LatestItems, LargestCollections, Tags, Footer } from "../index";
const Home = () => {
  return (
    <main>
      {/* <Navbar /> */}
      <Hero />
      <LatestItems />
      <LargestCollections />
      <Tags />
      {/* <Footer /> */}
    </main>
  );
};

export default Home;
