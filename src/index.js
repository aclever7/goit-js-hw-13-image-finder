import articlesTpl from './templates/articles.hbs';
import LoadMoreBtn from './load-more-button';
import NewsApiService from './apiService';
import './sass/styles.scss';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  clearGallery();

  newsApiService.resetPage();
  newsApiService.query = e.currentTarget.elements.query.value;
  if (newsApiService.query === '') {
    defaultModules.set(PNotifyMobile, {});
    return alert({
      text: '! Enter something!',
      addClass: 'notify',
      delay: 2000,
    });
  }
  newsApiService
    .fetchArticles()
    .then(appendArticlesMarkup)
    .catch(error => {
      console.log(error);
      defaultModules.set(PNotifyMobile, {});
      return alert({
        text: '! Information not found!',
        addClass: 'notify',
        delay: 2000,
      });
    });
}
function onLoadMore() {
  newsApiService.fetchArticles().then(appendArticlesMarkup);
  setTimeout(() => {
    refs.gallery.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, 1000);
}
function appendArticlesMarkup(articles) {
  if (articles.length >= 12) {
    loadMoreBtn.show();
  } else {
    loadMoreBtn.hide();
  }
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    `<li class="gallery__item"> ${articlesTpl(articles)}</li>`,
  );
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
