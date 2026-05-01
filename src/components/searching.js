export function initSearching(elements, searchField) {

  const applySearching = (query, state) => {

    if (!state[searchField]) {
      return query;
    }

    return Object.assign({}, query, {
      search: state[searchField]
    });

  };

  return applySearching;

}