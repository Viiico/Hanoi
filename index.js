const start = document.getElementById("start");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
const howManyDisks = document.getElementById("howManyDisks");
const lContent = document.getElementById("lStock");
const mContent = document.getElementById("mStock");
const rContent = document.getElementById("rStock");
let number = 0;
let time = 0;
// This will be incremented -> it wills be used to see if user's input is even or not to know if disk should be picked or put
let checkInput = 0;
let from = null;
let counter = 0;

class Stock {
  constructor() {
    this.disks = [];
  }
  getLastSize() {
    return this.disks.length ? this.disks[0].size : 1000;
  }
}
class Disk {
  constructor(size, numer) {
    this.size = size;
    this.numer = numer;
  }
}

let lStock = new Stock();
let mStock = new Stock();
let rStock = new Stock();

const counterUp = (reset = false) => {
  if (reset) {
    counter = 0;
  } else counter++;
  document.getElementById("counter").innerHTML = counter;
};
const timeUp = async (reset = false) => {
  if (reset) {
    time = 0;
    timer.innerHTML = "0";
  } else if (counter != 0) {
    if (++time < 60) {
      timer.innerHTML = time % 60;
    } else {
      timer.innerHTML = `${parseInt(time / 60)}:${time % 60}`;
    }
  }
};

const checkForWin = () => {
  if (rStock?.disks?.length == number) {
    let instance = M.Modal.getInstance(document.getElementById("modalWin"));
    document.getElementById("numberOfMoves").innerHTML = counter;
    document.getElementById("minimalMoves").innerHTML = 2 ** number - 1;
    instance.open();
  }
};

const clearStocks = (reset = false) => {
  let disks = document.getElementsByClassName("disk");
  while (disks.length > 0) {
    disks[0].parentNode.removeChild(disks[0]);
  }
  if (reset) {
    lContent.parentNode.removeEventListener("click", getInput);
    mContent.parentNode.removeEventListener("click", getInput);
    rContent.parentNode.removeEventListener("click", getInput);
    for (marked of document.getElementsByClassName("mark")) {
      marked.classList.remove("mark");
    }
    lStock.disks = [];
    mStock.disks = [];
    rStock.disks = [];
  }
};
const generateStocks = (number) => {
  number = parseInt(number);
  for (i = number; i > 0; i--) {
    let margin = 100 - (70 / number) * (i - 1);
    lStock.disks.push(new Disk(margin, number - i + 1));
  }
};

const renderStock = (stock) => {
  let which = document.getElementById(stock);
  stock = targets[stock].disks;
  let disks = [];
  for (i = 0; i < number - stock.length; i++) {
    let fillerDisk = document.createElement("div");
    fillerDisk.className = "disk filler-disk";
    fillerDisk.style.height = `${100 / number}%`;
    fillerDisk.style.width = "100%";
    which.appendChild(fillerDisk);
  }
  for (i = 0; i < stock.length; i++) {
    let newDisk = document.createElement("div");
    newDisk.className = "disk valign-wrapper flow-text";
    newDisk.style.height = `${100 / number}%`;
    newDisk.style.width = `${stock[i].size}%`;
    newDisk.innerHTML = `<p class="center=block">${stock[i].numer}</p>`;
    which.appendChild(newDisk);
  }
};

const renderStocks = () => {
  renderStock("lStock");
  renderStock("mStock");
  renderStock("rStock");
};

const targets = {
  lStock: lStock,
  mStock: mStock,
  rStock: rStock,
};
const getInput = (input) => {
  let target = input.currentTarget.children[1].id;
  let stock = targets[target];
  let mark = document.getElementById(from)?.parentNode;
  if (checkInput++ % 2 == 0) {
    if (stock.disks?.length) {
      from = target;
      mark = document.getElementById(from)?.parentNode;
      mark.classList.add("mark");
    } else checkInput--;
  } else {
    if (stock.getLastSize() >= targets[from].getLastSize()) {
      mark.classList.remove("mark");
      stock.disks = [targets[from].disks.shift(), ...stock.disks];
      clearStocks();
      renderStocks();
      if (stock.getLastSize() != targets[from].getLastSize()) counterUp();
      checkForWin();
    }
  }
};

const startGame = () => {
  resetGame();
  number = howManyDisks.value;
  if (number > 20) number = 20;
  generateStocks(number);
  renderStocks();
  lContent.parentNode.addEventListener("click", getInput);
  mContent.parentNode.addEventListener("click", getInput);
  rContent.parentNode.addEventListener("click", getInput);
};

const resetGame = () => {
  number = 0;
  time = 0;
  checkInput = 0;
  from = null;
  counterUp(true);
  clearStocks(true);
  timeUp(true);
  let instance = M.Modal.getInstance(document.getElementById("modalStart"));
  instance.open();
};

start.addEventListener("click", startGame);
reset.addEventListener("click", resetGame);

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

setInterval(timeUp, 1000);
