import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import "./css/styles.css";
import axios from "axios";

const axiosEl = axios.default;
const formEl = document.getElementById("search-form");
const galleryEl = document.querySelector(".gallery");
const showMore = document.querySelector(".load-more");
const keyEl = "key";
let number = 1;
let search = "";





const letSreach = async (e) => {
  e.preventDefault();
  let {
    elements: {searchQuery},
  } = e.currentTarget;
  const search = searchQuery.value;
  try {
    const response = await axiosEl.get(
      `https://pixabay.com/api/?key=36135097-9ce084688f13669976d3cf799&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${number}`
    );
    await makePhoto(response);
    number += 1;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure("Oops, something went wrong");
  }

localStorage[keyEl] = search;
};

// 	var API_KEY = "36135097-9ce084688f13669976d3cf799";
//   var URL =
//     "https://pixabay.com/api/?key=" +
//     API_KEY +
//     "&q=" +
//     encodeURIComponent("red roses");
// 


function makePhoto(response) {
  const photoEl = response.data.hits;
  const totalHits = response.data.totalHits;

  if (photoEl.length === 0) {
    number = 0;
    Notiflix.Notify.failure(
      "Sorry, there are no images matching your search query. Please try again."
    );
      
    localStorage.clear();
    galleryEl.innerHTML = "";
     showMore.classList.add("load-more-show");
     showMore.classList.remove("load-more");
      

    return;
  }

  const card = photoEl.map(
      (photo) => `<div class="photo-card">
      <a href="${photo.largeImageURL}">
        <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${photo.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${photo.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${photo.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${photo.downloads}
        </p>
      </div>
    </div>`
    )
    .join("");

  showMore.classList.add("load-more-show");
  showMore.classList.remove("load-more");

  if (search !== localStorage.getItem(keyEl)) {
   galleryEl.insertAdjacentHTML('beforeend', card);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else {
    galleryEl.insertAdjacentHTML("beforeend", card);
  }

  const list = document.querySelectorAll("a");
  console.log(list);

  if (list.length >= totalHits) {
    console.log("test");
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    showMore.classList.add("load-more-show");
    showMore.classList.remove("load-more");
  }

 list.forEach((link) => link.addEventListener("click", modal));

  const lightboxOpen = new SimpleLightbox(".photo-card a", {
    captionsData: "alt",
      captionPosition: "outside",
    fadeSpeed: 300,
   
  });

  function modal(e) {
    e.preventDefault();
    lightboxOpen.on("show.simplelightbox");
  }

  if (galleryEl) {
    const cardHeight =
      galleryEl.firstElementChild.getBoundingClientRect().height;
    window.scrollBy({
        top: cardHeight * 3,
      behavior: "smooth",
    });
  }
}

formEl.addEventListener("submit", letSreach);
