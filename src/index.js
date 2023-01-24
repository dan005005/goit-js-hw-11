import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PixabayApi from './JS/ApiService';
// import axios from 'axios';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const pixabayApi = new PixabayApi();
refs.loadMoreBtn.classList.add('visually-hidden');

async function onFormSubmit(e) {
  e.preventDefault();
  pixabayApi.query = e.currentTarget.elements.query.value.trim();
  if (pixabayApi.query === '') {
    refs.loadMoreBtn.classList.add('visually-hidden');
    onClearGalery();
    return;
  }
  pixabayApi.resetPage();
  // pixabayApi.fetchImages().then(({ hits, totalHits }) => {
  //   if (totalHits === 0) {
  //     refs.loadMoreBtn.classList.add('visually-hidden');
  //     onClearGalery();
  //     Notiflix.Notify.failure(
  //       'Sorry, there are no images matching your search query. Please try again.'
  //     );
  //     return;
  //   } else {
  //     Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  //     pixabayApi.incrementPage();
  //     checkHits(totalHits);

  //     // refs.loadMoreBtn.classList.remove('visually-hidden');
  //   }
  const data = await pixabayApi.fetchImages();
  if (data.totalHits === 0) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    onClearGalery();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    pixabayApi.incrementPage();
    checkHits(data.totalHits);

    // refs.loadMoreBtn.classList.remove('visually-hidden');
  }
  onClearGalery();
  createGaleryItemsMarkup(data.hits);
  gallery.refresh();
}

function checkHits(totalHits) {
  if (totalHits > 40) {
    refs.loadMoreBtn.classList.remove('visually-hidden');
    return;
  } else {
    refs.loadMoreBtn.classList.add('visually-hidden');
    return;
  }
}
function createGaleryItemsMarkup(array) {
  console.log(array);
  const boxMarkup = array
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><a href="${largeImageURL}">
<img src="${webformatURL}" alt="${tags}" loading="lazy" class="preview-image" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div></a>`
    )
    .join('');
  refs.imagesContainer.insertAdjacentHTML('beforeend', boxMarkup);
}
async function onLoadMore(e) {
  try {
    const data = await pixabayApi.fetchImages();
    console.log(data);
    pixabayApi.incrementPage();
    createGaleryItemsMarkup(data.hits);
    gallery.refresh();
    if (data.hits.length < 40) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    console.log(`Error`);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  scrollImg();
}

function onClearGalery() {
  refs.imagesContainer.innerHTML = '';
}

const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function scrollImg() {
  const { height: cardHeight } =
    refs.imagesContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.85,
    behavior: 'smooth',
  });
}
