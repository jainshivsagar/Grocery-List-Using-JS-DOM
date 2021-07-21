removeElements();
displayData();

document.getElementById("form1").addEventListener("submit", addItem);

localStorage.counter =
  typeof localStorage.counter === "undefined" ? 0 : localStorage.counter;

function getCounter(x) {
  return function () {
    x = x + 1;
    return x;
  };
}

const counter = getCounter(parseInt(localStorage.counter));

function removeElements() {
  let table = document.getElementById("table1");
  let rows = document.querySelectorAll("tr");
  rows.forEach((element, i) => {
    if (i == 0) {
    } else {
      element.remove();
    }
  });
}
function editBtnClickHandler(e) {
  if (e.target.textContent === "Edit") {
    e.target.parentElement.parentElement.childNodes[0].contentEditable = true;
    e.target.parentElement.parentElement.childNodes[1].contentEditable = true;
    e.target.parentElement.parentElement.childNodes[2].contentEditable = true;
    e.target.textContent = "Save";
  } else {
    e.target.parentElement.parentElement.childNodes[0].contentEditable = false;
    e.target.parentElement.parentElement.childNodes[1].contentEditable = false;
    e.target.parentElement.parentElement.childNodes[2].contentEditable = false;

    let itemId = e.target.parentElement.parentElement.childNodes[6].textContent;
    let item = JSON.parse(localStorage.getItem(itemId));

    item.name = e.target.parentElement.parentElement.childNodes[0].textContent;
    item.unit = parseInt(
      e.target.parentElement.parentElement.childNodes[1].textContent
    );
    item.pricePerUnit = parseInt(
      e.target.parentElement.parentElement.childNodes[2].textContent
    );

    let oldTotal = item.total;
    item.total = item.unit * item.pricePerUnit;
    localStorage.setItem(itemId, JSON.stringify(item));
    console.log(item);

    let diff = item.total - oldTotal;
    let grandTotal = document.getElementById("grandTotal");

    e.target.parentElement.parentElement.childNodes[3].textContent = item.total;
    grandTotal.textContent = parseInt(grandTotal.textContent) + diff;
    e.target.textContent = "Edit";
  }
}
function deleteBtnClickHandler(e) {
  let itemId = e.target.parentElement.parentElement.childNodes[6].textContent;
  let tr = e.target.parentElement.parentElement;

  let itemTotal = JSON.parse(localStorage[itemId]).total;
  let grandTotal = document.getElementById("grandTotal");

  grandTotal.textContent = parseInt(grandTotal.textContent) - itemTotal;
  localStorage.removeItem("" + itemId);

  if (localStorage.length < 2) {
    localStorage.counter = 0;
  }

  tr.remove();
}

function displayData() {
  if (typeof localStorage !== "undefined") {
    let rows = [];
    let grandTotal = 0;
    let itemIds = [];
    for (let p in localStorage) {
      if (!parseInt(p)) {
        //Escape The Strings
        continue;
      }
      itemIds.push(p);
    }
    itemIds.sort();
    itemIds.forEach((id) => {
      let item = JSON.parse(localStorage[id]);
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      let td4 = document.createElement("td");
      let td5 = document.createElement("td");
      let td6 = document.createElement("td");
      let td7 = document.createElement("td"); //For Storing id Of Id;

      td1.textContent = item.name;
      td2.textContent = item.unit;
      td3.textContent = item.pricePerUnit;
      td4.textContent = item.total;
      let editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", editBtnClickHandler);

      let deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", deleteBtnClickHandler);

      td5.appendChild(editBtn);
      td5.classList.add("editTD");
      td6.appendChild(deleteBtn);
      td6.classList.add("deleteTD");
      td7.textContent = item.id;
      td7.style.display = "none";

      grandTotal += item.total;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      tr.appendChild(td7);

      rows.push(tr);
    });

    let table = document.getElementById("table1");
    let tbody = document.querySelector("tbody");

    rows.forEach((row) => {
      tbody.appendChild(row);
    });

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.setAttribute("colspan", 3);
    td1.style.textAlign = "right";
    td1.style.fontWeight = 900;
    td1.style.paddingRight = "20px";
    td1.textContent = "Grand Total:-";

    td2.style.textAlign = "center";
    td2.textContent = grandTotal;
    td2.id = "grandTotal";

    tr.classList.add("grandTotalRow");
    tr.appendChild(td1);
    tr.appendChild(td2);

    tbody.appendChild(tr);

    table.appendChild(tbody);
  } else {
    alert(
      "There is no items in your local storage. Your browser don't support local storage."
    );
  }
}

function addItem(e) {
  e.preventDefault();

  let { itemName, units, price } = e.target.elements;
  itemName = itemName.value;
  units = units.value;
  price = price.value;
  let total = units * price;
  if (typeof localStorage !== "undefined") {
    let item = {
      id: counter(),
      name: itemName,
      unit: units,
      pricePerUnit: price,
      total: total,
    };

    localStorage["" + item.id] = JSON.stringify(item);

    localStorage.counter = item.id;
    removeElements();
    displayData();
  } else {
    alert("You can't Add Items. Your browser don't support local storage.");
  }
  return false;
}
