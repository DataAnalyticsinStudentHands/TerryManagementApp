## DatabaseCommunicationModule
A module to be used in a phonegap/angular application which will allow mysql requests to be transmitted to a remote webservice.

#### What's New
Use of Restangular instead of $resource for db ops. Details at: https://github.com/mgonto/restangular

### Running the Module
Open module in Brackets and use live-preview feature or alternatively ```` npm start ````

### Using Module in Project
- Copy js/services.js to project and create a script src link to it and properly inject dependency.
- Copy contents of databaseModule.run() in app.js to project's app.js and rename 'databaseModule' to proper module name. Configure redirection states and Restangular base URL as necessary.
- Add 'authenticate: true' to states that require user to be logged in.
- Refer to implementation example (js/controllers.js) to implement module in controller.
- Add ifLoggedIn checker on the login page to redirect users to app from login page once logged in. (js/controllers.js).
- Refer to partial and other elements of this repository for usage.
- Refer to Restangular documentation for information on db requests.

### Resources
https://github.com/mgonto/restangular
https://medium.com/@mattlanham/authentication-with-angularjs-4e927af3a15f
http://www.frederiknakstad.com/2014/02/09/ui-router-in-angular-client-side-auth/

### Pending/ChangeLog
- Promises ($q) - Done!
- Storage of Token - Local Storage - Done!
- Switch views based on logged in/out - Done!
- Proper communication with database - async - Done! - Via Restangular
- Authentication - Done
- Authentication - transmit token in header - Done!