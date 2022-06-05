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
        //   const request = {
        //     'calendarId': 'primary',
        //     'timeMin': (new Date()).toISOString(),
        //     'showDeleted': false,
        //     'singleEvents': true,
        //     'maxResults': 10,
        //     'orderBy': 'startTime',
        //   };
          const request = {
            "timeMin": "2022-06-05T00:00:00+09:30",
            "timeMax": "2022-06-06T00:00:00+09:30",
            "items": [
              {
                "id": "flyrosera@gmail.com"
              }
            ],
            "timeZone": "GMT",
          };
        //   response = await gapi.client.calendar.events.list(request);
        response = await gapi.client.calendar.freebusy.query(request);
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }
        const events = response.result.timeMin; // returns start time
        console.log(response);
        document.getElementById('content').innerText = events;

        // const events = response.result.items;
        // if (!events || events.length == 0) {
        //   document.getElementById('content').innerText = 'No events found.';
        //   return;
        // }
        // // Flatten to string to display
        // const output = events.reduce(
        //     (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
        //     'Events:\n');
        // document.getElementById('content').innerText = output;
      }


//       /* exported gapiLoaded */
//       /* exported gisLoaded */
//       /* exported handleAuthClick */
//       /* exported handleSignoutClick */

//       // TODO(developer): Set to client ID and API key from the Developer Console
//       const CLIENT_ID = '<YOUR_CLIENT_ID>';
//       const API_KEY = '<YOUR_API_KEY>';

//       // Discovery doc URL for APIs used by the quickstart
//       const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

//       // Authorization scopes required by the API; multiple scopes can be
//       // included, separated by spaces.
//       const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

//       let tokenClient;
//       let gapiInited = false;
//       let gisInited = false;

//       document.getElementById('authorize_button').style.visibility = 'hidden';
//       document.getElementById('signout_button').style.visibility = 'hidden';

//       /**
//        * Callback after api.js is loaded.
//        */
//       function gapiLoaded() {
//         gapi.load('client', intializeGapiClient);
//       }

//       /**
//        * Callback after the API client is loaded. Loads the
//        * discovery doc to initialize the API.
//        */
//       async function intializeGapiClient() {
//         await gapi.client.init({
//           apiKey: API_KEY,
//           discoveryDocs: [DISCOVERY_DOC],
//         });
//         gapiInited = true;
//         maybeEnableButtons();
//       }

//       /**
//        * Callback after Google Identity Services are loaded.
//        */
//       function gisLoaded() {
//         tokenClient = google.accounts.oauth2.initTokenClient({
//           client_id: CLIENT_ID,
//           scope: SCOPES,
//           callback: '', // defined later
//         });
//         gisInited = true;
//         maybeEnableButtons();
//       }

//       /**
//        * Enables user interaction after all libraries are loaded.
//        */
//       function maybeEnableButtons() {
//         if (gapiInited && gisInited) {
//           document.getElementById('authorize_button').style.visibility = 'visible';
//         }
//       }

//       /**
//        *  Sign in the user upon button click.
//        */
//       function handleAuthClick() {
//         tokenClient.callback = async (resp) => {
//           if (resp.error !== undefined) {
//             throw (resp);
//           }
//           document.getElementById('signout_button').style.visibility = 'visible';
//           document.getElementById('authorize_button').innerText = 'Refresh';
//           await listUpcomingEvents();
//         };

//         if (gapi.client.getToken() === null) {
//           // Prompt the user to select a Google Account and ask for consent to share their data
//           // when establishing a new session.
//           tokenClient.requestAccessToken({prompt: 'consent'});
//         } else {
//           // Skip display of account chooser and consent dialog for an existing session.
//           tokenClient.requestAccessToken({prompt: ''});
//         }
//       }

