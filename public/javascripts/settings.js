// When the user clicks on <span> (x), close the modal
function closePopUp() {
    let pop_ups = document.getElementsByClassName("popup");
    for (let i=0; i<pop_ups.length; i++) {
        pop_ups[i].style.display = "none";
    }
}

/* updates account details on page */
function getAccountDetails() {
    getProfile(); // defined in login.js
    let name_field = document.getElementById("user-name");
    let email_field = document.getElementById("email");
    let password_field = document.getElementById("password");

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            let account_details = JSON.parse(this.responseText)[0];
            console.log(account_details);
            name_field.innerText = account_details.first_name + " " + account_details.last_name;
            email_field.innerText = account_details.email;

            if (account_details.password == null) {
                console.log("no password");
                document.getElementById("pwd-container").style.display = 'none';
                document.getElementById("change-email-btn").style.display = 'none';
            }
            else {
                console.log("password detected");
                let pwd = "";
                for (let i=0; i<(account_details.password).length; i++) {
                    pwd += "*";
                }
                password_field.innerText = pwd;
            }

        } else if (this.readyState == 4 && this.status >=400){
        console.log("Cannot retrieve account details");
        }
    };

    //Open the request
    xhttp.open("GET", "/users/get_user_details");
    xhttp.send();
}

// hide pop up divs
function hidePopup() {
    var popups = document.getElementsByClassName("popup");

    for (let i=0; i<popups.length; i++) {
        popups[i].style.display = "none";
    }
}

// show new email pop up div
function showEmailChange() {
    document.getElementById("email-container").style.display = "block";
}

// show new password pop up div
function showPasswordChange() {
    document.getElementById("password-container").style.display = "block";
}

function changeName() {
    let firstName = document.getElementById("firstname").value;
    let lastName = document.getElementById("lastname").value;

    let name_details = {
        first_name: firstName,
        last_name: lastName
    };

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = '/user-account.html';
        }
        else if (this.readyState == 4 && this.status >=400){
            alert("Error with name inputs");
        }
    };

    //Open the request
    xhttp.open("POST", "/users/change_name"); // post: sending info to server
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(name_details));
}

function changeEmail() {
    let newEmail = document.getElementById("new-email").value;
    let currentPwd = document.getElementById("current-pwd").value;

    let email_details = {
        new_email: firstName,
        current_pwd: currentPwd
    };

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            console.log("updated email successfully");
            window.location.href = '/user-account.html';
        }
        else if (this.readyState == 4 && this.status == 401){
            alert("Password does not match. Try again.");
        }
        else if (this.readyState == 4 && this.status >=400){
            alert("Error with email inputs");
        }
    };

    //Open the request
    xhttp.open("POST", "/users/change_email"); // post: sending info to server
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(email_details));
}

function changePassword() {
    let currentPwd = document.getElementById("current-pwd2").value;
    let newPwd = document.getElementById("new-pwd").value;
    let newPwd2 = document.getElementById("new-pwd-again").value;

    let password_details = {
        new_pwd: newPwd
    };

    // verify that passwords are the same
    if (newPwd != newPwd2) {
        alert("Passwords do not match. Try again.");
        return;
    } else {
        //AJAX
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                alert("Updated password successfully.");
                window.location.href = '/user-account.html';
            }
            else if (this.readyState == 4 && this.status >=400){
                console.log("Error with password inputs");
            }
        };

        //Open the request
        xhttp.open("POST", "/users/change_pwd"); // post: sending info to server
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(password_details));
    }
}