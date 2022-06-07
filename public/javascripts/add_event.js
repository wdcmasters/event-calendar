function addEvent()
{
    //Getting event name from page
    let eventName = document.getElementById("event-name").value;
    //Getting event address from page
    let street_no = document.getElementById("street-no").value;
    let street = document.getElementById("street").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let post_code = document.getElementById("post-code").value;
    let country = document.getElementById("country").value;
    //Getting event time from page
    let date = document.getElementById("date").value
    let start_time = document.getElementById("from-time")[0].value
    let fin_time = document.getElementById("to-time")[0].value

    //Putting into object
    let event_details = {
      street_no: street_no,
      street: street,
      city: city,
      state: state,
      post_code: post_code,
      country: country,
      date: date,
      start_time: start_time,
      fin_time: fin_time
    };

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
    xhttp.send(JSON.stringify(event_details));
}