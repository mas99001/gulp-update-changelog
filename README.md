# Update the Changelog with latest commit log from git

## Prepare the Environment -- Windows
1. Install node.js from [HERE](https://nodejs.org/en/download)
2. Install git from [HERE](https://git-scm.com/downloads)
3. Run the following command , to install the global grunt:
```npm install -g grunt-cli```
4. Run the following command , to install the gulp change log:
```npm install -g gulp-update-changelog```

## Usage
- add the following scripts to your `gulpfile.js`:
- Supply the options for sortlog
```javascript
var gulp = require('gulp');
var sortlog = require("gulp-update-changelog");
var fs= require('node-fs');

var pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
var today = new Date();

var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

gulp.task("default", function(){
    sortlog({
        src:"CHANGELOG.md",
        format:"git log --pretty=::%s --no-merges ",
        dateAfter:pkg.CLdate,
        tempLogFile:'release-notes/.G-log.md',
        dest:"release-notes/.G-CHANGELOG.md",
        fileHeader:"# [" + pkg.CLversion+ "] # " + dateTime
    });
});
```