const API_URL = "https://api-v3.igdb.com/games"
const gameGrid = document.getElementById('game-grid')

function getUserGames() {
    fetch(`${RAILS_URL}users/${userID}`)
        .then(resp => resp.json())
        .then(json => {
            renderUser(json);
            getGameIds(json["games"]);
        })
        .catch(error => console.log('error', error))
}

function getGameIds(list) {
    if (!!list[0]){
        let gameIDS = []
        for (let game in list) {
            gameIDS.push(list[game]['api_id'])
        }
        buildGamesList(gameIDS)
    } else {
        document.getElementById('collect-header').innerText = `No Games Found In Collection`
    }
}

function buildGamesList(idsList) {
        let myHeaders = new Headers();
        myHeaders.append("user-key", API_KEY);
        myHeaders.append("Content-Type", "text/plain");
    
        const raw = `fields id, cover.url, name; where id = (${idsList.toString()}); limit 100;`;
    
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
    gameDiv.className = "col-3 text-center zoom"
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

const renderUser = (user) => {
    document.getElementById('username').innerText = user.username;
    document.getElementById('profile-pic').src = user.profile_pic;
    document.getElementById('bio').innerText = user.bio;
    document.getElementById('game-number').innerText = user.games.length;
}

document.addEventListener("DOMContentLoaded", () => {
    getUserGames();

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('grid-image' || 'grid-title')) {
            e.preventDefault()
            document.cookie = `game=${e.target.parentElement.parentElement.dataset.id}`
            window.location.replace('/game.html')
        }
    })
})
