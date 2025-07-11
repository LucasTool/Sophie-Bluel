const BASE_URL = "http://localhost:5678/api/";
const WORKS_API = BASE_URL + "works";
const CATEGORY_API = BASE_URL + "categories";
const GALLERY_DIV = document.querySelector(".gallery");
const FILTER_DIV = document.querySelector(".filter");

document.addEventListener("DOMContentLoaded", () => {
  gestion_login();
});
//AFFICHE LES TRAVAUX DANS LA GALERIE
fetchWorks(GALLERY_DIV, false);

//RAFRAICHIT LES TRAVAUX
function refreshWorks(targetDiv, deleteButton) {
  targetDiv.innerHTML = "";
  fetchWorks(targetDiv, deleteButton);
}

//RECUPERATION DES TRAVAUX
function fetchWorks(targetDiv, deleteButton) {
  //CREATION DU FETCH POUR IMPORTER LES TRAVAUX
  fetch(WORKS_API)
    .then((reponse) => reponse.json())
    .then((works) => {
      workList = works; //STOCKAGE DES TRAVAUX DANS VARIABLES WORKLIST (POUR REUTILISATION DANS FILTRES)
      for (let i = 0; i < works.length; i++) {
        createWork(works[i], targetDiv, deleteButton);
      }
    });
}

//AFFICHAGE D'UN PROJET
function createWork(work, targetDiv, deleteButton) {
  let figure = document.createElement("figure");
  let imgWorks = document.createElement("img");
  let figcaption = document.createElement("figcaption");
  imgWorks.src = work.imageUrl;
  figcaption.innerHTML = work.title;
  figure.appendChild(imgWorks);
  figure.appendChild(figcaption);
  targetDiv.appendChild(figure);
  if (deleteButton) {
    // SI ON A DEMANDE LA CREATION D'UN BOUTON DE SUPPR (deleteButton == true)
    createDeleteButton(figure, work);
  }
}

//RECUPERATION DES CATEGORIES
fetch(CATEGORY_API)
  .then((reponse) => reponse.json())
  .then((categories) => {
    let filterWorks = new Set(categories);
    let nouvelleCategorie = { id: 0, name: "Tous" };
    createFilterButton(nouvelleCategorie);
    addSelectedClass(nouvelleCategorie.id);
    for (let category of filterWorks) {
      createFilterButton(category);
    }
  });

//CREATION DES BOUTONS FILTRES
function createFilterButton(category) {
  let categoryLink = document.createElement("a");
  categoryLink.id = "category" + category.id;
  categoryLink.classList.add("category");
  categoryLink.innerHTML = category.name;
  FILTER_DIV.appendChild(categoryLink);

  //AJOUT DU EVENTLISTERNER SUR LES FILTRES
  categoryLink.addEventListener("click", function () {
    filterWorksByCategory(category.id);
  });
}

function filterWorksByCategory(categoryId) {
  //SUPPRIMER TOUT CE QU IL Y A DANS DIV GALLERY
  GALLERY_DIV.innerHTML = "";

  //AFFICHER UNIQUEMENT WORKS AVEC CATEGORY=CATEGORYID OU TOUS
  for (let i = 0; i < workList.length; i++) {
    if (workList[i].categoryId === categoryId || categoryId === 0) {
      createWork(workList[i], GALLERY_DIV, false);
    }
  }

  //GESTION DE L'APPARENCE DES FILTRES (SELECTION)
  removeSelectedClass();
  addSelectedClass(categoryId);
}

//MODIFICATION LOGIN EN LOGOUT SI NECESSAIRE
gestion_login();

//CREATION D'UN BOUTON SUPPRIMER POUR CHAQUE IMAGE
function createDeleteButton(figure, work) {
  let button = document.createElement("i");
  button.classList.add("fa-regular", "fa-trash-can");
  button.addEventListener("click", DELETE_WORK);
  button.id = work.id;
  figure.appendChild(button);
}

//AJOUT DE LA CLASSE SELECTED A UNE CATEGORY
function addSelectedClass(categoryId) {
  document.getElementById("category" + categoryId).classList.add("selected");
}

//SUPRESSION DE LA CLASSE SELECTED AUX CATEGORIES
function removeSelectedClass() {
  let filters = document.querySelectorAll(".category");
  for (let i = 0; i < filters.length; i++) {
    filters[i].classList.remove("selected");
  }
}

function gestion_login() {
  const loginLogoutLink = document.getElementById("login_logout");
  const bandeau_edit = document.getElementById("edition");
  const modif_projet = document.getElementById("modif_projet");
  const filter_section = document.querySelector(".filter");

  if (sessionStorage.getItem("token")) {
    // Utilisateur connecté
    loginLogoutLink.textContent = "logout";

    if (bandeau_edit) bandeau_edit.style.display = "flex";
    if (modif_projet) modif_projet.style.display = "block";
    if (filter_section) filter_section.classList.add("hidden");

    loginLogoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "index.html";
    });
  } else {
    // Utilisateur déconnecté
    loginLogoutLink.textContent = "login";

    if (bandeau_edit) bandeau_edit.style.display = "none";
    if (modif_projet) modif_projet.style.display = "none";
    if (filter_section) filter_section.classList.remove("hidden");

    loginLogoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "login.html";
    });
  }
}