//       /**
//        *  Sign out the user upon button click.
//        */
//       function handleSignoutClick() {
//         const token = gapi.client.getToken();
//         if (token !== null) {
//           google.accounts.oauth2.revoke(token.access_token);
//           gapi.client.setToken('');
//           document.getElementById('content').innerText = '';
//           document.getElementById('authorize_button').innerText = 'Authorize';
//           document.getElementById('signout_button').style.visibility = 'hidden';
//         }
//       }

//       /**
//        * Print the summary and start datetime/date of the next ten events in
//        * the authorized user's calendar. If no events are found an
//        * appropriate message is printed.
//        */
//       async function listUpcomingEvents() {
//         let response;
//         try {
//           const request = {
//             'calendarId': 'primary',
//             'timeMin': (new Date()).toISOString(),
//             'showDeleted': false,
//             'singleEvents': true,
//             'maxResults': 10,
//             'orderBy': 'startTime',
//           };
//           response = await gapi.client.calendar.events.list(request);
//         } catch (err) {
//           document.getElementById('content').innerText = err.message;
//           return;
//         }

//         const events = response.result.items;
//         if (!events || events.length == 0) {
//           document.getElementById('content').innerText = 'No events found.';
//           return;
//         }
//         // Flatten to string to display
//         const output = events.reduce(
//             (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
//             'Events:\n');
//         document.getElementById('content').innerText = output;
//       }



// // /* exported gapiLoaded */
// //       /* exported gisLoaded */
// //       /* exported handleAuthClick */
// //       /* exported handleSignoutClick */

// //       // TODO(developer): Set to client ID and API key from the Developer Console
// //       const CLIENT_ID = '395070286663-89a13j9p6bnq3ipd91072dfpjk2d61fj.apps.googleusercontent.com';
// //       const API_KEY = 'AIzaSyCa2qUGkFR0VtgoRjKiw6g-EhvyK-1OJFY';

// //       // Discovery doc URL for APIs used by the quickstart
// //       const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// //       // Authorization scopes required by the API; multiple scopes can be
// //       // included, separated by spaces.
// //       const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// //       let tokenClient;
// //       let gapiInited = false;
// //       let gisInited = false;

// //       document.getElementById('authorize_button').style.visibility = 'hidden';
// //       document.getElementById('signout_button').style.visibility = 'hidden';

// //       /**
// //        * Callback after api.js is loaded.
// //        */
// //       function gapiLoaded() {
// //         gapi.load('client', intializeGapiClient);
// //       }

// //       /**
// //        * Callback after the API client is loaded. Loads the
// //        * discovery doc to initialize the API.
// //        */
// //       async function intializeGapiClient() {
// //         await gapi.client.init({
// //           apiKey: API_KEY,
// //           discoveryDocs: [DISCOVERY_DOC],
// //         });
// //         gapiInited = true;
// //         maybeEnableButtons();
// //       }

// //       /**
// //        * Callback after Google Identity Services are loaded.
// //        */
// //       function gisLoaded() {
// //         tokenClient = google.accounts.oauth2.initTokenClient({
// //           client_id: CLIENT_ID,
// //           scope: SCOPES,
// //           callback: '', // defined later
// //         });
// //         gisInited = true;
// //         maybeEnableButtons();
// //       }

// //       /**
// //        * Enables user interaction after all libraries are loaded.
// //        */
// //       function maybeEnableButtons() {
// //         if (gapiInited && gisInited) {
// //           document.getElementById('authorize_button').style.visibility = 'visible';
// //         }
// //       }

// //       /**
// //        *  Sign in the user upon button click.
// //        */
// //       function handleAuthClick() {
// //         tokenClient.callback = async (resp) => {
// //           if (resp.error !== undefined) {
// //             throw (resp);
// //           }
// //           document.getElementById('signout_button').style.visibility = 'visible';
// //           document.getElementById('authorize_button').innerText = 'Refresh';
// //           await listUpcomingEvents();
// //         };

// //         if (gapi.client.getToken() === null) {
// //           // Prompt the user to select a Google Account and ask for consent to share their data
// //           // when establishing a new session.
// //           tokenClient.requestAccessToken({prompt: 'consent'});
// //         } else {
// //           // Skip display of account chooser and consent dialog for an existing session.
// //           tokenClient.requestAccessToken({prompt: ''});
// //         }
// //       }

