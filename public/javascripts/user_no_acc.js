// When user without account clicks link
function no_acc_link() {
    location.href = "/event/id"
    var url = window.location.href;  //getting the url of the page
    var splitUrl = myString.split('/');
    var event_id = splitUrl[splitUrl.length - 1];  //event id stored into id


    //AJAX to fetch event data
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            //alert("Login successful");
            window.location.href = '/Dashboard.html';
        } else if (this.readyState == 4 && this.status >=400){
            alert("Could not create account. ");
        }
    };

}




