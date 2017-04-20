
/*
  Usage : node runner.js team1 team2
        : Fetches score of match team1 vs team2, if its going on.
*/

var req = require('request');
var xml = require('xml2js');
var exec = require('child_process').exec;


var reqCnt = 0 ;
var reqInterval = 30; // In minutes
reqInterval = reqInterval * 60 * 1000 ;


var team1 = process.argv[2];
var team2 = process.argv[3];

team1 = team1 != undefined ? team1.toLowerCase() : '****';
team2 = team2 != undefined ? team2.toLowerCase() : '****';

console.log('Arguments : [ Team1:'+team1+' , Team2:'+team2+' ] ');

fetchScore();
startTask();


function startTask(){
  setInterval(function(){
      fetchScore();
    },(reqInterval ));
}

function fetchScore(){

  console.log(" * Fetching score : " + ++reqCnt);
	req('http://static.cricinfo.com/rss/livescores.xml',function (err,res,body){
      if (err){
        console.log('Check your internet connection',err);
        return;
      }
      parseXML(body);
    });
}


function parseXML(body){
      xml.parseString(body,function (err,res){
        if(err){
          console.log('Error in parsing........',err);
          return;
        }
          
          var matches = res.rss.channel[0].item;
          var score = '';
          for( var i=0 ; i<matches.length ; i++){
            var match = matches[i];
            var title = match.title[0];            
            var matchTitle = title.toLowerCase();

            if ( matchTitle.indexOf(team1) != -1 && matchTitle.indexOf(team2) != -1 ) {
              score = title;
              //console.log('-----   match details : ', match)
              break;
            }
          }

          if ( score.length == 0){
            score = 'There are no such matches.'
          }
          sendSystemNotification(score);
      });
}


function sendSystemNotification(score){
  var cmd = 'C:\\Windows\\System32\\L2ToastNotification.exe "Live scores" "'+score+'"  ""'; 

  /* Uncomment this for Linux machine
  var cmd = 'notify-send -i ~/Project/myProjects/Score-update/favicon.ico "Live scores" "'+score+' \n "';
  */

          exec(cmd,function (err,stdout,stderr){
            if ( err ){
              console.log('Error in executing command........',err);
            }            
          });
}