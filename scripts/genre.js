const API_URL = "https://api-v3.igdb.com/games"
const gameGrid = document.getElementById('game-grid')

console.log(document.cookie)
let genreID = parseInt(document.cookie.split('genre=')[1], 10)
let genreName = (document.cookie.split('; ')[1]).split('genre_name=')[1]
let genreList = []

const getGenreList = () => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", "cfc722389b379cdc9ee497832c009ac3");
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Cookie", "__cfduid=dc4622210358dc9f2e6fbe9dcb5a930ca1595946479");

    const raw = "fields name; limit 100;";

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/genres/", requestOptions)
        .then(response => response.json())
        .then(json => {
            genreList = json
        })
        .catch(error => console.log('error', error));
}

const getGamesForGenre = (genreID) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = `fields id, cover.url, name, genres; where genres = ${genreID}; limit 25; sort popularity desc;`;

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/games/", requestOptions)
        .then(resp => resp.json())
        .then(json => renderPage(json))
        .catch(error => console.log('error', error));
}

const renderPage = (games) => {
    let j = 0;
    let n = 4;
    let title = document.querySelector('.genre-title')
    title.innerText = genreName
    let newRow = document.createElement('div')
    newRow.className = 'row';
    for (let i=0; i < games.length; i++) {
        let newDiv = returnGameDiv(games[i]);
        newRow.append(newDiv);
        j++;
        if (j === n) {
            gameGrid.append(newRow);
            newRow = document.createElement('div');
            newRow.className = 'row';
            j = 0;
        }
    }
}

const returnGameDiv = (game) => {
    const gameDiv = document.createElement('div')
    gameDiv.className = "col-3 text-center"
    gameDiv.dataset.id = game.id
    let a = document.createElement('a')
    a.setAttribute('href', '/game.html')
    a.innerHTML = `
        <img class="grid-image" src="${imgURL(game.cover.url)}" style="width: 10rem;">
        <p class ="grid-title">${game.name}</p>
    `
    gameDiv.appendChild(a)
    return gameDiv
}

document.addEventListener('DOMContentLoaded', () => {
    getGenreList()
    getGamesForGenre(genreID)
    
    document.addEventListener('click', function(e) {
        e.preventDefault()
        if (e.target.classList.contains('grid-image' || 'grid-title')) {
            document.cookie = `game=${e.target.parentElement.parentElement.dataset.id}`
            window.location.replace('/game.html')
        }
    })
    
})