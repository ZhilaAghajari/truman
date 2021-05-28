#! /usr/bin/env node

console.log('This data export is running!!!!');


const async = require('async')
const Actor = require('./models/Actor.js');
const Script = require('./models/Script.js');
const User = require('./models/User.js');
const _ = require('lodash');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs')
var UAParser = require('ua-parser-js');
const util = require('util');



var csvWriter = require('csv-write-stream');
var mlm_writer = csvWriter();
var ss_writer = csvWriter()
//var s_writer = csvWriter();
var summary_writer = csvWriter();
//5bb3a93ad9fd14471bf3977d
//5bb3a93ad9fd14471bf39791
//5bb3a93ad9fd14471bf39792
//5bb3a93ad9fd14471bf397c8
var bully_messages =["60b0ed6c42961f56f9dac468","60b0ed6d42961f56f9dac4d5","60b0ed6c42961f56f9dac4ae","60b0ed6e42961f56f9dac566"];

// var bully_messages = ["5bb3a93ad9fd14471bf3977d",
// "5bb3a93ad9fd14471bf39791",
// "5bb3a93ad9fd14471bf39792",
// "5bb3a93ad9fd14471bf397c8"];
var bully_stats = [];

Array.prototype.sum = function() {
    return this.reduce(function(a,b){return a+b;});
};



var victim = "5b4e207817c6a93896fa924d";
var bully = "5b4e207817c6a93896fa923d";
var bully_name = "bblueberryy";

var mlm_array = [];

// dotenv.load({ path: '.env' });
dotenv.config({ path: '.env' });

/*
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');


//var connection = mongo.connect('mongodb://127.0.0.1/test');
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
var db = mongoose.connection;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
}); */

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;

//mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
//mongoose.connect(process.env.MONGOLAB_TEST || process.env.PRO_MONGOLAB_URI, { useMongoClient: true });
mongoose.connect(process.env.MONGOLAB_TEST || process.env.PRO_MONGOLAB_URI || process.env.mongolab_uri_test, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});



// ZHila: remmeber to uncomment this line

