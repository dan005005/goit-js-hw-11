import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '31959866-848f36ee956c46b4ab479fa6b';
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: '40',
});

export default class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  // fetchImages() {
  //   return fetch(
  //     `${URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`
  //   ).then(response => {
  //     return response.json();
  //   });
  // }
  async fetchImages() {
    try {
      const { data } = await axios.get(
        `${URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`
      );
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
