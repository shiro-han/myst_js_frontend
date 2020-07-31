const API_URL = "https://api-v3.igdb.com/games"
const container = document.querySelector("#game-info");
const addBttn = document.querySelector('#addCollection')

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
        let displayedGame = games.find(game => game.api_id === id);
        container.dataset.railsId = displayedGame.id;
        if (gameOwnedChecker(displayedGame.users)) {
            document.querySelector('#addCollection').dataset.owned = true
        }
        getGameRender(gameID);
    }
    else {
        console.log('uploading game to rails');
        getGamePost(gameID);
    }
}

const gameOwnedChecker = (users) => {
    return users.map(user => user.id).some(id => id === userID)
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
    if (addBttn.dataset.owned === "true") {
        console.log('game in collection')
        addBttn.className = "btn btn-danger float-right"
        addBttn.innerText = "Remove From Collection"
    }

    const mainIMG = document.querySelector('#main-img')
    mainIMG.src = imgURL(game.cover.url)

    container.innerHTML = `
    <h1 class='app-text'>${game.name}</h1>
    <div class="row app-text">
        <div class="col-3">
            <p>Average Rating: <span class="badge badge-success">${Math.floor(game.aggregated_rating)}</span></p>
        </div>
        <div class="col">
            <p>Release Date: ${convertDate(game.first_release_date)}</p>
        </div>
    </div>
    <div class="row app-text">
        <div id="genres" class="col">
        </div>
        <div id="platforms" class="col">
        </div>
    </div>
    <p class='app-text'><u>Summary:</u></p>
    <p class='app-text'>${game.summary}</p>
    `
    let genres = container.querySelector('#genres')
    genres.appendChild(pElement(game, 'genres'))
    let platforms = container.querySelector('#platforms')
    platforms.appendChild(pElement(game, 'platforms'))

    if (!!game.storyline){
        let slHead = document.createElement('p')
        slHead.innerHTML='<u>Story Line:</u>'
        slHead.className = 'app-text'
        slBody = document.createElement('p')
        slBody.innerText = game.storyline
        slBody.className = 'app-text'
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

    const recommended = document.querySelector('#game-grid')
    let newRow = document.createElement('div')
    newRow.className = 'row';
    for (let i = 0; i < 4; i++) {
        let newDiv = returnGameDiv(game['similar_games'][i]);
        newRow.append(newDiv);
    }
    recommended.append(newRow);
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

const addGameToCollection = (userID, railsID) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json')

    let bodyObj = {
        user_id: userID,
        game_id: railsID
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObj)
    }

    fetch(RAILS_URL + 'user_games', requestOptions)
        .then(resp => resp.json())
        .then(json => window.location.replace('/collection.html'))
}

const fetchUserGames = () => {
    fetch(RAILS_URL + 'user_games')
        .then(resp => resp.json())
        .then(json => findUserGame(json))
}

const findUserGame = (userGames) => {
    console.log(userGames)
    let railsID = parseInt(container.dataset.railsId, 10)
    let output = userGames.find(userGame => userGame.user_id === userID && userGame.game_id === railsID)
    removeGameFromCollection(parseInt(output.id, 10))
}

const removeGameFromCollection = (id) => {
    fetch(RAILS_URL + 'user_games' + `/${id}`, {
        method: 'DELETE'
    }).then(resp => resp.json())
    .then(data => window.location.replace('/collection.html'))
}

const convertDate = (date) => {
    let readDate = new Date(date * 1000)
    let showDate = `${readDate.getMonth() + 1}/${readDate.getDate()}/${readDate.getFullYear()}`
    return showDate
}

document.addEventListener('DOMContentLoaded', () => {
    railsGames()
    addBttn.addEventListener('click', (e) => {
        if (!!userID){
            let railsID = parseInt(container.dataset.railsId, 10)
            if (addBttn.dataset.owned === "true") {
                fetchUserGames()
            } else {
                addGameToCollection(userID, railsID);
            }
        } else {
            window.location.replace('/login.html')
        }
        
    })

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('grid-image' || 'grid-title')) {
            e.preventDefault()
            document.cookie = `game=${e.target.parentElement.parentElement.dataset.id}`
            window.location.replace('/game.html')
        }
    })
})