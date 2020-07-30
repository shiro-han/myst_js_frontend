const API_URL = "https://api-v3.igdb.com/games"
const gameGrid = document.getElementById('game-grid')
const userID = document.cookie.split('userid=')[1]

function getUserGames() {
    fetch(`${RAILS_URL}users/${userID}`)
        .then(resp => resp.json())
        .then(json => {
            getGameIds(json["games"]);
        })
        .catch(error => console.log('error', error))
}

function getGameIds(list) {
    let gameIDS = []
    for (let game in list) {
        gameIDS.push(list[game]['api_id'])
    }
    buildGamesList(gameIDS)
}

function buildGamesList(idsList) {
        let myHeaders = new Headers();
        myHeaders.append("user-key", API_KEY);
        myHeaders.append("Content-Type", "text/plain");
    
        const raw = `fields id, cover.url, name; where id = ${idsList.toString()};`;
    
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        fetch(CORS_URL+API_URL, requestOptions)
            .then(resp => resp.json())
            .then(json => {
                renderPage(json);
            })
            .catch(error => console.log('error', error));
}

const renderPage = (games) => {
    let j = 0;
    let n = 4;
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
    gameGrid.append(newRow)
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

document.addEventListener("DOMContentLoaded", () => {
    getUserGames();

    document.addEventListener('click', function(e) {
        e.preventDefault()
        if (e.target.classList.contains('grid-image' || 'grid-title')) {
            document.cookie = `game=${e.target.parentElement.parentElement.dataset.id}`
            window.location.replace('/game.html')
        }
    })
})
