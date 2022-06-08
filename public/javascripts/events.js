// display pop up for entering event id
function showEventSearch() {
    document.getElementById("event-container").style.display = "block";
}

var e_id;
// var event_id = document.getElementById("eventID").value;
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
        getDetails();
      } else if (this.readyState == 4 && this.status >=400){
        console.log("failed");
      }
    };

    //Open the request
    xhttp.open("POST", "/event/matchid");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(details));
}

function getDetails() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
       console.log(this.responseText);
        //window.location.href =
    } else if (this.readyState == 4 && this.status >=400){
       console.log("cannot get details");
     }
  };
  //let route = "/event/respond/:" + e_id;
  let route = "/event/respond/?eventID="+encodeURIComponent(e_id);
  //Open the request
  xhttp.open("GET", route, true);
  xhttp.send();
}

// var findEvent = new Vue({
//     el: '#event-container',
//     data: {
//         eventID: ""
//     },
//     methods: {
//         getEvent: function() {
//             var xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function() {
//                 if (xhttp.readyState == 4 && xhttp.status == 200) {
//                     console.log("matched event id successfully");
//                 }
//             };
//             xhttp.open("POST", "/event/matchid");
//             xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//             xhttp.send(JSON.stringify(findEvent.eventID));
//         }
//     }
// });