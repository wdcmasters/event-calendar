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

// sign out
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
      console.log('User signed out.');
    });
}