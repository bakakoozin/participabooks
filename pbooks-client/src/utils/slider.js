export function scrollSlider(sliderRef, direction) {
  if (!sliderRef?.current) return;
  const firstChild = sliderRef.current.firstElementChild;
  if (!firstChild) return;

  const articleWidth = firstChild.clientWidth;
  const scrollAmount = articleWidth + 20; // ajuster si nécessaire

  sliderRef.current.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
}
