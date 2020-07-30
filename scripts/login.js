const form = document.querySelector('form')
let userList = []

function getUsers() {
    fetch(`${RAILS_URL}users`)
        .then(resp => resp.json())
        .then(json => userList = json)
        .catch(error => console.log('error', error))
}

getUsers()

form.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Clicked")
    let username = document.getElementById('username-input').value;
    let userFound = false
    for (let user in userList) {
        if (userList[user]["username"] === username) {
            userFound = true
            document.cookie = `userid=${userList[user]['id']}`
            window.location.replace('/collection.html')
        }
    }
    if (userFound === false) {
        let errorMessage = document.getElementById('usernameHelp')
        errorMessage.innerText = "That username doesn't exist. Please try again."
        errorMessage.classList.add('error');
    }
})