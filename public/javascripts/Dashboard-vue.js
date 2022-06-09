// VUE
var vueinst = new Vue({
    el: "#vueBody",
    data: {
        userID: 99,
        eventsPopulated: false,
        search: 'Search your events',
        populatedOnce: false,
        events: [],
        showFilter: false
    },

    created () { /*Getting the ID of the user*/
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200)
            {
                let response = xhttp.responseText;
                vueinst.userID = response;
                // console.log(response);
                // console.log("UserID (getid function): "+vueinst.userID);
            }
        }

        xhttp.open("GET", "/users/getID", true);
        xhttp.send();
    },

    mounted () {
    },

    methods: {

        populateCaller: function(event) {
            if (this.populatedOnce == false)
            {
                this.populatedOnce = true;
                setTimeout(this.initialPopulate, 500);
            }
            else
            {
                setTimeout(this.initialPopulate, 10000);
            }
        },

        initialPopulate: function (event) {
            var xhttp = new XMLHttpRequest();


            // console.log("ID to send: "+this.userID);
            userId_object = { userID: this.userID };
            console.log(userId_object);

            /*Parse response into this.events */
            xhttp.onreadystatechange = function () {

                //Putting into temp variable
                if (xhttp.readyState == 4 && xhttp.status == 200)
                {
                    console.log(xhttp.responseText);
                    let receivedEvents = JSON.parse(xhttp.responseText);

                    document.getElementById("events").innerHTML = "";

                    for (i in receivedEvents)
                    {

                    //Putting into variable
                    let eventID = receivedEvents[i].eventID;
                    let eventName = receivedEvents[i].eventName;
                    let streetNo = receivedEvents[i].street_no;
                    let street = receivedEvents[i].street;
                    let suburb = receivedEvents[i].suburb;
                    let country = receivedEvents[i].country;
                    let date = receivedEvents[i].date;
                    date = date.slice(5,10);
                    let start_time = receivedEvents[i].start_time;
                    start_time = start_time.slice(0, 5); // Parsing time

                    let newEvent = { EVENTID: eventID, EVENTNAME: eventName, STREETNO: streetNo, STREET: street, SUBURB: suburb, COUNTRY: country, DATE: date, START_TIME: start_time};

                    // console.log(newEvent);
                    vueinst.events.push(newEvent);
                    }
                }
            }


            xhttp.open("POST", "/users/getEvents");
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(userId_object));

        }
    }

});

