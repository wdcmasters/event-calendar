// get event details from database based on event id stored in session
function getEventDetails() {
    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        var details = JSON.parse(this.responseText);

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

        checkGoogleUser();

      } else if (this.readyState == 4 && this.status >=400){
        console.log("failed to get host details");
      }
    };

    //Open the request
    xhttp.open("GET", "/event/get_host");
    xhttp.send();
}

/* hides google calendar button if user does not have gmail account
Note that a user has a gmail account if req.session.gmail = true */
function checkGoogleUser() {
  //AJAX
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
      console.log("req.session.gmail returns " + this.responseText);
      if (!(this.responseText == true)) {
        document.getElementById("authorize_button").style.visibility = 'hidden';
      }

      getProposedTimes();

    } else if (this.readyState == 4 && this.status >=400){
      console.log("failed to get host details");
    }
  };

  //Open the request
  xhttp.open("GET", "/users/check_google_user");
  xhttp.send();
}


var min_time;
var max_time;

var google_timeMin;
var google_timeMax;

function getProposedTimes() {
  //AJAX
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      //let event_times = JSON.parse(this.responseText);
      var event_times = JSON.parse(this.responseText);

      /* Example of how response will be returned:
          [{"start_time":"09:00:00","end_time":"17:00:00"}, {"start_time":"14:00:00","end_time":"17:00:00"}]
      */

      min_time = event_times[0].start_time;
      max_time = event_times[0].end_time;
      var date = event_times[0].date;
      var yr = new Date(date).getFullYear();
      var month = new Date(date).getMonth() + 1;
      var day = new Date(date).getDate();

     for (let i=0; i<event_times.length; i++) {
        if ( (new Date(event_times[i].start_time)).getTime() < (new Date(min_time)).getTime()){
          min_time = event_times[i].start_time;
        }
        else if ( (new Date(event_times[i].end_time)).getTime() > (new Date(max_time)).getTime()){
          max_time = event_times[i].end_time;
        }

       let time_range = event_times[i].start_time +  " to " + event_times[i].end_time;
       let time_p = document.createElement("p");
       time_p.innerText = time_range;
       document.getElementById("event-times").appendChild(time_p);
     }
     google_timeMin = yr + "-" + month + "-" + day + "T" + min_time + "+09:30";
     console.log("google timeMin:" + google_timeMin);

     google_timeMax = yr + "-" + month + "-" + day + "T" + max_time + "+09:30";
     console.log("google timeMax:" + google_timeMax);

    } else if (this.readyState == 4 && this.status >=400){
      console.log("failed to get times");
    }
  };

  //Open the request
  xhttp.open("GET", "/event/get_times");
  xhttp.send();
}

/* FOR FETCHING VAILABILITY FROM GOOGLE CALENDAR */

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

var user_email; // stores gmail for use as calendar ID

// get email
function checkAvailability() {
    //AJAX
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if(this.readyState == 4 && this.status == 200) {
        let found_email = JSON.parse(this.responseText);
        user_email = found_email[0].email;

        // handling google calendar api
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
        //}

        async function listUpcomingEvents() {
            let response;
            try {
              //var calendarId = "flyrosera@gmail.com";
              var calendarId = user_email; // retrieved via ajax and stored in global var
              var request = {
                "timeMin": google_timeMin,
                "timeMax": google_timeMax,
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
              // append description
              let desc = document.createElement("p");
              desc.innerText = "You are busy at the following times:";
              document.getElementById("free-busy").appendChild(desc);

                // 'busy' gives an array of objects with start and end times
                for (let i=0; i<busy_times.length; i++) {

                    // get object of start and end times for each busy slot
                    var times = busy_times[i];

                    // start time - in a more readable format
                    let dStart = new Date(times.start);
                    let dStart_hours = (dStart.getHours()<10?'0':'') + dStart.getHours();
                    let dStart_mins = (dStart.getMinutes()<10?'0':'') + dStart.getMinutes();

                    // end time - in a more readable format
                    let dEnd = new Date(times.end);
                    let dEnd_hours = (dEnd.getHours()<10?'0':'') + dEnd.getHours();
                    let dEnd_mins = (dEnd.getMinutes()<10?'0':'') + dEnd.getMinutes();

                    // append each busy time
                    let freebusy_time = document.createElement("p");
                    freebusy_time.innerText = dStart_hours + ":" + dStart_mins + " to " + dEnd_hours + ":" + dEnd_mins;
                    document.getElementById("free-busy").appendChild(freebusy_time);
                }
            }
            document.getElementById("authorize_button").style.visibility = 'hidden';
        }

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

/* Add event detail to database */
function submitAvailability(){
  let start_time;
  let end_time;

  //Getting event address from page
  start_time = document.getElementById("from-time").value;
  end_time = document.getElementById("to-time").value;

  if (document.getElementById("not-available").checked) {
    start_time = NULL;
    end_time = NULL;
  }

  //Putting into object
  let responded_times = {
    start: start_time,
    end: end_time
  };

  //AJAX
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
      console.log("Input responded times into database successfully");
      alert("Sent availability.");
      checkGuest();
    }
    else if (this.readyState == 4 && this.status >=400){
      console.log("couldn't place responded times in database");
    }
  };

  // //Open the request
  xhttp.open("POST", "/event/respond/add_times"); // post: sending info to server
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(responded_times));
}

function checkGuest() {
  //AJAX
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      if (this.responseText == "true") {
        window.location.href = '/index.html';
      }
      else {
        window.location.href = '/Dashboard.html';
      }
    }
    else if (this.readyState == 4 && this.status >=400){
      console.log("couldn't check user type");
    }
  };

  // //Open the request
  xhttp.open("GET", "/users/check_guest");
  xhttp.send();
}
