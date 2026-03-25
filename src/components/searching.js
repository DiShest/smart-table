import { createComparison } from "../utils/createComparison.js";
import { rules } from "../utils/rules.js";

export function initSearching(elements, searchField) {
  const compare = createComparison(
    { skipEmptyTargetValues: true },
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false,
    ),
  );

  return (data, state) => {
    return data.filter((row) => compare(row, state));
  };
}
