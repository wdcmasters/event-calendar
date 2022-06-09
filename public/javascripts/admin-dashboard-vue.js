// VUE
var vueinst = new Vue({
    el: "#vueBody",
    data: {
        users: [],
        events: [],
        showUsers: true,
        showEvents: false
    },

    created () { /*Getting all users */
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200)
            {
                let response = JSON.parse(xhttp.responseText);

                for ( i in response)
                {
                    let userID = response[i].userID;
                    let first_name = response[i].first_name;
                    let last_name = response[i].last_name;
                    let email = response[i].email;
                    let password = response[i].password;

                    let newUser = { USERID: userID, FIRST_NAME: first_name, LAST_NAME: last_name, EMAIL: email, PASSWORD: password };
                    vueinst.users.push(newUser);
                }
            }
        }

        xhttp.open("GET", "/admin/getUsers", true);
        xhttp.send();
    },


    mounted () {
        this.showUsers = true;
        this.showEvents = false;
    },

    methods: {

        toggleUsers: function (event) {
            this.showUsers = true;
            this.showEvents = false;
        },

        toggleEvents: function (event) {
            this.showUsers = false;
            this.getEvents();
            this.showEvents = true;
        },

        getEvents: function (event) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200)
                {
                    let response = JSON.parse(xhttp.responseText);

                    vueinst.events = [];

                    for ( i in response)
                    {
                        let eventID = response[i].eventID;
                        let eventName = response[i].eventName;
                        let street_no = response[i].street_no;
                        let street = response[i].street;
                        let suburb = response[i].suburb;
                        let state = response[i].state;
                        let post_code = response[i].post_code;
                        let country = response[i].country;
                        let date = response[i].date;
                        date = date.slice(0,10);
                        let userID = response[i].userID;

                        newEvent = { EVENTID: eventID, EVENTNAME: eventName, STREET_NO: street_no, STREET: street, SUBURB: suburb, STATE: state, POST_CODE: post_code, COUNTRY: country, DATE: date, USERID: userID }

                        vueinst.events.push(newEvent);
                    }
                }
            }

            xhttp.open("GET", "/admin/getEvents", true);
            xhttp.send();
        }
    }

});

