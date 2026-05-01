import { makeIndex } from "./lib/utils.js";

const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  const getIndexes = async () => {
    if (!sellers || !customers) {
      const [rawSellers, rawCustomers] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((res) => res.json()),
        fetch(`${BASE_URL}/customers`).then((res) => res.json()),
      ]);

      sellers = Array.isArray(rawSellers)
        ? makeIndex(rawSellers, "id", (v) => `${v.first_name} ${v.last_name}`)
        : rawSellers;

      customers = Array.isArray(rawCustomers)
        ? makeIndex(rawCustomers, "id", (v) => `${v.first_name} ${v.last_name}`)
        : rawCustomers;
    }

    return { sellers, customers };
  };

  const getRecords = async (query = {}, isUpdated = false) => {
    await getIndexes();

    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);

    if (!response.ok) {
      return {
        total: 0,
        items: [],
      };
    }

    const records = await response.json();

    lastQuery = nextQuery;
    lastResult = {
      total: records.total,
      items: mapRecords(records.items || []),
    };

    return lastResult;
  };

  return {
    getIndexes,
    getRecords,
  };
}