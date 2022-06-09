/* Duplicates time slots */
var num_times = 1;
function addMoreTimes() {
  let times_div = document.getElementsByClassName("time-div")[0];
  let duplicate_time = times_div.cloneNode(true);
  duplicate_time.id = "";
  times_div.parentNode.appendChild(duplicate_time);
  num_times += 1;
}

/* Add event detail to database */
function addEvent(){
    //Getting event name from page
    let eventName = document.getElementById("event-name").value;

    //Getting event address from page
    let street_no = document.getElementById("street-no").value;
    let street = document.getElementById("street").value;
    let suburb = document.getElementById("suburb").value;
    let state = document.getElementById("state").value;
    let post_code = document.getElementById("post-code").value;
    let country = document.getElementById("country").value;

    let date = document.getElementById("date").value;

    //Putting into object
    let event_details = {
      eventName: eventName,
      street_no: street_no,
      street: street,
      suburb: suburb,
      state: state,
      post_code: post_code,
      country: country,
      date: date
    };

    // //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        console.log("Input data into database successfully");
        addEventTimes();
      }
      else if (this.readyState == 4 && this.status >=400){
        console.log("couldn't place data in database");
      }
    };

    // //Open the request
    xhttp.open("POST", "/event/add_event"); // post: sending info to server
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(event_details));
}

function updateUsersEvents()
{
  // //AJAX
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
      console.log("Updated users_events succesfully");
      window.location.href = '/show_event.html';
    }
    else if (this.readyState == 4 && this.status >=400) {
      console.log("Couldn't update users_events");
    }
  };

  //Open the request
  xhttp.open("GET", "/event/add_event/users_events");
  xhttp.send();
}

/* Adds proposed times to database */
function addEventTimes() {

  for (let i=0; i < num_times; i++) {
    let start_time = document.getElementsByClassName("start-time")[i].value;
    let end_time = document.getElementsByClassName("end-time")[i].value;

    let event_times = {
      start: start_time,
      end: end_time
    };

    // //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        num_times = 1;
        console.log("Input times into database successfully");
        updateUsersEvents();
      }
      else if (this.readyState == 4 && this.status >=400){
        console.log("couldn't place data in database");
      }
    };

    // //Open the request
    xhttp.open("POST", "/event/add_event/times"); // post: sending info to server
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(event_times));

  }
}