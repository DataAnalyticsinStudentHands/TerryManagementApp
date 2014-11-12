Terry Management App
==========

An app to use by administrators of Terry Scholarship applications at the Honors College, University of Houston, TX.

Prerequisites:  
bower `npm install -g bower`  
gulp `npm install -g gulp`  

Inside project:   
`npm install`   

Getting started:

1. Run `bower install`. Reads bower.json and installs local dependencies into the folder `www/lib`. Quick hack for ngNotify -> add z-index: 99 into ngNotify css

2. Run `gulp makeDist`. Reads the tasks defined in `gulpfile.js`. This specific task uses [main-bower-files](https://github.com/ck86/main-bower-files) which reads our `bower.json` to get the list of dependencies. It also reads our `.bowerrc` to see where our Bower dependencies are installed to (www/lib/). Reads each dependencies' own bower.json and their own dependencies' bower.json to get the list of main files. It filters this set of files down to just the JavaScript files and concatenates all of these into a `third-party.js` file. It stores it in the `www/js/` directory. It then restores the list of files to the original list (i.e. undoing the filtering). It filters the files down to just the CSS main files. Concatenates them into a `third-party.css` file which will be stored in the `www/cs` directory.

2. Run `ionic serve`. This uses `ionic.xml` and will serve as local node server. Live updates when you make changes to the code.

or 3. phonegap serve

Works with the Phone Gap developer app. Updates also when you make changes.