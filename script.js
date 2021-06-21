// toggle selectors
const toggleDiv = document.querySelector("#form__toggle");
const togglePublicDiv = document.querySelector("#form__toggle__public");
const togglePrivateDiv = document.querySelector("#form__toggle__private");

// fields selectors
// TODO: remove private field from labels
const publicFields = document.querySelectorAll(".form__public-field");
const privateFields = document.querySelectorAll(".form__private-field");
const publicFieldSet = document.querySelector("#form__public-fieldset");
const privateFieldSet = document.querySelector("#form__private-fieldset");

// tooltip selectors
const tooltipDivs = document.querySelectorAll(".form__tooltip");

// toggle logic
let isTogglePublic = true; // boolean for if toggle is public or private
toggleDiv.addEventListener("click", () => {
  isTogglePublic = !isTogglePublic;
  togglePublicDiv.classList.toggle("form__toggle-selected");
  togglePrivateDiv.classList.toggle("form__toggle-selected");

  // publicFields.forEach((item) => (item.hidden = !item.hidden));
  // privateFields.forEach((item) => (item.hidden = !item.hidden));
  publicFieldSet.hidden = !publicFieldSet.hidden;
  privateFieldSet.hidden = !privateFieldSet.hidden;
});

// tooltip logic
tooltipDivs.forEach((div) => {
  div.addEventListener("click", (e) => tooltipFunction(e));
});

const tooltipFunction = (e) => {
  console.log(e);
};
