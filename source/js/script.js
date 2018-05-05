var menu= document.querySelector("nav");
var modalMenu= document.querySelector(".main-navigation__list");
var menuButtonOpen= document.querySelector(".main-navigation__burger-button");
var menuButtonClose= document.querySelector(".main-navigation__close-button");

modalMenu.classList.remove("main-navigation__list-opened");

menuButtonOpen.addEventListener("click", function(evt) {
  evt.preventDefault();
  modalMenu.classList.add("main-navigation__list-opened");
  menuButtonClose.classList.add("main-navigation__close-button-show");
});

menuButtonClose.addEventListener("click", function(evt) {
  evt.preventDefault();
  menuButtonClose.classList.remove("main-navigation__close-button-show");
  modalMenu.classList.remove("main-navigation__list-opened");
});
