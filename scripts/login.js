const formLogin = document.querySelector('#login')
const formRegister = document.querySelector('#register')
let userList = []

function getUsers() {
    fetch(RAILS_URL + 'users')
        .then(resp => resp.json())
        .then(json => userList = json)
        .catch(error => console.log('error', error))
}

const registerUser = (userObj) => {
    let myHeaders = new Headers();
    myHeaders.append('content-type', 'application/json');
    myHeaders.append('accept', 'application/json');

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
        .then(json => {
            document.cookie = `userid=${json.id}`
            window.location.replace('/collection.html')
        })
}

getUsers()

formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    let username = document.getElementById('username-login').value;
    let userFound = false
    for (let user in userList) {
        if (userList[user]["username"] === username) {
            userFound = true
            document.cookie = `userid=${userList[user]['id']}`
            document.cookie = "error=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            window.location.replace('/collection.html')
        }
    }
    if (userFound === false) {
        let errorMessage = document.getElementById('loginHelp')
        errorMessage.innerText = "That username doesn't exist. Please try again."
        errorMessage.classList.add('error');
    }
})

formRegister.addEventListener("submit", (e) => {
    e.preventDefault();

    userObj = {
    username: document.getElementById('username-register').value,
    email: document.getElementById('email-register').value,
    profile_pic: document.getElementById('pic-register').value,
    bio: document.getElementById('bio-register').value
    }

    if (!userObj.username || !userObj.email || !userObj.profile_pic || !userObj.bio) {
        document.getElementById('registerError').innerText = "Please fill out all fields in the regsiter form."
    } else {
        document.cookie = "error=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        registerUser(userObj)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    if (!!errorMessage) {
        document.getElementById('error').innerText = "You can't perform that action unless you are logged in. Please try again once you are logged in."
    }
})