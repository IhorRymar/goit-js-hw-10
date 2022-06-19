import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(findCountry, DEBOUNCE_DELAY));

function findCountry(e) {
  const findCountry = e.target.value.trim();
  const findCountryData = e.data;

  if (findCountry !== '' && findCountryData !== ' ') {
    fetchCountries(findCountry)
      .then(response => {
        if (Number(response.status) === 404) {
          Notify.failure('Oops, there is no country with that name');
        }
        if (response.length > 10) {
          Notify.info('Too many matches found. Please enter a more specific name.');
        }
        if (findCountry === '') {
          clearMarcUpList();
          clearMarcUpInfo();
        }
        clearMarcUpList();
        clearMarcUpInfo();

        if (response.length === 1) {
          renderCountry(response);
          clearMarcUpList();
        } else if (response.length > 1 && response.length <= 10) {
          renderCountryList(response);
        }
      })

      .catch(error => {
        console.log(error);
      });
  }
}
function renderCountry(items) {
  const marcup = items
    .map(
      ({ name, capital, population, languages, flags }) =>
        `
        <div class = "wrapper">
          <img src="${flags.svg}" alt = "flag" width = 60px height = 30px>
          <h1 class = "title"> ${name.official}</h1>
        </div>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${Object.values(languages)}</p>
      `,
    )
    .join('');
  refs.countryInfo.insertAdjacentHTML('afterbegin', marcup);
}

function renderCountryList(items) {
  const marcupList = items
    .map(
      ({ name, flags }) =>
        `<li>
            <div class = "wrapper">
              <img src="${flags.svg}" alt = "flag" width = 30px height = 15px>
              <h1 class = "title"> ${name.official}</h1>
            </div>
        </li>
      `,
    )
    .join('');
  refs.countryList.insertAdjacentHTML('afterbegin', marcupList);
}
function clearMarcUpInfo() {
  refs.countryInfo.innerHTML = '';
}

function clearMarcUpList() {
  refs.countryList.innerHTML = '';
}
