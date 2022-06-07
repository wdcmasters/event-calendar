function addEvent()
{
    //Getting event name from page
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