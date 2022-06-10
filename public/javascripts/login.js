/* Get name of user to display in profile on top right */
function getProfile() {
  //AJAX
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
     document.getElementById("profile-name").innerText = JSON.parse(this.responseText)[0].first_name;
    } else if (this.readyState == 4 && this.status >=400){
      console.log("Cannot retrieve user name");
    }
  };

  //Open the request
  xhttp.open("GET", "/users/get_name");
  xhttp.send();
}

/*LOGIN*/
function login()
{
    //Getting email and password from page
    let userEmail = document.getElementById("name").value;
    let userPassword = document.getElementById("name1").value;

    //Putting into object
    let userLogin = { email: userEmail, password: userPassword };


    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        //alert("Login successful");
        window.location.href = '/Dashboard.html';
      } else if (this.readyState == 4 && this.status >=400){
        alert("Login failed. Try again.");
      }

    };

    //Open the request
    xhttp.open("POST", "/login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(userLogin));
}

/* Google sign in */
function onSignIn(googleUser) {
  googleSignOut();
  var token = googleUser.getAuthResponse().id_token;

  // once login is successful, send id token to server
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      window.location.href = '/Dashboard.html';
      console.log("Google login successful.");
    } else if (this.readyState == 4 && this.status >=400){
      alert("Login failed. Try again.");
    }
  };

  xhttp.open('POST', '/users/logintest');
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({
    token: googleUser.getAuthResponse().id_token
  }));
}

/* Signing out */
function signOut() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      console.log("Sign out successful");
      window.location.href = '/index.html';
    } else if (this.readyState == 4 && this.status >= 400){
      console.log("Sign out failed");
    }
  };

  xhttp.open("POST", "/users/signout");
  xhttp.send();
}

/* sign out google user from app every time button loads on either sign up or login page */
function googleSignOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  auth2.disconnect();
}