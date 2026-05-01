export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const option = document.createElement("option");
          option.textContent = name;
          option.value = name;
          return option;
        }),
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    if (action?.name === "clear") {
      const field = action.parentElement.querySelector("input, select");

      if (field) {
        field.value = "";
        state[action.dataset.field] = "";
      }
    }

    const filter = {};

    Object.keys(elements).forEach((key) => {
      const element = elements[key];

      if (
        element &&
        ["INPUT", "SELECT"].includes(element.tagName) &&
        element.name &&
        element.value
      ) {
        filter[`filter[${element.name}]`] = element.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}