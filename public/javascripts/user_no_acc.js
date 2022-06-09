// user without account clicks submit

function guest() {
    let first_name = document.getElementsByName("firstName")[0].value;
    let last_name = document.getElementsByName("lastName")[0].value;
    let guest =   { first_name: first_name, last_name: last_name };


    //AJAX
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = "/book_event.html";
        } else if (this.readyState == 4 && this.status >=400){
            alert("Could not create guest");
        }
    };

    //Open the request
    xhttp.open("POST", "/event/respond/guest?eventID="+req.session.eventID);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(guest));
}

/*
function guest() {
    let firstName = document.getElementsByName("firstName")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let guest =   { first_name: firstName, last_name: lastName };

// function guest() {
//     let firstName = document.getElementsByName("firstName")[0].value;
//     let lastName = document.getElementsByName("lastName")[0].value;
//     let guest =   { first_name: firstName, last_name: lastName };

//     //AJAX
//     let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = ".html";
        } else if (this.readyState == 4 && this.status >=400){
            alert("Could not create guest");
        }
    };
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



