// user without account clicks link
/*
function no_acc() {

    location.href = "<url>/event/id". // setting url
    var url = window.location.href;  //getting the url of the page
    var splitUrl = myString.split('/');
    var eventId = splitUrl[splitUrl.length - 1];  //event id stored into id


    //AJAX to fetch event data
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {


        } else if (this.readyState == 4 && this.status >=400){

        }
    };

    xhttp.open("GET", "/event_details");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(eventId));


}
*/

function guest() {
    let firstName = document.getElementsByName("firstName")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let guest =   { first_name: firstName, last_name: lastName };

    //AJAX
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "book_event.html";
        } else if (this.readyState == 4 && this.status >=400){
            alert("Could not create guest");
        }
    };

    //Open the request
    xhttp.open("POST", "/event/respond/guest/details");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(guest));
}


// function guest() {
//     let firstName = document.getElementsByName("firstName")[0].value;
//     let lastName = document.getElementsByName("lastName")[0].value;
//     let guest =   { first_name: firstName, last_name: lastName };

//     //AJAX
//     let xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function () {
//         if(this.readyState == 4 && this.status == 200) {
//             window.location.href = "pop_up_guest.html";
//         } else if (this.readyState == 4 && this.status >=400){
//             alert("Could not create guest");
//         }
//     };

//     //Open the request
//     xhttp.open("GET", "/guestDetails");
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send();
// }




