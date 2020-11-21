import * as model from './model.js';
import recipeView from './views/recipeView.js'; 
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import {MODAL_CLOSE_SEC} from './config.js'

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot){
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipes = async function(){
  try {
      const id = window.location.hash.slice(1);

      if(!id) return;
      recipeView.renderSpinner();

      // 0) UPDATE RESULTS VIEW TO MARK SELECTED SEARCH RESULT
      resultsView.update(model.getSearchResultsPage());

      // 1) UPDATING BOOKMARKS VIEW
      bookmarksView.update(model.state.bookmarks);

      // 2)LOADING RECIPE
      await model.loadRecipe(id);

      // 3)RENDERING RECIPE
      recipeView.render(model.state.recipe);
      
  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function(){
  try{
    // 1)GET SEARCH QUERY
    const query = searchView.getQuery();
    if(!query) return;
    resultsView.renderSpinner();

    // 2)LOAD SEARCH RESULTS
    await model.loadSearchResults(query);

    // 3)RENDER RESULTS
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    
    // 4)RENDER INITIAL PAGINATION BUTTONS
    paginationView.render(model.state.search);

  }catch(err){
    
  }
}

const controlPagination = function(goToPage){
  // 3)RENDER NEW RESULTS
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(goToPage));
    
    // 4)RENDER NEW PAGINATION BUTTONS
    paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // UPDATE RECIPE SERVINGS(IN STATE)
  model.updateServings(newServings);

  // UPDATE THE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // 1) Add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // console.log(model.state.recipe);
  // 2) Update recipe view 
  recipeView.update(model.state.recipe); 

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

     // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function(){
      // addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}

controlSearchResults();

// const newFeature = function(){
//   console.log('Welcome to the application!');
// }

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // newFeature();
}
init();


