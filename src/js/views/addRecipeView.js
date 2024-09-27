import View from './view.js';
import icons from 'url:../../img/icons.svg';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay ');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnUpload = document.querySelector('.upload__btn');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerClose();
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', () => {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    });
  }
  _addHandlerClose() {
    this._btnUpload.addEventListener('click', () => {
      this._overlay.classList.add('hidden');
      this._window.classList.add('hidden');
    });
  }
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();
