const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const submit = document.querySelector('#go');

function addZero(x) {
  return x < 10 ? `0${x}` : x;
}

function ignoreSubtitled(showing) {
  if (
    !(
      Object.prototype.hasOwnProperty.call(showing, 'properties')
      && Object.prototype.hasOwnProperty.call(showing.properties, 'event.film.subtitled')
    )
  ) {
    return true;
  }
  return false;
}

function ignoreIMAX(showing) {
  if (
    !(
      Object.prototype.hasOwnProperty.call(showing, 'properties')
      && Object.prototype.hasOwnProperty.call(showing.properties, 'event.film.imax')
    )
  ) {
    return true;
  }
  return false;
}

function ignorePremiumScreening(showing) {
  if (
    !(
      Object.prototype.hasOwnProperty.call(showing, 'properties')
      && Object.prototype.hasOwnProperty.call(showing.properties, 'event.film.premium-screening')
    )
  ) {
    return true;
  }
  return false;
}

function ignoreEventCinema(film) {
  if (
    film.tags
    && film.tags.includes('event cinema')
  ) {
    return false;
  }
  return true;
}

function displayRunTime(film) {
  if (
    film.properties
    && Object.prototype.hasOwnProperty.call(film.properties, 'film.running-time')
  ) {
    return /* html */ `
      <p>${film.properties['film.running-time']} mins</p>
      `;
  }
  return '';
}

function displayCertificate(film) {
  if (
    film.properties
    && Object.prototype.hasOwnProperty.call(film.properties, 'film.certificate.bbfc')
  ) {
    return /* html */ `
      <span>(${film.properties['film.certificate.bbfc']})</p>
      `;
  }
  return '';
}

function getFilms(e) {
  e.preventDefault();

  const cinema = document.querySelector('#cinema').value;
  const results = document.querySelector('#results');

  fetch(`https://api.list.co.uk/v1/events?place_id=${cinema}&tags=film`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`, // eslint-disable-line
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      results.innerHTML = '';

      data.forEach((film) => {
        let prevDate;
        let dayRow;
        let timesCell = document.createElement('td');

        const showtimesTable = document.createElement('table');
        const rawShowtimes = film.schedules[0].performances;
        const filteredShowtimes = rawShowtimes
          .filter(ignoreEventCinema)
          .filter(ignoreIMAX)
          .filter(ignorePremiumScreening)
          .filter(ignoreSubtitled);

        if (!filteredShowtimes.length) {
          return;
        }

        filteredShowtimes.forEach((showing) => {
          const timestamp = new Date(showing.ts);
          const showingWeekday = days[timestamp.getDay()];
          const showingDay = addZero(timestamp.getDate());
          const showingMonth = months[timestamp.getMonth()];
          const showingYear = timestamp.getFullYear();
          const showingHour = addZero(timestamp.getHours());
          const showingMinutes = addZero(timestamp.getMinutes());
          const showingDate = showingDay + showingMonth + showingYear;
          const dateCell = document.createElement('th');
          const timeText = document.createElement('span');

          timeText.classList.add('film__time');

          dateCell.innerHTML = `${showingWeekday}&nbsp;${showingDay}&nbsp;${showingMonth}`;
          timeText.innerHTML = `${showingHour}:${showingMinutes}`;

          if (prevDate === showingDate) {
            timesCell.appendChild(timeText);
          } else {
            dayRow = document.createElement('tr');
            timesCell = document.createElement('td');

            dayRow.appendChild(dateCell);
            dayRow.appendChild(timesCell);
            timesCell.appendChild(timeText);
            showtimesTable.appendChild(dayRow);
          }

          prevDate = showingDate;
        });

        const filmCard = /* html */ `
      <article data-id="${film.event_id}" class="film">
      <div class="film__body">
      <h2>${film.name}${displayCertificate(film)}</h2>
      ${displayRunTime(film)}
      ${showtimesTable.outerHTML}
      </div>
      <footer class="film__footer">
      <input type="checkbox" class="check-print" id="${film.event_id}" data-id="${film.event_id}" />
      <label for="${film.event_id}">print</label>
      </footer>
      </article>
      `;
        results.innerHTML += filmCard;
      });
      results.innerHTML += /* html */ `
    <div class="print"><a class="print__button" onClick="window.print()">print</a></div>
    `;
    })
    .catch((error) => {
      const errorMessage = /* html */ `
      <div class="film">
        <div class="film__body">
          <p>We're sorry, we can't get your film times at the moment. Please try again later. ${
  error.message
}</p>
        </div>
      </div>
      `;
      results.innerHTML += errorMessage;
    });
}

function prepareForPrint() {
  const checked = document.querySelectorAll('.check-print:checked');
  const unchecked = document.querySelectorAll('.check-print:not(:checked');

  checked.forEach((checkbox) => {
    const id = checkbox.getAttribute('data-id');
    const film = document.querySelector(`.film[data-id="${id}"]`);

    if (film.classList.contains('no-print')) {
      film.classList.remove('no-print');
    }
  });

  unchecked.forEach((checkbox) => {
    const id = checkbox.getAttribute('data-id');
    const film = document.querySelector(`.film[data-id="${id}"]`);

    if (checked.length) {
      film.classList.add('no-print');
    }

    if (!checked.length && film.classList.contains('no-print')) {
      film.classList.remove('no-print');
    }
  });
}

if (window.matchMedia) {
  const mediaQueryList = window.matchMedia('print');
  mediaQueryList.addListener((mql) => {
    if (mql.matches) {
      prepareForPrint();
    }
  });
}

window.onbeforeprint = setTimeout(prepareForPrint, 1000);

submit.addEventListener('click', getFilms);
