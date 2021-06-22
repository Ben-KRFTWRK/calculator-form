// TOGGLE SELECTORS
const toggleDiv = document.querySelector("#form-toggle");
const togglePublicDiv = document.querySelector("#form-toggle__public");
const togglePrivateDiv = document.querySelector("#form-toggle__private");

// FORM SELECTORS
const form = document.querySelector("#form");

const publicFields = document.querySelectorAll(".form__public-field");
const privateFields = document.querySelectorAll(".form__private-field");
const publicFieldSet = document.querySelector("#form__public-fieldset");
const privateFieldSet = document.querySelector("#form__private-fieldset");

const locationField = document.querySelector("#location-type");
const tennantField = document.querySelector("#number-tenants");
const tennantFieldLabel = document.querySelector("#number-tenants-label");

// TOOLTIP SELECTORS
const tooltipDivs = document.querySelectorAll(".form__tooltip");

// RESULT SELECTORS
const results = document.querySelector("#result-page");
const estimatedScooters = document.querySelector("#estimated-scooters");
const estimatedRevenue = document.querySelector("#estimated-revenue");
const recalculateLink = document.querySelector("#result__recalculate__link");

// TOGGLE LOGIC
let isTogglePublic = true; // boolean for if toggle is public or private
toggleDiv.addEventListener("click", () => {
  // change toggle boolean
  isTogglePublic = !isTogglePublic;

  // toggle selected styling
  togglePublicDiv.classList.toggle("form-toggle-selected");
  togglePrivateDiv.classList.toggle("form-toggle-selected");

  // toggle item required
  publicFields.forEach((item) => (item.required = !item.required));
  privateFields.forEach((item) => (item.required = !item.required));

  publicFieldSet.hidden = !publicFieldSet.hidden;
  privateFieldSet.hidden = !privateFieldSet.hidden;
});

// TOOLTIP LOGIC
tooltipDivs.forEach((div) => {
  const tooltipText = div.querySelector(".form__tooltip__text");
  const tooltipIconPath = div.querySelector(".form__tooltip__icon path");
  div.addEventListener("click", (e) =>
    tooltipFunction(e, tooltipText, tooltipIconPath)
  );
});

const tooltipFunction = (e, tooltipText, tooltipIconPath) => {
  tooltipText.hidden = !tooltipText.hidden;
  tooltipIconPath.classList.toggle("form__tooltip__icon-selected");
};

// APARTMENT/HOTEL FIELD LOGIC
locationField.addEventListener("change", (e) => changeTennantField(e));

const apartmentFollowingField = {
  name: tennantField.name,
  label: tennantFieldLabel.innerText,
};

const hotelFollowingField = {
  name: tennantField.dataset.nameHotel,
  label: tennantFieldLabel.dataset.labelHotel,
};

const changeTennantField = (e) => {
  if (e.target.value === "apartment") {
    tennantField.name = apartmentFollowingField.name;
    tennantFieldLabel.innerText = apartmentFollowingField.label;
  } else if (e.target.value === "hotel") {
    tennantField.name = hotelFollowingField.name;
    tennantFieldLabel.innerText = hotelFollowingField.label;
  }
};

// FORM SUBMIT LOGIC
form.addEventListener("submit", (e) => onFormSubmit(e));

const onFormSubmit = (e) => {
  e.preventDefault();

  // getting form values for either private or public fields, then running calcs
  let formValues = {};
  let output = {};
  if (isTogglePublic) {
    formValues = getFormValues(publicFields);
    output = publicCalculation(formValues);
  } else {
    formValues = getFormValues(privateFields);
    output = privateCalculation(formValues);
  }

  // update results
  estimatedRevenue.innerHTML = output.revenue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
  });
  estimatedScooters.innerHTML = output.scooters.toLocaleString("en-US", {
    minimumFractionDigits: 0,
  });

  // Hide the form and show the results
  form.hidden = true;
  results.hidden = false;
};

const getFormValues = (formVersionFields) => {
  let values = {};
  formVersionFields.forEach((field) => {
    values[field.name] = field.value;
  });
  return values;
};

const publicCalculation = (values) => {
  // RDS calcs
  let urbanCenter = 1;
  if (values["location-in-urban-center"] === "no") {
    urbanCenter = 0;
  }

  const rds = 1.5 + urbanCenter + 0.2 * values["bike-lane-friendly"];

  // Public Share Scooter Volume Range Converter
  let numberScooters = 0;
  const cityPop = values["city-population"];

  if (cityPop >= 1000000) {
    numberScooters = 5000;
  } else if (cityPop >= 500000) {
    numberScooters = 4000;
  } else if (cityPop >= 200000) {
    numberScooters = 2000;
  } else if (cityPop >= 100000) {
    numberScooters = 750;
  } else if (cityPop >= 50000) {
    numberScooters = 500;
  } else if (cityPop >= 10000) {
    numberScooters = 150;
  } else {
    numberScooters = 25;
  }

  // revenue calcs
  const revenue =
    numberScooters * 27 * values["estimated-operating-months"] * 4 * rds;

  const returnValues = {
    revenue: revenue,
    scooters: numberScooters,
  };

  return returnValues;
};

const privateCalculation = (values) => {
  // Private Share Scooter Volume Range Converter
  let numberScooters = 0;
  const tenants = values["number-tenants"] || values["occupied-rooms"];

  if (tenants >= 500) {
    numberScooters = 40;
  } else if (tenants >= 200) {
    numberScooters = 25;
  } else if (tenants >= 100) {
    numberScooters = 15;
  } else {
    numberScooters = 10;
  }

  // urban center increase
  let urbanCenter = 1;
  if (values["location-in-urban-center"] === "no") {
    urbanCenter = 0;
  }

  // revenue calc
  const revenue =
    numberScooters *
    27 *
    values["estimated-operating-months"] *
    10 *
    (2 + urbanCenter);

  const returnValues = {
    revenue: revenue,
    scooters: numberScooters,
  };

  return returnValues;
};

// RECALCULATE LOGIC
recalculateLink.addEventListener("click", (e) => goBackFunction(e));

const goBackFunction = (e) => {
  e.preventDefault();
  form.hidden = false;
  results.hidden = true;

  // this isn't necessary at all, I just put it in as a backup in case of a bug with updating the values
  estimatedRevenue.innerHTML = "N/A";
  estimatedScooters.innerHTML = "N/A";
};
