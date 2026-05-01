import { getPages } from "../lib/utils.js";

export function initPagination(elements, createPage) {
  const { pages, fromRow, toRow, totalRows } = elements;

  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount = 1;
  let currentPage = 1;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;

    currentPage = state.page || currentPage;

    if (action) {
      switch (action.name) {
        case "prev":
          currentPage = Math.max(1, currentPage - 1);
          break;
        case "next":
          currentPage = Math.min(pageCount, currentPage + 1);
          break;
        case "first":
          currentPage = 1;
          break;
        case "last":
          currentPage = pageCount;
          break;
      }
    }

    return {
      ...query,
      limit,
      page: currentPage,
    };
  };

  const updatePagination = (total, state) => {
    const limit = state.rowsPerPage;
    pageCount = Math.max(1, Math.ceil(total / limit));

    currentPage = Math.min(currentPage, pageCount);

    const visiblePages = getPages(currentPage, pageCount, 5);

    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === currentPage);
      }),
    );

    fromRow.textContent = total === 0 ? 0 : (currentPage - 1) * limit + 1;
    toRow.textContent = Math.min(currentPage * limit, total);
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
}