const get = (el) => document.querySelector(el);
const getAll = (el) => document.querySelectorAll(el);

const local = window.localStorage;
const carList = JSON.parse(local.getItem("carList")) || [];

const $blackWindow = get(".black__screen");
const $carInfoPanel = get(".car__info__panel");

const saveData = () => {
  local.setItem("carList", JSON.stringify(carList));
};

const closePanel = (id) => {
  document.addEventListener("click", (e) => {
    if (!e.target.className.includes("panel__button")) return;

    if (e.target.className.includes("outCar__button")) {
      carList.splice(carList.indexOf(id), 1);
      $blackWindow.classList.add("hidden");
      $carInfoPanel.classList.add("hidden");
      saveData();
    } else if (e.target.className.includes("cancel__button")) {
      $blackWindow.classList.add("hidden");
      $carInfoPanel.classList.add("hidden");
    }
  });
};

const openCarPanel = (id) => {
  const $carInfoList = get(".car__info__list");
  $blackWindow.classList.remove("hidden");
  $carInfoPanel.classList.remove("hidden");

  const curCar = carList[id];
  const carTime = new Date(curCar.inCarTime);
  const curTime = new Date();
  const inCarTime = carTime.getHours() + ":" + carTime.getMinutes();
  const outCarTime = curTime.getHours() + ":" + curTime.getMinutes();
  let parkingTime = curTime.getHours() * 60 + curTime.getMinutes() - (carTime.getHours() * 60 + carTime.getMinutes());
  let parkingMoney = 0;

  if (10 > parkingTime) parkingMoney = 0;
  else if (10 <= parkingTime && parkingTime <= 30) parkingMoney = 3000;
  else if (parkingTime >= 30 && parkingTime < 300) parkingMoney = Math.ceil(parkingTime / 10) * 1000;
  else if (parkingTime >= 300) parkingMoney = 30000;

  let str = `<span>차량 번호: ${curCar.carNumber}</span>
  <span>입차 시간: ${inCarTime}</span>
  <span>출차 시간: ${outCarTime}</span>
  <span>총 주차 시간: ${parkingTime}분</span>
  <span>요금: ${parkingMoney}원</span>`;

  $carInfoList.innerHTML = str;

  closePanel(id);
};

const clickCarList = () => {
  document.addEventListener("click", (e) => {
    if (e.target.className !== "car__list__car") return;
    const carId = e.target.dataset.id;
    openCarPanel(carId);
  });
};

const writeCarList = () => {
  const $carList = get(".car__list ul");
  let str = "";
  carList.map((el, i) => {
    str += `<li class="car__list__car" data-id=${i}>${el.carNumber}</li>`;
  });
  $carList.innerHTML = str;
};

const getCar = () => {
  document.addEventListener("click", (e) => {
    const target = e.target.className;
    if (target !== "enter__car__button") return;

    const date = new Date();
    const carNumber = get(".enter__car__input").value;
    const inCarTime = date;
    let car = { carNumber, inCarTime };
    carList.push(car);
    writeCarList();
    saveData();
    get(".enter__car__input").value = "";
  });
};
const init = () => {
  writeCarList();
  getCar();
  clickCarList();
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
