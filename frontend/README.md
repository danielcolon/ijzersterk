# Installation
Required: `nodejs`, `npm`  
Install globally: `npm install -g gulp`  
Install all the necessary dependencies with `npm install`  

# Gulp
[Gulp](http://gulpjs.com/) is a build system. 
In the project it is being used to parse the [jsx](https://facebook.github.io/react/docs/jsx-in-depth.html) to JavaScript and to parse the ES6 to ES6 with babel.
It does many things more.

Anyway, use `gulp watch` to start the front-end, it will then auto-watch all the style and script files for changes and execute the build system accordingly.

# Deploy
To deploy the website: `gulp build`.
It will create a `dist` directory which is deployable.
