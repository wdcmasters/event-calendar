// hide pop up divs
function hidePopup() {
    var popups = document.getElementsByClassName("popup");

    for (let i=0; i<popups.length; i++) {
        popups[i].style.display = "none";
    }
}

// display pop up for entering event id
function showEventSearch() {
    document.getElementById("event-container").style.display = "block";
}
// checks if eventID exists in database, then run getDetails()
function getEvent() {
    let event_id = document.getElementById("eventID").value;

    //Putting into object
    let details = {eventID: event_id};

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        window.location.href = '/book_event.html';
      } else if (this.readyState == 4 && this.status >=400){
        alert("Event ID does not exist. Try again.");
      }
    };

    //Open the request
    xhttp.open("POST", "/event/match_id");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(details));
}




