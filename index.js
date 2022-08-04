const get = (el) => document.querySelector(el);
const getAll = (el) => document.querySelectorAll(el);

const local = window.localStorage;
const carList = JSON.parse(local.getItem("carList")) || [];

let carId;

const $blackWindow = get(".black__screen");
const $carInfoPanel = get(".car__info__panel");
const $carList = get(".car__list ul");

const saveData = () => {
  local.setItem("carList", JSON.stringify(carList));
  writeCarList();
};

const panelOutCarBtn = () => {
  carList.splice(carId, 1);
  $blackWindow.classList.add("hidden");
  $carInfoPanel.classList.add("hidden");
  saveData();
};

const panelCancelBtn = () => {
  $blackWindow.classList.add("hidden");
  $carInfoPanel.classList.add("hidden");
};

const panelBtnEvent = () => {
  const $outCarBtn = get(".outCar__button");
  const $inCancelBtn = get(".cancel__button");
  $outCarBtn.addEventListener("click", panelOutCarBtn);
  $inCancelBtn.addEventListener("click", panelCancelBtn);
};

const openCarPanel = (id) => {
  const $carInfoList = get(".car__info__list");
  $blackWindow.classList.remove("hidden");
  $carInfoPanel.classList.remove("hidden");

  const curCar = carList[id];
  const carTime = new Date(curCar.inCarTime);
  const curTime = new Date();
  const inCarTime =
    carTime.getHours() + ":" + (carTime.getMinutes() < 5 ? "0" + carTime.getMinutes() : carTime.getMinutes());
  const outCarTime =
    curTime.getHours() + ":" + (curTime.getMinutes() < 5 ? "0" + curTime.getMinutes() : curTime.getMinutes());
  let parkingTime = curTime.getHours() * 60 + curTime.getMinutes() - (carTime.getHours() * 60 + carTime.getMinutes());
  let parkingMoney = 0;

  if (5 > parkingTime) parkingMoney = 0;
  else if (5 <= parkingTime && parkingTime <= 30) parkingMoney = 3000;
  else if (parkingTime >= 30 && parkingTime < 300) parkingMoney = Math.ceil(parkingTime / 10) * 1000;
  else if (parkingTime >= 300) parkingMoney = 30000;

  let str = `
  <div><span>차량번호:</span><span>${curCar.carNumber}</span></div>
  <div><span>입차시간:</span><span>${inCarTime}</span></div>
  <div><span>출차시간:</span><span>${outCarTime}</span></div>
  <div><span>총 주차시간:</span><span>${parkingTime}분</span></div>
  <div><span>요금:</span><span>${parkingMoney}원</span></div>`;

  $carInfoList.innerHTML = str;

  carId = id;
};

const clickCarList = () => {
  $carList.addEventListener("click", (e) => {
    if (e.target.className !== "car__list__car") return;
    const id = e.target.dataset.id;
    openCarPanel(id);
  });
};

const writeCarList = () => {
  let str = "";
  carList.map((el, i) => {
    str += `<li class="car__list__car" data-id=${i}>${el.carNumber}</li>`;
  });
  $carList.innerHTML = str;
};

const getCar = () => {
  const date = new Date();
  const carNumber = get(".enter__car__input").value;
  if (carNumber === "") return;
  const inCarTime = date;
  let car = { carNumber, inCarTime };
  carList.push(car);
  saveData();
  get(".enter__car__input").value = "";
};

const getCarClickButton = (e) => {
  const target = e.target.className;
  if (target !== "enter__car__button") return;
  getCar();
};

const getCarEnter = (e) => {
  if (e.key !== "Enter") return;
  getCar();
};

const getCarEvent = () => {
  const $enterCarBtn = get(".enter__car__button");
  $enterCarBtn.addEventListener("click", (e) => {
    getCarClickButton(e);
  });
  document.addEventListener("keydown", (e) => {
    getCarEnter(e);
  });
};
const init = () => {
  writeCarList();
  getCarEvent();
  clickCarList();
  panelBtnEvent();
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
