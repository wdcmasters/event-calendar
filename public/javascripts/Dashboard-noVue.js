/* DATA */
var userID = 99;
var events = [];




/** ROUTES **/
function getId ()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
        {
            let response = JSON.parse(this.responseText);
            userID = response[0].userID;
            console.log("UserID (getid function): "+userID);
        }
    }

    xhttp.open("GET", "/users/getID", true);
    xhttp.send();
}

function getEvents()
{
    var xhttp = new XMLHttpRequest();

    console.log("ID to send: "+userID);
    userId_object = { userID: userID };
    console.log(userId_object);

    /*Parse response into this.events */
    xhttp.onreadystatechange = function () {

        //Putting into temp variable
        if (this.readyState == 4 && this.status == 200)
        {
            console.log(xhttp.responseText);
            let receivedEvents = JSON.parse(this.responseText);

            for (i in receivedEvents)
            {
                //Putting into variable
                let eventName = receivedEvents[i].eventName;
                let suburb = receivedEvents[i].suburb;
                let country = receivedEvents[i].country;
                let date = receivedEvents[i].date;
                let start_time = receivedEvents[i].date;

                let newEvent = { EVENTNAME: eventName, SUBURUB: suburb, COUNTRY: country, DATE: date, START_TIME: start_time};

                console.log(newEvent);
                events.push(newEvent);
            }
        }
    }


    xhttp.open("POST", "/users/getEvents");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(userId_object));

}