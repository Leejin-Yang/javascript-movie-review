import UserRating from './UserRating';
import UserRatingButtonList from './UserRatingButtonList';

import { posterNotFoundImage, starFilledImage } from '../../assets/images';
import { IMAGE_URL } from '../../constants';
import { CLASS } from '../../constants/selector';
import { $ } from '../../utils/dom';
import type { MovieDetail } from '../MovieCardSection/MovieCard';

import './MovieDetailModal.style.css';

const MovieDetailModal = {
  template(movieDetail: MovieDetail) {
    return `
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${movieDetail.title}</h2>
          <button type="button">X</button>
        </div>
        <div class="movie-details">
          <div class="movie-detail-poster">
            <img
              src="${MovieDetailModal.handlePosterImage(movieDetail.posterPath)}"
              alt=${movieDetail.title}
            />
          </div>
          <div class="movie-detail-content">
            <div class="movie-detail-info">
              <div class="movie-detail-genre">
                <p>${movieDetail.genres.join(', ')}</p>
                <div class="movie-detail-score">
                  <img src=${starFilledImage} alt="별점" />
                </div>
                <p>${movieDetail.rating.toFixed(1)}</p>
              </div>
              <p class="movie-detail-desc">
                ${movieDetail.overview}
              </p>
            </div>
            ${UserRating.template()}
          </div>
        </div>
      </div>
    `;
  },

  setEvent() {
    const modalBackground = $<HTMLDivElement>('.modal-background');

    modalBackground.addEventListener('click', MovieDetailModal.close);
    window.addEventListener('keydown', MovieDetailModal.onKeydownEscape);

    UserRatingButtonList.setEvent();
  },

  removeEvent() {
    window.removeEventListener('keydown', MovieDetailModal.onKeydownEscape);
  },

  onKeydownEscape(event: KeyboardEvent) {
    if (event.code === 'Escape') MovieDetailModal.close();
  },

  open(movieDetail: MovieDetail) {
    const modalRoot = $<HTMLDivElement>('#modal-root');

    modalRoot.classList.remove(CLASS.HIDE);
    modalRoot.insertAdjacentHTML('beforeend', MovieDetailModal.template(movieDetail));
  },

  close() {
    const modalRoot = $<HTMLDivElement>('#modal-root');

    modalRoot.classList.add(CLASS.HIDE);
    modalRoot.innerHTML = '';
    MovieDetailModal.removeEvent();
  },

  handlePosterImage(path: string | null) {
    return path === null ? posterNotFoundImage : IMAGE_URL + path;
  },
};

export default MovieDetailModal;