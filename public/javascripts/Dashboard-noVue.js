/* DATA */
var userID = 99;
var events = [];
var id_acquired = 0


// function caller
function caller()
{
    getId();
    setTimeout(getEvents, 200);
    setTimeout(populateEvents, 400);
}

caller();
setInterval(caller, 7000);

function clearEvents()
{
    document.getElementById("events").innerHTML = "";
}

function populateEvents()
{

    clearEvents();

    //Populating the events
    let eventsContainer = document.getElementById("events");

    for (i in events)
    {
        //Event div
        let eventDiv = document.createElement("div");
        eventDiv.setAttribute("class", "event");

        //Date time div & contents
        let dateTimeDiv = document.createElement("div");
        dateTimeDiv.setAttribute("class", "dateTime");

        let dateP = document.createElement("p"); //Date
        dateP.setAttribute("class", "date");

        let calendarIcon = document.createElement("i");
        calendarIcon.setAttribute("class", "fa-solid fa-calendar");

        let dateSpan = document.createElement("span");
        dateSpan.innerText = events[i].DATE;

        dateP.appendChild(calendarIcon);
        dateP.appendChild(dateSpan);

        let timeP = document.createElement("p"); //Time
        timeP.setAttribute("class", "time");

        let clockIcon = document.createElement("i");
        clockIcon.setAttribute("class", "fa-solid fa-clock");

        let timeSpan = document.createElement("span");
        timeSpan.innerText = events[i].START_TIME;

        timeP.appendChild(clockIcon);
        timeP.appendChild(timeSpan);

        dateTimeDiv.appendChild(dateP);
        dateTimeDiv.appendChild(timeP);

        eventDiv.appendChild(dateTimeDiv);

        //Name & Locale div & contents
        let nameLocale = document.createElement("div");
        nameLocale.setAttribute("class", "nameLocale");

        let eventName = document.createElement("h3"); //Name
        eventName.setAttribute("class", "eventName");

        let eventLink = document.createElement("a");
        eventLink.setAttribute("href", "/editEvent.html?eventCode="+events[i].EVENTNAME); //Want to make id but need to update query & array
        eventLink.innerText = events[i].EVENTNAME;

        eventName.appendChild(eventLink);
        nameLocale.appendChild(eventName);

        let eventLocation = document.createElement("p");
        eventLocation.setAttribute("class", "eventLocation");

        let geoIcon = document.createElement("p");
        geoIcon.setAttribute("class", "fa-solid fa-location-pin");

        let locationSpan = document.createElement("span");
        locationSpan.innerText = " "+events[i].SUBURB+", "+events[i].COUNTRY;

        eventLocation.appendChild(geoIcon);
        eventLocation.appendChild(locationSpan);

        nameLocale.appendChild(eventLocation);

        eventDiv.appendChild(nameLocale);

        eventsContainer.appendChild(eventDiv);
    }


}


/** ROUTES **/
function getId()
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
            // console.log(xhttp.responseText);
            let receivedEvents = JSON.parse(this.responseText);

            events = [];

            for (i in receivedEvents)
            {
                //Putting into variable
                let eventName = receivedEvents[i].eventName;
                let suburb = receivedEvents[i].suburb;
                let country = receivedEvents[i].country;
                let date = receivedEvents[i].date;
                date = date.slice(5,10);
                let start_time = receivedEvents[i].date;
                start_time = start_time.slice(11, 16); // Parsing time



                let newEvent = { EVENTNAME: eventName, SUBURB: suburb, COUNTRY: country, DATE: date, START_TIME: start_time};

                console.log(newEvent);
                events.push(newEvent);
            }
        }
    }


    xhttp.open("POST", "/users/getEvents");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(userId_object));

}