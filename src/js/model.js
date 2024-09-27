import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookMarks: [],
};
export const loadRecipe = async function (id) {
  try {
    if (/[a-zA-Z]/.test(id)) {
      const data = await getJSON(`${API_URL}/${id}`);
      const { recipe } = data.data;

      state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
      };
      console.log(state.recipe);
      state.recipe.bookMarked = state.bookMarks.some(
        bookmark => bookmark.id === id
      );
    } else {
      console.log('Results:', state.search.results);
      const localRecipe = state.search.results.find(rec => {
        return rec.id === id;
      });
      console.log('Local Recipe:', localRecipe);
      state.recipe = {
        id: id,
        title: localRecipe.title,
        publisher: localRecipe.publisher,
        sourceUrl: localRecipe.sourceurl,
        image: localRecipe.image,
        servings: localRecipe.servings,
        cookingTime: localRecipe.cookingTime,
        ingredients: localRecipe.ingredients,
      };
      console.log(state.recipe);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const localRecipes = JSON.parse(localStorage.getItem('recipes'));
    const o = localRecipes.filter(rec => rec.title.includes(query));
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image:
          isValidUrl(rec.image_url) && rec.image_url.includes('http')
            ? rec.image_url
            : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
      };
    });
    o.map(rec => {
      console.log(rec);
      const obj = {
        id: rec.id || String(Date.now()),
        title: rec.title,
        publisher: rec.publisher,
        sourceurl: rec.source_url,
        image:
          isValidUrl(rec.image_url) && rec.image_url.includes('http')
            ? rec.image_url
            : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',

        servings: String(rec.servings),
        cookingTime: String(rec.cooking_time),
        ingredients: rec.ingredients,
      };
      console.log(obj);
      state.search.results.push(obj);
    });

    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    }
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

export const addBookMark = function (recipe) {
  state.bookMarks.push(recipe);
  state.recipe.bookMarked = true;
  persistBookmarks();
};

export const deleteBookMark = function (id) {
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);
  state.recipe.bookMarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingArr = ingredient[1].replaceAll(' ', '').split(',');
        const [quantity, unit, description] = ingArr;
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
  } catch (err) {
    throw err;
  }
};
