'use strict';

var exec = require('child_process').exec;
var _ = require('lodash');
var gulp = require('gulp');
var fs = require('node-fs');

var defaults = {
    src: "CHANGELOG.md",
    format: "git log --pretty=::%s --no-merges ",
    dateAfter: "2017-01-28",
    tempLogFile: '.G-log.md',
    dest: ".G-CHANGELOG.md",
    fileHeader: ""
};

module.exports = function (pOptions) {
    var options = _.merge({}, defaults, pOptions);
    fs.writeFileSync(options.tempLogFile, options.fileHeader+'\r\n', 'utf-8');
    exec(options.format + " --after=\"" + options.dateAfter + "\" >> " + options.tempLogFile
            , function(){     
            sortLogFile();
    });
    function sortLogFile() {
        var oldChangeLog = fs.readFileSync(options.src, 'utf8');
        var oldChangeLogArray = oldChangeLog.split('###');
        var oldChangeLogHeader = oldChangeLogArray[0];
        var oldChangeLogCommits = oldChangeLogArray[1];
        var gitLogText = fs.readFileSync(options.tempLogFile, 'utf8');
        var gitLogTextArray = gitLogText.split('::');
        var commitMessageArray = removeDuplicates(gitLogTextArray);
        var releaseInfo = commitMessageArray[0];
        commitMessageArray = commitMessageArray.splice(1);
        commitMessageArray = commitMessageArray.sort();
        var commitMessageObject;
        var commitType, commitMessage, commitScope;
        var splitArr = [];
        commitMessageArray.forEach(function (commit, index) {
            commitMessageObject = commit.split(':');
            if (commitMessageObject !== "") {
                var keyEnd = commitMessageObject[0].indexOf('(');
                var keyStart = commitMessageObject[0].indexOf(')');
                commitType = commitMessageObject[0].substring(0, keyEnd).replace(/ /g, '');
                commitType = commitType.charAt(0).toUpperCase() + commitType.slice(1);
                commitScope = commitMessageObject[0].substring(keyEnd + 1, keyStart);
                commitScope = commitScope.charAt(0).toUpperCase() + commitScope.slice(1);
                switch (commitType.toLowerCase()) {
                    case 'feat':
                        commitType = 'Added';
                        break;
                    case 'update':
                        commitType = 'Updated';
                        break;
                    case 'style':
                        commitType = 'Updated';
                        break;
                    case 'docs':
                        commitType = 'Updated';
                        break;
                    case 'refactor':
                        commitType = 'Updated';
                        break;
                    case 'perf':
                        commitType = 'Updated';
                        break;
                    case 'demo':
                        commitType = 'Updated';
                        break;
                    case 'revert':
                        commitType = 'Updated';
                        break;
                    case 'fix':
                        commitType = 'Fixed';
                        break;
                    case 'bugfix':
                        commitType = 'Fixed';
                        break;
                    case 'break':
                        commitType = 'Breaking changes';
                        break;
                    default:
                        return;
                }
                if (commitScope)
                    commitMessage = commitScope + ':' + removeSubString(commitMessageObject[1]);
                else
                    commitMessage = removeSubString(commitMessageObject[1]);
                if (commitMessage) {
                    if (splitArr[commitType]) {
                        splitArr[commitType] = splitArr[commitType].concat('- ' + commitMessage);
                    } else {
                        splitArr[commitType] = '- ' + commitMessage;
                    }
                }
            }
        });
/*
        for (var prop in splitArr) {
            var splitArrprop = splitArr[prop].split('\n');
            console.log(splitArrprop);
            splitArr[prop] = splitArrprop.sort();
            console.log(splitArr[prop]);
        }
*/
        var logString = "";
        for (var prop in splitArr) {
            logString = logString + '\r\n## ' + prop + '\r\n' + splitArr[prop];
        }
        if (logString === "") {
            logString = oldChangeLogHeader + '###\r\n' + oldChangeLogCommits;
        }
        else {
            logString = oldChangeLogHeader + '###\r\n' + releaseInfo + logString + oldChangeLogCommits;
        }
        fs.writeFile(options.dest, logString, 'utf-8');
        
        function removeDuplicates(num) {
            var x,
            len = num.length,
            out = [],
            obj = {};

            for (x = 0; x < len; x++) {
                obj[num[x]] = 0;
            }
            for (x in obj) {
                out.push(x);
            }
            return out;
        }
        function removeSubString(str) {
            var outr = str.split(']')[1];
            return outr;
        }
    }
};