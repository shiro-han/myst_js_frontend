const API_URL = "https://api-v3.igdb.com/games"
const gameGrid = document.getElementById('game-grid')

console.log(document.cookie)
let searchTerm = document.cookie.split('search-term=')[1]

const getGamesForSearch = (searchTerm) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");

    const raw = `fields game.id, game.name, game.cover.url; search "${searchTerm}"; where themes != (42); limit 50; where game.category = 0;`;

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(CORS_URL + "https://api-v3.igdb.com/search/", requestOptions)
        .then(resp => resp.json())
        .then(json => {
            // debugger
            renderPage(json)
        })
        .catch(error => console.log('error', error));
}

const renderPage = (games) => {
    let j = 0;
    let n = 4;
    let newRow = document.createElement('div')
    newRow.className = 'row';
    for (let i=0; i < games.length; i++) {
        let newDiv = returnGameDiv(games[i]["game"]);
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
    gameDiv.className = "col-3 text-center my-auto"
    gameDiv.dataset.id = game.id
    let a = document.createElement('a')
    a.setAttribute('href', '/game.html')
    if (game.cover) {
        a.innerHTML = `
        <img class="grid-image" src="${imgURL(game.cover.url)}" style="width: 10rem;">
        <p class ="grid-title">${game.name}</p>
        `
    } else {
        a.innerHTML = `
        <p class ="grid-title">${game.name}</p>
        `
    }
    gameDiv.appendChild(a)
    return gameDiv
}

document.addEventListener("DOMContentLoaded", function() {
    getGamesForSearch(searchTerm)
})

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('grid-image' || 'grid-title')) {
        e.preventDefault()
        document.cookie = `game=${e.target.parentElement.parentElement.dataset.id}`
        window.location.replace('/game.html')
    }
})
