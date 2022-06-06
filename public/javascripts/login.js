function onSignIn(googleUser) {

  // for basic testing
  // var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  // once login is successful, send id token to server
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      //alert("Login successful");
      //window.location.href = '/Dashboard.html';
      console.log("Google login successful");
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