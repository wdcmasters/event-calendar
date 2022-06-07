function addEvent()
{
    //Getting event name from page
    let eventName = document.getElementById("event-name").value;
    //Getting event address from page
    let street = document.getElementById("street").value;
    let suburb = document.getElementById("suburb").value;
    let state = document.getElementById("state").value;
    let zip = document.getElementById("zip").value;
    let country = document.getElementById("country").value;
    //Getting event time from page

    //Putting into object
    let userLogin = { email: userEmail, password: userPassword };


    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        window.location.href = '/Dashboard.html'; // redirects to dashboard
      }
      else if (this.readyState == 4 && this.status >=400){
        alert("Couldn't create event. Try again.");
      }

    };

    //Open the request
    xhttp.open("POST", "/login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(userLogin));
}