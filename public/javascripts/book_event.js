
// get event details from database based on event id stored in session
function getEventDetails() {
    // object to store details (given as an object) from database
    let details = [];

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        details = JSON.parse(this.responseText);

        /* Example of how response will be returned:
            [{"eventName":"Example bday","street_no":"136","street":"North tce","suburb":"Adelaide","state":"SA","post_code":"5000","country":"Australia","date":"2022-06-10T00:00:00.000Z"}]
        */
        let event_name = details[0].eventName;
        let event_address = details[0].street_no + " " + details[0].street + " " + details[0].suburb + " " + details[0].state + " " + details[0].post_code + " " + details[0].country;
        // format date to be more readable
        let d = new Date(details[0].date);
        let event_date = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear(); // note: month in getMonth() starts from 0

        document.getElementById("event-name").innerText = event_name;
        document.getElementById("location").innerText = event_address;
        document.getElementById("date").innerText = event_date;

        getEventHost();

      } else if (this.readyState == 4 && this.status >=400){
        console.log("failed to get details");
      }
    };

    //Open the request
    xhttp.open("GET", "/event/get_details");
    xhttp.send();
}

function getEventHost() {

    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        let host_details = JSON.parse(this.responseText);

        /* Example of how response will be returned:
            [{"first_name":"guest1","last_name":"last2"}]
        */
        let host_name = host_details[0].first_name + " " + host_details[0].last_name;
        document.getElementById("event-host").innerText = host_name;

      } else if (this.readyState == 4 && this.status >=400){
        console.log("failed to get host details");
      }
    };

    //Open the request
    xhttp.open("GET", "/event/get_host");
    xhttp.send();
}

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '395070286663-89a13j9p6bnq3ipd91072dfpjk2d61fj.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCa2qUGkFR0VtgoRjKiw6g-EhvyK-1OJFY';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
       * Callback after api.js is loaded.
       */
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

  /**
   * Callback after the API client is loaded. Loads the
   * discovery doc to initialize the API.
   */
async function intializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
}

/**
       * Callback after Google Identity Services are loaded.
       */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }
}

async function listUpcomingEvents() {
    let response;
    try {
      //var calendarId = "flyrosera@gmail.com";
      var calendarId = getEmail();
      var request = {
        "timeMin": "2022-06-10T00:00:00+09:30",
        "timeMax": "2022-06-11T00:00:00+09:30",
        "items": [
          {
            "id": calendarId,
          }
        ],
        "timeZone": "GMT",
      };
       response = await gapi.client.calendar.freebusy.query(request);
    } catch (err) {
      document.getElementById('free-busy').innerText = err.message;
      return;
    }

    let busy_times = response.result.calendars[calendarId].busy;
    if (busy_times.length == 0) {
        let freebusy_time = document.createElement("p");
        freebusy_time.innerText = "No events identified for the specified date and times.";
        document.getElementById("free-busy").appendChild(freebusy_time);
    }
    else {
        // 'busy' gives an array of objects with start and end times
        for (let i=0; i<busy_times.length; i++) {

            // get object of start and end times for each busy slot
            var times = busy_times[i];

            // start time - in a more readable format
            let dStart = new Date(times.start);
            //console.log("Hour of start time: " + dStart.getHours()); // gets the hours part of the date string

            // end time - in a more readable format
            let dEnd = new Date(times.end);
            //console.log("Busy time: " + dStart + " End time: " + dEnd);

            let freebusy_time = document.createElement("p");
            freebusy_time.innerText = dStart + " to " + dEnd;

            document.getElementById("free-busy").appendChild(freebusy_time);
        }
    }
}

function getEmail() {
    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
      } else if (this.readyState == 4 && this.status ==401){
        console.log("unauthorised - no gmail account");
      } else if (this.readyState == 4 && this.status >=400){
        console.log("failed to get email");
      }
    };

    //Open the request
    xhttp.open("GET", "/event/get_gmail");
    xhttp.send();
}
//var app = new Vue ({
    //     el: '#vue-app',
    //     data: {
    //         event_name: '',
    //         event_address: '',
    //         event_date: ''
    //     },
    //     methods: {
    //         getEventDetails: function() {
    //             let details = [];
    //             let xhttp = new XMLHttpRequest();
    //             xhttp.onreadystatechange = function () {
    //                 if(xhttp.readyState == 4 && xhttp.status == 200) {

    //                     details = JSON.parse(xhttp.responseText);
    //                     //console.log(this.responseText);
    //                     details = JSON.parse(xhttp.responseText);

    //                     /* Example of how response will be returned:
    //                         [{"eventName":"Example bday","street_no":"136","street":"North tce","suburb":"Adelaide","state":"SA","post_code":"5000",
    //                         "country":"Australia","date":"2022-06-10T00:00:00.000Z"}]
    //                     */
    //                     app.event_name = details[0].eventName;
    //                     app.event_address = details[0].street_no + details[0].street + details[0].suburb + details[0].state + details[0].post_code + details[0].country;
    //                     // format date to be more readable
    //                     let d = new Date(details[0].date);
    //                     app.event_date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    //                     console.log( app.event_date );

    //                 } else if (xhttp.readyState == 4 && xhttp.status >=400){
    //                     console.log("failed to get details");
    //                 }
    //             };

    //             //Open the request
    //             xhttp.open("GET", "/event/get_details");
    //             xhttp.send();
    //         }
    //     }
    // })
