import React from "react";

const Hero = () => {
  return (
    <section className="pt-20 bg-red-500 hero">
      <div className="container">
        <div className="hero-box flex justify-center items-center w-full pb-20 flex-col">
          <div className="opacity-95">
            <p className="text-2xl text-center font-bold">
              Welcome to <span className="text-4xl">Collections Manager</span>,
              the website of a friendly and reliable of books and post-stamps.
              Whether you are looking for a new adventure, a classic story, or a
              rare treasure, you will find something to suit your taste and
              budget here. Browse through our collection of new and used books
              and post-stamps in various genres and themes, from fiction and
              non-fiction to history and art. You can also search by author,
              title, or keyword to find exactly what you are looking for.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
