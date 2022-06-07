/* exported gapiLoaded */
      /* exported gisLoaded */
      /* exported handleAuthClick */
      /* exported handleSignoutClick */

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

      document.getElementById('authorize_button').style.visibility = 'hidden';
      document.getElementById('signout_button').style.visibility = 'hidden';

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
        maybeEnableButtons();
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
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
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

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      async function listUpcomingEvents() {
        let response;
        try {
          var calendarId = "flyrosera@gmail.com";
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
          document.getElementById('content').innerText = err.message;
          return;
        }

        let busy_times = response.result.calendars[calendarId].busy;
        //console.log(busy_times.length);

        // 'busy' gives an array of objects with start and end times
        for (let i=0; i<busy_times.length; i++) {

          // get object of start and end times for each busy slot
          var times = busy_times[i];

          // start time - in a more readable format
          let dStart = new Date(times.start);
          console.log("Hour of start time: " + dStart.getHours()); // gets the hours part of the date string

          // end time - in a more readable format
          let dEnd = new Date(times.end);
          console.log("Busy time: " + dStart + " End time: " + dEnd);
        }

      }

