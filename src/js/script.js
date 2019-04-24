const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const submit = document.querySelector('#go');

function addZero(x) {
  if (x < 10) {
    return `0${x}`;
  }
  return x;
}

function ignoreSubtitled(showing) {
  if (!(Object.prototype.hasOwnProperty.call(showing, 'properties') && Object.prototype.hasOwnProperty.call(showing.properties, 'event.film.subtitled'))) {
    return true;
  }
  return false;
}

function hasRunTime(film) {
  if (Object.prototype.hasOwnProperty.call(film.properties, 'film.running-time')) {
    return /* html */`
    <p>${film.properties['film.running-time']} mins</p>
    `;
  }
  return '';
}

function getFilms(e) {
  const key = document.querySelector('#key').value;
  const cinema = document.querySelector('#cinema').value;
  const headers = new Headers();

  e.preventDefault();
  headers.set('Authorization', `Bearer ${key}`);

  fetch(`https://api.list.co.uk/v1/events?place_id=${cinema}&tags=film`, { headers })
    .then(response => response.json())
    .then((data) => {
      const results = document.querySelector('#results');
      results.innerHTML = '';

      data.forEach((film) => {
        let prevDate;
        let dayRow;
        let timesCell = document.createElement('td');
        const showtimesTable = document.createElement('table');
        const showtimesData = film.schedules[0].performances;

        showtimesData.filter(ignoreSubtitled).forEach((showing) => {
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

        const filmCard = /* html */`
      <article data-id="${film.event_id}" class="film">
      <div class="film__body">
      <h2>${film.name}</h2>
      ${hasRunTime(film)}
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
      results.innerHTML += /* html */`
    <div class="print"><a href="javascript:window.print()" class="print__button">print</a></div>
    `;
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

window.onbeforeprint = prepareForPrint;

submit.addEventListener('click', getFilms);
