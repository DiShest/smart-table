import { getPages } from "../utils/getPages.js";

export function initPagination(elements, createPage) {
  const { pages, fromRow, toRow, totalRows } = elements;

  const pageTemplate = pages.firstElementChild;
  pages.firstElementChild.remove();

  return (data, state) => {
    const rowsPerPage = state.rowsPerPage;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    let page = state.page;

    const skip = (page - 1) * rowsPerPage;
    const result = data.slice(skip, skip + rowsPerPage);

    const visiblePages = getPages(page, pageCount);

    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    fromRow.textContent = (page - 1) * rowsPerPage + 1;
    toRow.textContent = Math.min(page * rowsPerPage, data.length);
    totalRows.textContent = data.length;

    return result;
  };
}
