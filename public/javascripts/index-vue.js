var app = new Vue({
    el: '#vue-app',
    data: {
      show_home: true,
      show_login: true,
      google: true
    },
    methods: {
        onSignIn: function(googleUser) {
              // once login is successful, send id token to server
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                  alert("Login successful");
                  //window.location.href = '/public/Dashboard.html';
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
    }
  });