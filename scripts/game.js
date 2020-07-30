const API_URL = "https://api-v3.igdb.com/games"
const gameID = parseInt(document.cookie.split('game=')[1], 10)
const userID = parseInt(document.cookie.split('userid=')[1], 10)
const container = document.querySelector("#game-info");

const getGameRender = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");
    
    const raw = `fields id, aggregated_rating, cover.url, first_release_date, genres.name, name, platforms.name, screenshots.url, similar_games.id, similar_games.name, similar_games.cover.url, storyline, summary; where id = ${id};`;
    
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    fetch(CORS_URL+API_URL, requestOptions)
        .then(resp => resp.json())
        .then(json => {
            renderGame(json[0]);
        })
        .catch(error => console.log('error', error));
}

const getGamePost = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("user-key", API_KEY);
    myHeaders.append("Content-Type", "text/plain");
    
    const raw = `fields id, aggregated_rating, cover.url, first_release_date, genres.name, name, platforms.name, screenshots.url, similar_games.id, similar_games.name, similar_games.cover.url, storyline, summary; where id = ${id};`;
    
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    fetch(CORS_URL+API_URL, requestOptions)
        .then(resp => resp.json())
        .then(json => {
            postGameToRails(json[0]);
        })
        .catch(error => console.log('error', error));
}

const railsGames = () => {
    fetch(RAILS_URL + 'games')
        .then(resp => resp.json())
        .then(json => gameRailsDBChecker(json, gameID))
}

const gameRailsDBChecker = (games, id) => {
    if (games.some(game => game.api_id === id))
    {
        console.log('game already exists in rails');
        container.dataset.railsId = games.find(game => game.api_id === id).id
        getGameRender(gameID)
    }
    else {
        console.log('uploading game to rails')
        getGamePost(gameID)
    }
}

const postGameToRails = (gameObj) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json')

    let bodyObj = {
        name: gameObj.name,
        api_id: gameObj.id
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObj)
    }

    fetch(RAILS_URL + 'games', requestOptions)
        .then(resp => resp.json())
        .then(json => {
            container.dataset.railsId = json.id;
            getGameRender(json.api_id);
        })
}

const renderGame = (game) => {
    const mainIMG = document.querySelector('#main-img')
    mainIMG.src = imgURL(game.cover.url)

    container.innerHTML = `
    <h1><u>${game.name}</u></h1>
    <div class="row">
        <div class="col-3">
            <p>Average Rating: <span class="badge badge-success">${Math.floor(game.aggregated_rating)}</span></p>
        </div>
        <div class="col">
            <p>Release Date: ${game.first_release_date}</p>
        </div>
    </div>
    <div class="row">
        <div id="genres" class="col-3">
        </div>
        <div id="platforms" class="col">
        </div>
    </div>
    <p><u>Summary:</u></p>
    <p>${game.summary}</p>
    `
    let genres = container.querySelector('#genres')
    genres.appendChild(pElement(game, 'genres'))
    let platforms = container.querySelector('#platforms')
    platforms.appendChild(pElement(game, 'platforms'))

    if (!!game.storyline){
        let slHead = document.createElement('p')
        slHead.innerHTML='<u>Story Line:</u>'
        slBody = document.createElement('p')
        slBody.innerText = game.storyline
        container.append(slHead, slBody)
    }

    const carousel = document.querySelector('#screenshots')
    game.screenshots.forEach(screenshot => {
        let div = document.createElement('div')
        if (!carousel.children[0]) {
            div.className = "carousel-item active"
        } else {
            div.className = "carousel-item"
        }
        div.innerHTML = `
        <img src="${imgURL(screenshot.url, 'screenshot_med')}" class="center-block w-auto">
        `
        carousel.appendChild(div)
    })

}

document.addEventListener('DOMContentLoaded', () => {
    railsGames()
    addBttn = document.querySelector('#addCollection')
    addBttn.addEventListener('click', (e) => {
        if (!!userID){
            window.location.replace('/collection.html')
        } else {
            window.location.replace('/login.html')
        }
        
    })
})