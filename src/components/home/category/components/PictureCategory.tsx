const PictureCategory = () => {
  const image: { image: string }[] = [
    {
      image: "/images/samsung-galaxy-m55-5g-8gb-256gb.webp",
    },
    {
      image: "/images/690x300-rightbanner-1.webp",
    },
    {
      image: "/images/690x300-rightbanner-2.webp",
    },
  ];
  return (
    <>
      <div className="md:flex flex-col rounded-lg overflow-hidden h-full hidden gap-2">
        {image.map((item, index) => (
          <img
            key={index}
            src={item.image}
            className="h-60 w-full cursor-pointer rounded-2xl"
            alt=""
          />
        ))}
      </div>
    </>
  );
};

export default PictureCategory;
