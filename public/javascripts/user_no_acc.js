// user without account clicks link
function no_acc() {
    location.href = "<url>/event/id". // setting url
    var url = window.location.href;  //getting the url of the page
    var splitUrl = myString.split('/');
    var eventId = splitUrl[splitUrl.length - 1];  //event id stored into id


    //AJAX to fetch event data
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {

            console.log(eventId)

        } else if (this.readyState == 4 && this.status >=400){

        }
    };

    xhttp.open("GET", "/event_details");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(eventId));


}




