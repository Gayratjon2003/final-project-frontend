import React from "react";
const tags = ["Book", "Clothes", "Adabiyot", "Klassika", "Unniversity"];
const Tags = () => {
  const handleClick = (tag) => {
    console.log(tag);
  };
  return (
    <section className="tags w-full bg-white dark:bg-black pt-20">
      <div className="container">
        <div className="tags-box border-t-[1px] border-gray-500">
          <div className="flex items-center justify-center gap-x-3 flex-wrap gap-y-3 mt-20 pb-20">
            {tags.map((item, id) => (
              <p
                className="px-4 py-[5px] bg-blue-500 rounded-full cursor-pointer dark:bg-white dark:text-black"
                key={id}
                onClick={() => handleClick(item)}
              >
                #{item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tags;
