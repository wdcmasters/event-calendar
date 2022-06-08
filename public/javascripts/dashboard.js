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

// global var to store event id entered by user for searching
var e_id;

// checks if eventID exists in database, then run getDetails()
function getEvent() {
    let event_id = document.getElementById("eventID").value;
    e_id = event_id;

    //Putting into object
    let details = {eventID: event_id};

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        console.log("Event id matched");
        window.location.href = '/book_event.html';
      } else if (this.readyState == 4 && this.status >=400){
        console.log("failed");
      }
    };

    //Open the request
    xhttp.open("POST", "/event/match_id");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(details));
}

// function getDetails() {
//   let xhttp = new XMLHttpRequest();
// //   xhttp.onreadystatechange = function () {
// //     if(this.readyState == 4 && this.status == 200) {
// //        console.log(this.responseText);
// //         //window.location.href =
// //     } else if (this.readyState == 4 && this.status >=400){
// //        console.log("cannot get details");
// //      }
// //   };

//   let route = "/event/respond/?eventID="+encodeURIComponent(e_id);

//   //Open the request
//   xhttp.open("GET", route, true);
//   xhttp.send();

//   // guests would be provided a link as "/event/respond/guest/?eventID="+encodeURIComponent(e_id);
//   // https://flindyly-code50-83646358-q7pp9gwr92xw9.github.dev/event/respond/guest/?eventID=1
// }




