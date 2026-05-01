import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

import { initData } from "./data.js";

const api = initData();

const sampleTable = initTable({
  before: ["search", "header", "filter"],
  after: ["pagination"],
});

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

const { applyPagination, updatePagination } = initPagination(
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

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching(sampleTable.search.elements, "search");

function collectState(form) {
  const formData = new FormData(form);
  const state = Object.fromEntries(formData.entries());

  const rowsPerPage = Number(state.rowsPerPage) || 10;
  const page = Number(state.page) || 1;

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

async function render(action) {

  let state = collectState(sampleTable.container);
  let query = {};

  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action);

  const { total, items } = await api.getRecords(query);

  sampleTable.update(items);
  updatePagination(total, state, action);

}

sampleTable.container.addEventListener("change", () => {
  render();
});

sampleTable.container.addEventListener("reset", () => {
  setTimeout(() => {
    render();
  });
});

sampleTable.container.addEventListener("submit", (e) => {
  e.preventDefault();
  render(e.submitter);
});

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(() => render());