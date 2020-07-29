const CORS_URL = 'https://damp-taiga-79758.herokuapp.com/'
const API_URL = "https://api-v3.igdb.com/games"
const RAILS_URL = "http://localhost:3000/"
const API_KEY = 'cfc722389b379cdc9ee497832c009ac3'

const fetchRailsUsers = () => {
    fetch (RAILS_URL + 'users')
        .then(resp => resp.json())
        .then(json => console.log(json))
}

const registerUser = (userObj) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json')

    let bodyObj = {
        username: userObj.username,
        bio: userObj.bio,
        email: userObj.email,
        profile_pic: userObj.profile_pic
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bodyObj)
    }

    fetch(RAILS_URL + 'users', requestOptions)
        .then(resp => resp.json())
        .then(json => console.log(json))
}