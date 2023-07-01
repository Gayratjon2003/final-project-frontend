export const renderHTMLCell = (html) => {
  return (
    <div
      className="dark:text-white"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
