function generateLink() {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        let eventID = this.responseText;
        let url = location.href + "/event/respond/guest?eventID=" + eventID;
        document.getElementById("no-account-link").innerText = url;
      }
      else if (this.readyState == 4 && this.status >=400){
        console.log("Couldn't generate link");
      }
    };

    // //Open the request
    xhttp.open("GET", "/event/get_id");
    xhttp.send();
}