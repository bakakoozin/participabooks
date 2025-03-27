export function scrollSlider(sliderRef, direction) {
  if (!sliderRef?.current) return;
  const articleWidth =
    sliderRef.current.querySelector(".work-card").clientWidth;
  const scrollAmount = articleWidth + 20; // 20px est la valeur de gap entre les articles
  sliderRef.current.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
}
