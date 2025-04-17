export function getPage(req) {
  const { page } = req.query;
  const pageNumber = parseInt(page, 10);
  if (isNaN(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return pageNumber;
}
