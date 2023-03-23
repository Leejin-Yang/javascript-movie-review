import MovieCard from './MovieCard';
import MovieDetailModal from '../MovieDetailModal';

import { DEFAULT_LIST_LENGTH } from '../../constants';
import { CLASS } from '../../constants/selector';
import { $ } from '../../utils/dom';

import type { AppMovie } from '../../types/movie';
import { getMovieDetailApi } from '../../api';

const MovieCardList = {
  template() {
    return `
      <ul class=${CLASS.ITEM_LIST}></ul>
    `;
  },

  skeletonItems() {
    return MovieCard.template().repeat(DEFAULT_LIST_LENGTH);
  },

  setEvent() {
    const movieCardList = $<HTMLUListElement>(`.${CLASS.ITEM_LIST}`);

    movieCardList.addEventListener('click', async (event) => {
      if (!(event.target instanceof HTMLElement)) return;

      const movieItem = event.target.closest('li');
      const movieId = movieItem?.dataset.id;

      if (!movieId) return;

      const movieDetail = await MovieCard.getMovieDetail(movieId);

      if (!movieDetail) return;

      MovieDetailModal.open(movieDetail);
      MovieDetailModal.setEvent();
    });
  },

  renderSkeletonItems(isCurrentQuery: boolean) {
    const movieList = $<HTMLUListElement>(`.${CLASS.ITEM_LIST}`);

    movieList.classList.remove(CLASS.HIDE);

    if (isCurrentQuery) {
      movieList.insertAdjacentHTML('beforeend', MovieCardList.skeletonItems());
      return;
    }

    movieList.innerHTML = MovieCardList.skeletonItems();
  },

  paint(movies: AppMovie[], page: number = 1) {
    const movieList = $<HTMLUListElement>(`.${CLASS.ITEM_LIST}`);
    const startLine = (page - 1) * DEFAULT_LIST_LENGTH;
    const currentSkeletonItems = [...movieList.children].slice(startLine);
    const remainCounts = DEFAULT_LIST_LENGTH - movies.length;

    movies.forEach((movie, index) => {
      const currentSkeleton = currentSkeletonItems[index];

      if (currentSkeleton instanceof HTMLLIElement) {
        MovieCard.paint(currentSkeleton, movie);
      }
    });

    if (remainCounts !== 0) {
      MovieCardList.removeSkeleton(remainCounts);
    }
  },

  handleVisibility(state: boolean) {
    const movieList = $<HTMLUListElement>(`.${CLASS.ITEM_LIST}`);

    if (state) {
      return movieList.classList.add(CLASS.HIDE);
    }

    return movieList.classList.remove(CLASS.HIDE);
  },

  removeSkeleton(count: number = DEFAULT_LIST_LENGTH) {
    const movieList = $<HTMLUListElement>(`.${CLASS.ITEM_LIST}`);

    [...movieList.children].slice(-count).forEach((child) => {
      child.remove();
    });
  },
};

export default MovieCardList;