// //       /**
// //        *  Sign out the user upon button click.
// //        */
// //       function handleSignoutClick() {
// //         const token = gapi.client.getToken();
// //         if (token !== null) {
// //           google.accounts.oauth2.revoke(token.access_token);
// //           gapi.client.setToken('');
// //           document.getElementById('content').innerText = '';
// //           document.getElementById('authorize_button').innerText = 'Authorize';
// //           document.getElementById('signout_button').style.visibility = 'hidden';
// //         }
// //       }

// //       /**
// //        * Print the summary and start datetime/date of the next ten events in
// //        * the authorized user's calendar. If no events are found an
// //        * appropriate message is printed.
// //        */
// //       async function listUpcomingEvents() {
// //         let response;
// //         try {
// //           const request = {
// //             'calendarId': 'primary',
// //             'timeMin': (new Date()).toISOString(),
// //             'showDeleted': false,
// //             'singleEvents': true,
// //             'maxResults': 10,
// //             'orderBy': 'startTime',
// //           };

// //           // freebusy request body
// //         //   const request = {
// //         //     "timeMin": "2022-06-05T00:00:00+09:30",
// //         //     "timeMax": "2022-06-06T00:00:00+09:30",
// //         //     "items": [
// //         //       {
// //         //         "id": "flyrosera@gmail.com"
// //         //       }
// //         //     ],
// //         //     "timeZone": "GMT",
// //         //     "calendarExpansionMax": 1
// //         //   }
// //           //response = await gapi.client.calendar.freebusy.query(request);
// //           response = await gapi.client.calendar.events.list(request);
// //         } catch (err) {
// //           document.getElementById('content').innerText = err.message;
// //           return;
// //         }

// //         const events = response.result.items;
// //         if (!events || events.length == 0) {
// //           document.getElementById('content').innerText = 'No events found.';
// //           return;
// //         }
// //         // Flatten to string to display
// //         const output = events.reduce(
// //             (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
// //             'Events:\n');
// //         document.getElementById('content').innerText = output;
// //       }

// // // const { google } = require('googleapis');
// // // const cal = google.calendar({
// // //     version: 'v3',
// // //     auth: 'AIzaSyCa2qUGkFR0VtgoRjKiw6g-EhvyK-1OJFY'
// // // });

// // // // Set the calendar to query
// // // const calendar = 'flyrosera@gmail.com';

// // // // Set beginning of query to 3 pm tomorrow
// // // const d = new Date();
// // // let tomorrow3pm = d.getDate();
// // // tomorrow3pm.setDate(d.getDate() + 1);
// // // tomorrow3pm.setDate(d.getDate() + 1);
// // // tomorrow3pm.setHours(15, 0, 0);

// // // // Set end of query to 4 pm tomorrow
// // // // const tomorrow4pm = new Date();
// // // let tomorrow4pm = d.getDate();
// // // tomorrow4pm.setDate(d.getDate() + 1);
// // // tomorrow4pm.setHours(16, 0, 0);

// // // // Make the query
// // // cal.freebusy.query({
// // //     resource: {
// // //         // Set times to ISO strings as such
// // //         timeMin: new Date(tomorrow3pm).toISOString(),
// // //         timeMax: new Date(tomorrow4pm).toISOString(),
// // //         timeZone: 'GMT',
// // //         items: [{ id: calendar }]
// // //     }
// // // }).then((result) => {
// // //     const busy = result.data.calendars[calendar].busy;
// // //     const errors = result.data.calendars[calendar].errors;
// // //     if (undefined !== errors) {
// // //         console.error('Check this this calendar has public free busy visibility');
// // //     } else if (busy.length !== 0) {
// // //         console.log('Busy');
// // //     } else {
// // //         console.log('Free');
// // //     }
// // // }).catch((e) => {
// // //     console.error(e);
// // // });