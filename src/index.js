import Table from "./table.js";

// TODO: Date range fetch + Date pickers
export async function start() {
  const list = await getData();
  const table = new Table();

  table.data(list);
  table.mount(document.body);
}

function getData() {
  console.log("fetching data…");
  return fetch(`/data/0/${Date.now()}`).then(res => res.json(), console.error);
}
