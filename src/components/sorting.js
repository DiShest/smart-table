import { sortMap } from "../utils/sortMap.js";

export function initSorting(columns) {
  let field = null;
  let order = "none";

  return (data, state, action) => {
    if (action?.dataset?.field) {
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;
    }

    columns.forEach((column) => {
      if (column.dataset.field !== action?.dataset?.field) {
        column.dataset.value = "none";
      }
    });

    columns.forEach((column) => {
      if (column.dataset.value !== "none") {
        field = column.dataset.field;
        order = column.dataset.value;
      }
    });

    if (field && order !== "none") {
      return [...data].sort((a, b) => {
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        return 0;
      });
    }

    return data;
  };
}
