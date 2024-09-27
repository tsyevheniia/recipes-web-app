import * as model from './model';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookMarksView from './views/bookMarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookMarksView.update(model.state.bookMarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddRecipe = function (newRecipe) {
  try {
    model.uploadRecipe(newRecipe);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookMarksView.render(model.state.bookMarks);
};
const controlBookmarks = function () {
  bookMarksView.render(model.state.bookMarks);
};
const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipe);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
