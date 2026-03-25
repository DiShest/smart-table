import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";
import { data, indexes } from "./data.js";

const sampleTable = initTable({
  before: ["search", "header", "filter"],
  after: ["pagination"],
});

const applyPagination = initPagination(
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");

    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;

    return el;
  },
);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
  searchBySeller: indexes.sellers,
});

const applySearching = initSearching(sampleTable.search.elements, "search");

function collectState(form) {
  const formData = new FormData(form);
  const state = Object.fromEntries(formData.entries());

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

function render(state, action) {
  let result = data;

  result = applySearching(result, state);
  result = applyFiltering(result, state);
  result = applySorting(result, state, action);
  result = applyPagination(result, state);

  sampleTable.update(result);
}

sampleTable.root.container.addEventListener("change", () => {
  const state = collectState(sampleTable.root.container);
  render(state);
});

sampleTable.root.container.addEventListener("reset", () => {
  setTimeout(() => {
    const state = collectState(sampleTable.root.container);
    render(state);
  });
});

sampleTable.root.container.addEventListener("submit", (e) => {
  e.preventDefault();
  const state = collectState(sampleTable.root.container);
  render(state, e.submitter);
});

render({ rowsPerPage: 10, page: 1 });
