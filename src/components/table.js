import { cloneTemplate } from "../utils/cloneTemplate.js";

export function initTable({ before = [], after = [] }) {
  const root = cloneTemplate("table");

  const rowTemplate = root.elements.row;
  const data = [];

  return {
    ...root,
    update(nextData) {
      const rows = nextData.map((item) => {
        const row = cloneTemplate(rowTemplate);

        Object.keys(item).forEach((key) => {
          if (row.elements[key]) {
            row.elements[key].textContent = item[key];
          }
        });

        return row.container;
      });

      root.elements.body.replaceChildren(...rows);
    },
  };
}