User.find()
  // .where('active').equals(false) 
  .populate({ 
         path: 'feedAction.post',
         model: 'Script',
         populate: {
           path: 'actor',
           model: 'Actor'
         } 
      })
  .exec(    
    function(err, users){
      console.log('Number of users: ', users.length );

      mlm_writer.pipe(fs.createWriteStream('results/mlm_eatsnaplove.csv'));
      ss_writer.pipe(fs.createWriteStream('results/ss_eatsnaplove.csv'));
      //s_writer.pipe(fs.createWriteStream('results/sur_eatsnaplove.csv'));
      summary_writer.pipe(fs.createWriteStream('results/sum_eatsnaplove.csv'));

      for (var i = users.length - 1; i >= 0; i--) 
      {
        var mlm = {};
        var sur = {};
        var sums = {};
        var ss ={};
        mlm.id = users[i].mturkID;
        ss.id = users[i].mturkID;
        //sur.id = users[i].mturkID;
        sums.id = users[i].mturkID;


        mlm.email = users[i].email;
        ss.email = users[i].email;
        //sur.email = users[i].email;
        ss.experimental_condition = users[i].group;
        sums.email = users[i].email;

        mlm.StartDate = users[i].createdAt;
        ss.stats=users[i].createdAt;
        //sur.StartDate = users[i].createdAt;
        sums.StartDate = users[i].createdAt;

        console.log("In User "+ users[i].email);
        //console.log("In User Number "+ i);

        // collect the user's session survey:
        console.log('number of surveys for this user: ', users[i].session_survey.length);
        for (var n = 0; n < users[i].session_survey.length; n++) 
        {  

          let indx=n;
          // ss["session_survey_emotion_sharing_sadness"] = users[i].session_survey[indx].emotion_sharing_sadness;
          // ss["session_survey_emotion_sharing_pain"] = users[i].session_survey[indx].emotion_sharing_pain;
          // ss["session_survey_mentalizing"] = users[i].session_survey[indx].mentalizing;
          // ss["session_survey_mentalizing_effort"] = users[i].session_survey[indx].mentalizing_effort;
          ss["ss_compassionate"] = users[i].session_survey[indx].compassionate;
          ss["ss_sympathy"] = users[i].session_survey[indx].sympathy;
          ss["ss_warm"] = users[i].session_survey[indx].warm;
          ss["ss_touched"] = users[i].session_survey[indx].touched;

          ss["ss_closeness"] = users[i].session_survey[indx].closeness;
          ss["ss_effort"] = users[i].session_survey[indx].effort;
          ss["ss_efficacy"] = users[i].session_survey[indx].efficacy;
          
          // ss["session_survey_lonely"] = users[i].session_survey[indx].lonely;
          // ss["session_survey_feel"] = users[i].session_survey[indx].feel;
          // ss["session_survey_feel_inferior"] = users[i].session_survey[indx].feel_inferior;
          ss["session_survey_likes"] = users[i].session_survey[indx].likes;
          ss["session_survey_flags"] = users[i].session_survey[indx].flags;
          // ss["session_survey_numPosts"] = users[i].session_survey[indx].posts;
          // ss["session_survey_time"] = users[i].session_survey[indx].time;
          ss["unique_bully_count"]=users[i].session_survey[indx].unique_bully_count;
          ss["Bully_count"] = users[i].session_survey[indx].seen_bully_count;
          // // Zhila: next, work on this!!!
          ss["session_survey_seen_bullyPosts"] = users[i].session_survey[indx].seen_bully_post;
          // ss["session_survey_timeSpentOnBullyPost"] =  users[i].session_survey[indx].bully_post_viewedTime;
          
          ss_writer.write(ss);
      }


        if (users[i].profile.name)
        {
          mlm.ProfileName = 1;
          sums.ProfileName = 1;
        }
        else
        {
          mlm.ProfileName = 0;
          sums.ProfileName = 0;
        }

        if (users[i].profile.location)
        {
          mlm.ProfileLocation = 1;
          sums.ProfileLocation = 1;
        }
        else
        {
          mlm.ProfileLocation = 0;
          sums.ProfileLocation = 0;
        }

        if (users[i].profile.bio)
        {
          mlm.ProfileBio = 1;
          sums.ProfileBio = 1;
        }
        else
        {
          mlm.ProfileBio = 0;
          sums.ProfileBio = 0;
        }

        if (users[i].profile.picture)
        {
          mlm.ProfilePicture = 1;
          sums.ProfilePicture = 1;
        }
        else
        {
          mlm.ProfilePicture = 0;
          sums.ProfilePicture = 0;
        }

        var parser = new UAParser();

        if(users[i].log[0])
        {

          if (parser.setUA(users[i].log[0].userAgent).getDevice().type)
          {
            mlm.Device = parser.setUA(users[i].log[0].userAgent).getDevice().type;
          }
          else
            mlm.Device = "Computer";
        

        
          //sur.Device = mlm.Device;

          mlm.Broswer = parser.setUA(users[i].log[0].userAgent).getBrowser().name;
          //sur.Broswer = mlm.Broswer;

          mlm.OS = parser.setUA(users[i].log[0].userAgent).getOS().name;
          //sur.OS = mlm.OS;
        }//if Log exists
        else{
          mlm.Device = "NA";
          mlm.Broswer = "NA";
          mlm.OS = "NA";
        }
        

        mlm.notificationpage = 0;
        mlm.numberbullypage = 0;
        mlm.numbervictimpage = 0;
        mlm.generalpagevisit = 0;
        // what is this pagelog variable?
        for(var z = 0; z < users[i].pageLog.length; ++z){
            if(users[i].pageLog[z].page == "Notifications")
              mlm.notificationpage++;
            else if (users[i].pageLog[z].page == bully_name)
              mlm.numberbullypage++;
            else if (users[i].pageLog[z].page == "casssssssssie")
              mlm.numbervictimpage++;
            else
              mlm.generalpagevisit++;
        }
        

        mlm.citevisits = users[i].log.length;
        sums.citevisits = users[i].log.length;

        if (users[i].completed)
        {
          mlm.CompletedStudy = 1;
          sums.CompletedStudy = 1;
          //sur.CompletedStudy = 1;
        }
        else
        {
          mlm.CompletedStudy = 0;
          sums.CompletedStudy = 0;
          //sur.CompletedStudy = 0;
        }

        if (users[i].study_days.length > 0)
        {
          mlm.DayOneVists = users[i].study_days[0];
          mlm.DayTwoVists = users[i].study_days[1];
          mlm.DayThreeVists = users[i].study_days[2];

          sums.DayOneVists = users[i].study_days[0];
          sums.DayTwoVists = users[i].study_days[1];
          sums.DayThreeVists = users[i].study_days[2];
        }

        //per feedAction
        mlm.VictimNoBullyReplies = 0;
        mlm.VictimNoBullyLikes = 0;
        mlm.GEN_BullyNoBullyReplies = 0;
        mlm.GEN_BullyNoBullyLikes = 0;
        mlm.GeneralLikeNumber = 0;
        mlm.GeneralFlagNumber = 0;
        mlm.AveReadTime = 0;
        mlm.TotalNumberRead = 0;
        mlm.TotalNonBullyPostRead = 0;
        mlm.BULLY_PostStartReadTimes = 0;
        var bullyLikes = 0;
        var bullyReplies = 0;
        //var bullyReads = 0;
        var bullyReadTimes = 0;
        var bullyVictumFlag = 0;
        var bullyVictumLikes = 0;
        var bullyVictumReplies = 0;
        var bullyVictumReads = 0;
        var bullyVictumReadTimes = 0;
        //var bullyVictumFlag = 0;
        var bullyFlag = 0;

        
        //per feedAction
        for (var k = users[i].feedAction.length - 1; k >= 0; k--) 
        {
          //is a bully Victim message
          //if(users[i].feedAction[k].post.id == bully_messages[0] || users[i].feedAction[k].post.id == bully_messages[1] || users[i].feedAction[k].post.id == bully_messages[2]||users[i].feedAction[k].post.id == bully_messages[3])
          //console.log("Look up action ID: "+users[i].feedAction[k].id);
          //console.log("Look up action POST : "+users[i].feedAction[k].post);
          
          //console.log(util.inspect(users[i].feedAction[k], false, null))
          if(users[i].feedAction[k].post == null)
          {
            //console.log("@$@$@$@$@ action ID NOT FOUND: "+users[i].feedAction[k].id);
          }

          if(users[i].feedAction[k].post != null && (users[i].feedAction[k].post.id == bully_messages[0] || users[i].feedAction[k].post.id == bully_messages[1] || users[i].feedAction[k].post.id == bully_messages[2]||users[i].feedAction[k].post.id == bully_messages[3]))   
          {
            //console.log("FOUND BULLY ACTION")
            if(users[i].feedAction[k].replyTime[0])
            {
              bullyVictumReplies++;
            }

            if(users[i].feedAction[k].startTime)
            {
              mlm.BULLY_PostStartReadTimes++;
            }

            if(users[i].feedAction[k].liked)
            {
              bullyVictumLikes++;
            }

            if(users[i].feedAction[k].flagTime[0])
            {
              bullyVictumFlag++;
            }

            if(users[i].feedAction[k].readTime[0])
            {
              bullyVictumReads++;
              bullyVictumReadTimes += users[i].feedAction[k].readTime.sum() / users[i].feedAction[k].readTime.length; 
            }

            //check bully comments
            for (var cc =users[i].feedAction[k].comments.length;cc >= 0; cc--)
            { 
              //IF THIS IS THE BULLY COMMENT
              //if (users[i].feedAction[k].comments[cc] && users[i].feedAction[k].comments[cc].hasOwnProperty("comment"))
              if (users[i].feedAction[k].comments[cc] && !users[i].feedAction[k].comments[cc].new_comment)
              { 
                //console.log("BULLY _ COUNT AVG LIKES/FLAG")
                //liked bully comment
                if(users[i].feedAction[k].comments[cc].liked)
                {
                  bullyLikes++;
                }
                //flagged bully comment
                if(users[i].feedAction[k].comments[cc].flagTime[0])
                {
                  bullyFlag++;
                }
              }//end of BULLY COMMENT
              
              //else this is a comment that user made
              else if (users[i].feedAction[k].comments[cc] && users[i].feedAction[k].comments[cc].new_comment)
                bullyReplies++;
            }//end of COMMENT FOR LOOP


          }//IF BULLY_VICTIM POST

          //not a bully message
          else 
          {
            //Victim stats
            if (users[i].feedAction[k].post != null && users[i].feedAction[k].post.actor.id == victim)
            {
              if(users[i].feedAction[k].replyTime[0])
              {
                mlm.VictimNoBullyReplies++;
              }

              if(users[i].feedAction[k].liked)
              {
                mlm.VictimNoBullyLikes++;
              }
            }

            //bully stats
            if (users[i].feedAction[k].post != null && users[i].feedAction[k].post.actor.id == bully)
            {
              if(users[i].feedAction[k].replyTime[0])
              {
                mlm.GEN_BullyNoBullyReplies++;
              }

              if(users[i].feedAction[k].liked)
              {
                mlm.GEN_BullyNoBullyLikes++;
              }
            }

            //total number of likes
            if(users[i].feedAction[k].liked)
            {
              mlm.GeneralLikeNumber++;
            }

            //total number of flags
            if(users[i].feedAction[k].flagTime[0])
            {
              mlm.GeneralFlagNumber++;
            }

            //total read times, and average of all reads
            if(users[i].feedAction[k].readTime[0])
            {
              mlm.TotalNonBullyPostRead++;
              //console.log("before avg read is "+mlm.AveReadTime);
              mlm.AveReadTime += users[i].feedAction[k].readTime.sum() / users[i].feedAction[k].readTime.length;
              //console.log("after avg read is "+mlm.AveReadTime);
            }
          }


        }//for Per FeedAction

        //get totalAverage
        mlm.AveReadTime = mlm.AveReadTime/mlm.TotalNonBullyPostRead;
        mlm.TotalNumberRead = mlm.TotalNonBullyPostRead + bullyVictumReads;
        //mlm.GeneralReplyNumber = users[i].numReplies + 1 - bullyReplies;
        mlm.GeneralReplyNumber = users[i].numReplies + 1;
        mlm.GeneralPostNumber = users[i].numPosts + 1;

        mlm.BULLY_TotalCyberBullyLikes = bullyLikes;
        mlm.BULLY_TotalCyberBullyReplies = bullyReplies;
        mlm.BULLY_TotalCyerBullyFlag =  bullyFlag;
        //mlm.BULLY_TotalCyerBullyReads =  bullyReads;
        //mlm.BULLY_TotalCyberBullyReadTimes = bullyReadTimes;
        mlm.BULLY_TotalCyberBullyVictumPostFlag = bullyVictumFlag;
        mlm.BULLY_TotalCyberBullyVicPostLikes =  bullyVictumLikes;
        mlm.BULLY_TotalCyberBullyVicPostReplies =  bullyVictumReplies;
        mlm.BULLY_TotalCyberBullyVicPostReads = bullyVictumReads;
        mlm.BULLY_AVG_CyberBullyVicPostReadsTimes =  bullyVictumReadTimes;
        //mlm.BULLY_TotalCyberBullyVicPostFlag = bullyVictumFlag = 0;
        

        if (users[i].blocked.includes(bully_name))
        {
          var block_index = _.findIndex(users[i].blockAndReportLog, function(o) { return (o.actorName == bully_name && o.action =="block"); });
          mlm.BULLY_blocked = 1;
          mlm.BULLY_BlockMilliSeconds = users[i].blockAndReportLog[block_index].time - users[i].createdAt;
        }
        else
        {
          mlm.BULLY_blocked = 0;
          mlm.BULLY_BlockMilliSeconds = 259200000;
        }

        if (users[i].reported.includes(bully_name))
        {
          var report_index = _.findIndex(users[i].blockAndReportLog, function(o) { return (o.actorName == bully_name && o.action =="report"); });
          mlm.BULLY_reported = 1;
          mlm.BULLY_ReportMilliSeconds = users[i].blockAndReportLog[report_index].time - users[i].createdAt;
          mlm.BULLY_reportIssue = users[i].blockAndReportLog[report_index].report_issue;
        }
        else
        {
          mlm.BULLY_reported = 0;
          mlm.BULLY_ReportMilliSeconds = 259200000;
          mlm.BULLY_reportIssue = "";
        }

        /*
        //per profile_feed
        mlm.ProfileIntroPictureClicks = 0;
        mlm.ProfileIntroReads = 0;
        mlm.ProfileIntro_AveReadTime = 0;
        mlm.ProfileIntro_ReadTime = 0;
        for (var ll = users[i].profile_feed.length - 1; ll >= 0; ll--) 
        { 
          //console.log("@@@@PROFILE INTRO has "+users[i].profile_feed[ll].rereadTimes);
          if (users[i].profile_feed[ll].picture_clicks.length > 0)
          {
            mlm.ProfileIntroPictureClicks = mlm.ProfileIntroPictureClicks + users[i].profile_feed[ll].picture_clicks.length;
          }

          //rereadTimes
          mlm.ProfileIntroReads = mlm.ProfileIntroReads + users[i].profile_feed[ll].rereadTimes + 1;
          if (users[i].profile_feed[ll].readTime.length > 0)
            mlm.ProfileIntro_ReadTime += users[i].profile_feed[ll].readTime.sum() / users[i].profile_feed[ll].readTime.length;
          else
            mlm.ProfileIntro_ReadTime = 0 + mlm.ProfileIntro_ReadTime;
        }

        mlm.AVGProfileIntroPictureClicks = mlm.ProfileIntroPictureClicks/users[i].profile_feed.length
        mlm.AVGProfileIntroReads = mlm.ProfileIntroReads/users[i].profile_feed.length
        mlm.AVGProfileIntro_AveReadTime = mlm.ProfileIntro_AveReadTime/users[i].profile_feed.length
        */




        // cat.feel_inferior = req.body.session_survey[11];
        // // add more information about session level, things like number of likes, comments, flag, etc.
        // cat.likes = req.body.session_likes;
        // cat.flags = req.body.session_flags;
        // cat.posts = req.body.session_posts;
        // cat.time =req.body.time;


        // Add rhw session survey to the user's record:
        // for (var n = 0; n < users[i].session_survey.length; n++) 
        // {  

        //   // console.log('what is in users: ', users[i].session_survey[0].emotion_sharing_sadness)
        //   let indx=n;
        //   // console.log('emotion: ', users[i].session_survey[0].emotion_sharing_sadness)   
          
        //   mlm["session_survey_"+indx+"/emotion_sharing_sadness"] = users[i].session_survey[indx].emotion_sharing_sadness;
        //   mlm["session_survey_"+indx+"/emotion_sharing_pain"] = users[i].session_survey[indx].emotion_sharing_pain;
        //   mlm["session_survey_"+indx+"/mentalizing"] = users[i].session_survey[indx].mentalizing;
        //   mlm["session_survey_"+indx+"/mentalizing_effort"] = users[i].session_survey[indx].mentalizing_effort;
        //   mlm["session_survey_"+indx+"/compassionate"] = users[i].session_survey[indx].compassionate;
        //   mlm["session_survey_"+indx+"/sympathy"] = users[i].session_survey[indx].sympathy;
        //   mlm["session_survey_"+indx+"/effort"] = users[i].session_survey[indx].effort;
        //   mlm["session_survey_"+indx+"/efficacy"] = users[i].session_survey[indx].efficacy;
        //   mlm["session_survey_"+indx+"/closeness"] = users[i].session_survey[indx].closeness;
        //   mlm["session_survey"+indx+"/lonely"] = users[i].session_survey[indx].lonely;
        //   mlm["session_survey_"+indx+"/feel"] = users[i].session_survey[indx].feel;
        //   mlm["session_survey_"+indx+"/feel_inferior"] = users[i].session_survey[indx].feel_inferior;
        //   mlm["session_survey_"+indx+"/likes"] = users[i].session_survey[indx].session_likes;
        //   mlm["session_survey_"+indx+"/flags"] = users[i].session_survey[indx].session_flags;
        //   mlm["session_survey_"+indx+"/numPosts"] = users[i].session_survey[indx].session_posts;
        //   mlm["session_survey_"+indx+"/time"] = users[i].session_survey[indx].session_time;
        // }

        //per bully post 1-4
        for (var n = 0; n < bully_messages.length; n++) 
        {  
          //console.log(" Bully message  "+ n);

          //var temp_mlm = {};
          //temp_mlm = JSON.parse(JSON.stringify(mlm));
          let bin=n+1;
          var feedIndex = _.findIndex(users[i].feedAction, function(o) { if (o.post != null) {return o.post.id == bully_messages[n];} });

          if(feedIndex!=-1)
          {
            //temp_mlm.BullyingPost  = n + 1;
            mlm["BullyingPost"+bin] = bin;
            //console.log(":::::"+temp_mlm.BullyingPost+" IF FI mlm Bully message");
            
            //startTime
            //last read time
            if(users[i].feedAction[feedIndex].startTime)
            {
              //temp_mlm.BullyPostStartREADTime = 1;
              mlm["BullyPostStartREADTime"+bin] = 1;
            }
            else 
            {
              console.log("^%^%^%^%^%^%NO START TIME found for Bully posts in FeedAction: "+users[i].feedAction[feedIndex].id);
              //temp_mlm.BullyPostStartREADTime = -1;
              mlm["BullyPostStartREADTime"+bin] = -1;
            }

            //last read time
            if(users[i].feedAction[feedIndex].readTime[0])
            {
              //temp_mlm.BullyPostLastReadTime = users[i].feedAction[feedIndex].readTime[users[i].feedAction[feedIndex].readTime.length - 1];
              mlm["BullyPostLastReadTime"+bin] = users[i].feedAction[feedIndex].readTime[users[i].feedAction[feedIndex].readTime.length - 1];
              //temp_mlm.BullyPostAverageReadTime = users[i].feedAction[feedIndex].readTime.sum() / users[i].feedAction[feedIndex].readTime.length;
              mlm["BullyPostAverageReadTime"+bin] = users[i].feedAction[feedIndex].readTime.sum() / users[i].feedAction[feedIndex].readTime.length;
              //temp_mlm.BullyPostNumOfReadTimes = users[i].feedAction[feedIndex].readTime.length;
              mlm["BullyPostNumOfReadTimes"+bin] = users[i].feedAction[feedIndex].readTime.length;
            }
            else 
            {
              console.log("^%^%^%^%^%^%NO READ TIME found for Bully posts in FeedAction: "+users[i].feedAction[feedIndex].id);
              //temp_mlm.BullyPostLastReadTime = -1;
              mlm["BullyPostLastReadTime"+bin] = -1;
              //temp_mlm.BullyPostAverageReadTime = -1;
              mlm["BullyPostAverageReadTime"+bin] = -1
              //temp_mlm.BullyPostNumOfReadTimes = -1;
              mlm["BullyPostNumOfReadTimes"+bin] = -1
            }

            if(users[i].feedAction[feedIndex].flagTime[0])
            {
              //temp_mlm.BULLY_VictimPostFlag = 1;
              mlm["BULLY_VictimPostFlag"+bin] = 1;
              //temp_mlm.BULLY_VictimPostFlagTime = users[i].feedAction[feedIndex].flagTime[0];
              mlm["BULLY_VictimPostFlagTime"+bin] = users[i].feedAction[feedIndex].flagTime[0];
            }
            else 
            {
              //temp_mlm.BULLY_VictimPostFlag = 0;
              mlm["BULLY_VictimPostFlag"+bin] = 0;
              //temp_mlm.BULLY_VictimPostFlagTime = 0;
              mlm["BULLY_VictimPostFlagTime"+bin] = 0;
            }

            if(users[i].feedAction[feedIndex].likeTime[0])
            {
              //temp_mlm.BULLY_VictimPostLike = 1;
              mlm["BULLY_VictimPostLike"+bin] = 1;
              //temp_mlm.BULLY_VictimPostLikeTime = users[i].feedAction[feedIndex].likeTime[0];
              mlm["BULLY_VictimPostLikeTime"+bin] = users[i].feedAction[feedIndex].likeTime[0];
            }
            else 
            {
              //temp_mlm.BULLY_VictimPostLike = 0;
              mlm["BULLY_VictimPostLike"+bin] = 0;
              //temp_mlm.BULLY_VictimPostLikeTime = 0;
              mlm["BULLY_VictimPostLikeTime"+bin] = 0;
            }

            
            //temp_mlm.BULLY_Flag = 0;
            mlm["BULLY_Flag"+bin] = 0;
            //temp_mlm.BULLY_FlagTime = 0;
            mlm["BULLY_FlagTime"+bin] = 0;
            //temp_mlm.BULLY_Like = 0;
            mlm["BULLY_Like"+bin] = 0;
            //temp_mlm.BULLY_LikeTime = 0;
            mlm["BULLY_LikeTime"+bin] = 0;
            //temp_mlm.BULLY_Reply = 0;
            mlm["BULLY_Reply"+bin] = 0;
            //temp_mlm.BULLY_ReplyTime = 0;
            mlm["BULLY_ReplyTime"+bin] = 0;
            //temp_mlm.BULLY_commentMessage = "";
            mlm["BULLY_commentMessage"+bin] = "";
            //cats and changes
            //check bully comments
            for (var cc =users[i].feedAction[feedIndex].comments.length;cc >= 0; cc--)
            { 
              //IF THIS IS THE BULLY COMMENT
              if (users[i].feedAction[feedIndex].comments[cc] && !users[i].feedAction[feedIndex].comments[cc].new_comment)
              { 
                //console.log("WE have a BULLY comment action MLM");
                //liked bully comment
                if(users[i].feedAction[feedIndex].comments[cc].liked)
                {
                  //console.log("LIKE");
                  //temp_mlm.BULLY_Like = 1;
                  mlm["BULLY_Like"+bin] = 1;
                  //temp_mlm.BULLY_LikeTime = users[i].feedAction[feedIndex].comments[cc].likeTime[0];
                  mlm["BULLY_LikeTime"+bin] = users[i].feedAction[feedIndex].comments[cc].likeTime[0];
                }
                else
                {
                  //temp_mlm.BULLY_Like = 0;
                  mlm["BULLY_Like"+bin] = 0;
                  //temp_mlm.BULLY_LikeTime = 0; 
                  mlm["BULLY_LikeTime"+bin] = 0;
                }
                //flagged bully comment
                if(users[i].feedAction[feedIndex].comments[cc].flagTime[0])
                {
                  //console.log("FLAG");
                  //temp_mlm.BULLY_Flag = 1;
                  mlm["BULLY_Flag"+bin] = 1;
                  //temp_mlm.BULLY_FlagTime = users[i].feedAction[feedIndex].comments[cc].flagTime[0];
                  mlm["BULLY_FlagTime"+bin] = users[i].feedAction[feedIndex].comments[cc].flagTime[0];
                }
                else
                {
                  //temp_mlm.BULLY_Flag = 0;
                  mlm["BULLY_Flag"+bin] = 0;
                  //temp_mlm.BULLY_FlagTime = 0;
                  mlm["BULLY_FlagTime"+bin] = 0; 
                }
              }//end of BULLY COMMENT
              
              //else this is a comment that user made
              else if(users[i].feedAction[feedIndex].comments[cc] && users[i].feedAction[feedIndex].comments[cc].new_comment)
              { 
                //is empty, but user message
                //console.log("NOT BULLY COMMENT - USER COMMENT IN VIC POST");
                //temp_mlm.BULLY_Reply++;
                mlm["BULLY_Reply"+bin] = mlm["BULLY_Reply"+bin] + 1;
                //temp_mlm.BULLY_ReplyTime = users[i].feedAction[feedIndex].comments[cc].time;
                mlm["BULLY_ReplyTime"+bin] = users[i].feedAction[feedIndex].comments[cc].time;

                if (!mlm["BULLY_commentMessage"+bin])
                  mlm["BULLY_commentMessage"+bin] = users[i].feedAction[feedIndex].comments[cc].comment_body;
                else
                  mlm["BULLY_commentMessage"+bin] = mlm["BULLY_commentMessage"+bin] +"|"+users[i].feedAction[feedIndex].comments[cc].comment_body;
              }
            }//end of COMMENT FOR LOOP




            //mlm_array.push(temp_mlm);

            /*
            console.log(":"+mlm.BullyingPost+" Before WRITE MLM Bully message");
            mlm_writer.write(mlm_array[mlm_array.length - 1]);
            console.log(":"+mlm.BullyingPost+" After WRITE MLM Bully message");
            */
          }//end of if FI != 1

          else
          {
            mlm["BullyingPost"+bin] = bin;
            
            //console.log(":"+temp_mlm.BullyingPost+" ELSE temp_mlm Bully message");
            
            //temp_mlm.BullyPostStartREADTime = 0;
            mlm["BullyPostStartREADTime"+bin] = 0;

            //temp_mlm.BullyPostLastReadTime = 0;
            mlm["BullyPostLastReadTime"+bin] = 0;
            //temp_mlm.BullyPostAverageReadTime = 0;
            mlm["BullyPostAverageReadTime"+bin] = 0;
            //temp_mlm.BullyPostNumOfReadTimes = 0;
            mlm["BullyPostNumOfReadTimes"+bin] = 0;

            //temp_mlm.BULLY_VictimPostFlag = 0;
            mlm["BULLY_VictimPostFlag"+bin] = 0;
            //temp_mlm.BULLY_VictimPostFlagTime = 0;
            mlm["BULLY_VictimPostFlagTime"+bin] = 0;
            //temp_mlm.BULLY_VictimPostLike = 0;
            mlm["BULLY_VictimPostLike"+bin] = 0;
            //temp_mlm.BULLY_VictimPostLikeTime = 0;
            mlm["BULLY_VictimPostLikeTime"+bin] = 0;


            //temp_mlm.BULLY_Flag = 0;
            mlm["BULLY_Flag"+bin] = 0;
            //temp_mlm.BULLY_FlagTime = 0;
            mlm["BULLY_FlagTime"+bin] = 0;
            //temp_mlm.BULLY_Like = 0;
            mlm["BULLY_Like"+bin] = 0;
            //temp_mlm.BULLY_LikeTime = 0;
            mlm["BULLY_LikeTime"+bin] = 0;
            //temp_mlm.BULLY_Reply = 0;
            mlm["BULLY_Reply"+bin] = 0;
            //temp_mlm.BULLY_ReplyTime = 0;
            mlm["BULLY_ReplyTime"+bin] = 0;
            //temp_mlm.BULLY_commentMessage = "";
            mlm["BULLY_commentMessage"+bin] = "";

            //mlm_array.push(temp_mlm);
            /*
            console.log(" mlm+array size is  "+ mlm_array.length);

            console.log(":"+mlm.BullyingPost+" Before WRITE MLM Bully message");

            console.log(":"+mlm.BullyingPost+" Before WRITE MLM Bully message");
            mlm_writer.write(mlm_array[mlm_array.length - 1]);
            console.log(":"+mlm.BullyingPost+" After WRITE MLM Bully message");
            */
          }

          //console.log("Before WRITE MLM Bully message  "+ mlm.BullyingPost);
          //mlm_writer.write(mlm);
          //console.log("After WRITE MLM Bully message  "+ mlm.BullyingPost);
        }//for Bully Messages

      sums.GeneralPostNumber = mlm.GeneralPostNumber;
      sums.GeneralReplyNumber = mlm.GeneralReplyNumber + bullyReplies;
      summary_writer.write(sums);


      mlm_writer.write(mlm);
    }//for each user

    /*
    for (var zz = 0; zz < mlm_array.length; zz++) {
      //console.log("writing user "+ mlm_array[zz].email);
      //console.log("writing Bully Post "+ mlm_array[zz].BullyingPost);
      mlm_writer.write(mlm_array[zz]);
    }
    */
      
    mlm_writer.end();
    ss_writer.end();
    summary_writer.end();
    console.log('Wrote MLM!');
    mongoose.connection.close();

  });

