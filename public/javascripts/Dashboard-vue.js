var vueinst = new Vue({
    el: "#events",
    data: {
        userId: 99,
        events: []
    },
    methods: {
        getUserID: function (event) {

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200)
                {
                    let response = JSON.parse(xhttp.responseText);
                    this.userId = response[0].userID;
                }
            }

            xhttp.open("GET", "/users/getID", true);
            xhttp.send();

        },

        getEvents: function (event) {

            this.getUserID();

            var xhttp = new XMLHttpRequest();

            let userID = { userID: this.userId };

            /*Parse response into this.events */
            xhttp.onreadystatechange = function () {

                //Putting into temp variable
                if (xhttp.readyState == 4 && xhttp.status == 200)
                {
                    console.log(xhttp.responseText);
                    let receivedEvents = JSON.parse(xhttp.responseText);

                    console.log(receivedEvents);

                    //Looping through received event
                    for (i in receivedEvents)
                    {

                        //Storing entries for i event
                        let eventName = receivedEvents[i].eventName;
                        let suburb = receivedEvents[i].suburb;
                        let country = receivedEvents[i].country;
                        let date = receivedEvents[i].date;
                        let start_time = receivedEvents[i].date;

                        //Parsing the date and time
                        //
                        //

                        //Creating object to put in array of objects
                        let newEvent = { EVENTNAME: eventName, SUBURUB: suburb, COUNTRY: country, DATE: date, START_TIME: start_time};
                        console.log(suburb);
                        this.events.push(newEvent);

                    }

                    console.log(this.events);
                }
            }
            xhttp.open("POST", "/users/getEvents");
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(userID));

        }



    }
});

