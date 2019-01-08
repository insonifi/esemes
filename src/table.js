import el from "./el.js";

export default class Table {
  constructor() {
    this.element = document.createElement("div");
    this.mounted = false;
    this.handleClickSort = this.handleClickSort.bind(this);
  }
  data(list) {
    this.data = list;
    this.render();
  }
  handleClickSort(e) {
    const sortKey = e.target.getAttribute("sort");

    if (sortKey) {
      this.sortBy(sortKey);
    }
  }
  mount(elem) {
    elem.appendChild(this.element);
    this.mounted = true;
    this.render();
  }
  // TODO: type-specific sort
  sortBy(key) {
    console.log("sorting by %s", key);
    this.sortKey = key;
    this.data.sort((item1, item2) =>
      item1[key].toString().localeCompare(item2[key].toString().toLowerCase())
    );
    this.render();
  }
  // TODO: Virtual Scroll or paging
  render() {
    if (!this.mounted) {
      return;
    }
    console.log("rendering table");
    this.element.innerHTML = "";

    const c = document.createTextNode(JSON.stringify(this.data, null, 4));
    const table = el("table", {});
    const thead = el("thead", {});
    const th = el("th");
    const tbody = el("tbody", {});
    const tr = el("tr", {});
    const td = el("td", {});
    const tdStat = el("td");
    const { color, ...colNames } = this.data[0];

    const content = table([
      thead(
        tr(
          Object.keys(colNames).map(name =>
            th(
              {
                class: [
                  "header__name",
                  this.sortKey === name ? "sorting" : ""
                ].join(" "),
                sort: name
              },
              name.toUpperCase()
            )
          )
        )
      ),
      tbody(
        this.data.map(({ color, ...rest }) =>
          tr([
            ...Object.values(rest).map(td),
            tdStat({ style: `color: ${color}` }, "◼")
          ])
        )
      )
    ]);

    content.addEventListener("click", this.handleClickSort);

    this.element.appendChild(content);
  }
}
