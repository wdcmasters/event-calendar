// user without account clicks link

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
    xhttp.open("POST", "/event/respond");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(guest));
}


function guest() {
    let firstName = document.getElementsByName("firstName")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let guest =   { first_name: firstName, last_name: lastName };

    //AJAX
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            window.location.href = ".html";
        } else if (this.readyState == 4 && this.status >=400){
            alert("Could not create guest");
        }
    };

    //Open the request
    xhttp.open("GET", "/guestDetails");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}



