import { cloneTemplate } from "../lib/utils.js";

export function initTable({ before = [], after = [] }) {
  const root = cloneTemplate("table");

  before.slice().reverse().forEach((name) => {
    root[name] = cloneTemplate(name);
    root.container.prepend(root[name].container);
  });

  after.forEach((name) => {
    root[name] = cloneTemplate(name);
    root.container.append(root[name].container);
  });

  const rowTemplate = "row";

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

      root.elements.rows.replaceChildren(...rows);
    },
  };
}