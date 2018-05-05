var menu= document.querySelector("nav");
var modalMenu= document.querySelector(".main-navigation__list");
var menuButtonBurger= document.querySelector(".main-navigation__button-burger");
var menuButtonOpen= document.querySelector(".main-navigation__button-burger");
var menuButtonClose= document.querySelector(".main-navigation__button-close");


modalMenu.classList.remove("main-navigation__list-opened");
menuButtonBurger.classList.add("main-navigation__button-show");


menuButtonOpen.addEventListener("click", function(evt) {
  evt.preventDefault();
  modalMenu.classList.add("main-navigation__list-opened");
  menuButtonClose.classList.add("main-navigation__button-show");
});

menuButtonClose.addEventListener("click", function(evt) {
  evt.preventDefault();
  menuButtonClose.classList.remove("main-navigation__button-show");
  modalMenu.classList.remove("main-navigation__list-opened");
});
