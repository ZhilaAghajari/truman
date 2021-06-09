//Empathy project
// current issues:
// 1- cannot find any posts with class of bullying .. 

const Script = require('../models/Script.js');
const User = require('../models/User');
const Notification = require('../models/Notification');
const _ = require('lodash');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var sort = function (propertyRetriever, arr) {
    arr.sort(function (a, b) {
        var valueA = propertyRetriever(a);
        var valueB = propertyRetriever(b);

        if (valueA < valueB) {
            return -1;
        } else if (valueA > valueB) {
            return 1;
        } else {
            return 0;
        }
    });
};

/**
 * GET /
 * List of Script posts for Feed
*/
exports.getScript = (req, res, next) => {

  //req.user.createdAt
  var time_now = Date.now();
  var time_diff = time_now - req.user.createdAt;
  //var today = moment();
  //var tomorrow = moment(today).add(1, 'days');
  // var two_days = 86400000 * 2; //two days in milliseconds .. 
  // var time_limit = time_diff - two_days; 
  var time_limit = time_diff - (86400000 *2); //one day in milliseconds -- make it to 48 hours (1.728e+8)


  var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var userAgent = req.headers['user-agent']; 

  var bully_post;
  var bullied_actor = []
  var bullied_actor_stories =[]
  var bully_count = 0;
  var bullied_actor_count =0;
  var bully_story_count=0;
  var bully_story; 

  var scriptFilter;

  console.log("$#$#$#$#$#$#$START GET SCRIPT$#$#$$#$#$#$#$#$#$#$#$#$#");
  console.log("time_diff  is now "+time_diff);
  console.log("time_limit  is now "+time_limit);
  
  User.findById(req.user.id)
  .populate({ 
       path: 'posts.reply',
       model: 'Script',
       populate: {
         path: 'actor',
         model: 'Actor'
       } 
    })
  .populate({ 
       path: 'posts.actorAuthor',
       model: 'Actor'
    })
  .populate({ 
       path: 'posts.comments.actor',
       model: 'Actor'
    })
  .exec(function (err, user) {
  
    //filter the script based on experimental group
    scriptFilter = user.group;
    var last_user_post = {};
      
    

    //User is no longer active - study is over
    if (!user.active)
    {
      req.logout();
      req.flash('errors', { msg: 'Account is no longer active. Study is over' });
      res.redirect('/login');
    }

    user.logUser(time_now, userAgent, user_ip);
    user.logPage(Date.now(), "script");

    //what day in the study are we in???
  var one_day = 86400000; //303,695,677 259,200,000
  var current_day;
  
  //day one
  if (time_diff <= one_day)
  {
    current_day = 0;
    //add one to current day user.study_days[current_day]
    user.study_days[0] = user.study_days[0] + 1;
    user.study_days.set(0, user.study_days[0] + 1)
    //console.log("!!!DAY1 is now "+ user.study_days[0]);
  }
  //day two
  else if ((time_diff > one_day) && (time_diff <= (one_day *2))) 
  {
    current_day = 1;
    user.study_days.set(1, user.study_days[1] + 1)
    //console.log("!!!DAY2 is now "+ user.study_days[1]);
  }
  //day 3
  else if ((time_diff >(one_day *2)))
  {
    current_day = 2;
    user.study_days.set(2, user.study_days[2] + 1)
    //console.log("!!!DAY3 is now "+ user.study_days[2]);
  }
  else 
  {
    current_day = -1;
    console.log("@@@@@@@@@@_NO_DAY");
  }

    //Get the newsfeed
    Script.find()
      // .where("experiment_group").equals(scriptFilter)
      .where('time').lte(time_diff).gte(time_limit)
      // .sort('-time')
      .populate('actor')
      .populate({ 
       path: 'comments.actor',
       populate: {
         path: 'actor',
         model: 'Actor',
         // options: { 
         //    sort: 'username'
         //  }
       }
    })
      //Actor's posts!!!
      .exec(function (err, script_feed) {
        if (err) { return next(err); }
        var modal_id = 1;
        var finalfeed = [];
        var unique_actors=[];
        var user_posts = [];
        var final_user_posts =[];
        var final_actors_feed = [];
        
        
        user_posts = user.getPostInPeriod(time_limit, time_diff);

        user_posts.sort(function (a, b) {
            return b.relativeTime - a.relativeTime;
        });
        
        last_user_post = user_posts[0];
        while(script_feed.length || user_posts.length) {

          if(typeof script_feed[0] === 'undefined') {
              console.log("Script_Feed is empty, only push user_posts");
    
              finalfeed.push(user_posts[0]); // 
              final_user_posts.push(user_posts[0]);
              user_posts.splice(0,1);
          }
          else if(!(typeof user_posts[0] === 'undefined') && (script_feed[0].time < user_posts[0].relativeTime)){              
              finalfeed.push(user_posts[0]);
              final_user_posts.push(user_posts[0]);
              user_posts.splice(0,1);
          }
          else{
            
            var feedIndex = _.findIndex(user.feedAction, function(o) { return o.post == script_feed[0].id; });
 
            if(feedIndex!=-1)
            {
              // console.log("WE HAVE AN ACTION!!!!!");
              
              //check to see if there are comments - if so remove ones that are not in time yet.
              //Do all comment work here for feed
              //if (Array.isArray(script_feed[0].comments) && script_feed[0].comments.length) {
              if (Array.isArray(user.feedAction[feedIndex].comments) && user.feedAction[feedIndex].comments) 
              {

                // console.log("WE HAVE COMMENTS!!!!!");
                //iterate over all comments in post - add likes, flag, etc
                for (var i = 0; i < user.feedAction[feedIndex].comments.length; i++) {
                  //i is now user.feedAction[feedIndex].comments index

                    //is this action of new user made comment we have to add???
                    if (user.feedAction[feedIndex].comments[i].new_comment)
                    {
                      //comment.new_comment
                      var cat = new Object();
                      cat.body = user.feedAction[feedIndex].comments[i].comment_body;
                      cat.new_comment = user.feedAction[feedIndex].comments[i].new_comment;
                      cat.time = user.feedAction[feedIndex].comments[i].time;
                      cat.commentID = user.feedAction[feedIndex].comments[i].new_comment_id;
                      cat.likes = 0;
                      script_feed[0].comments.push(cat);
                      //console.log("Already have COMMENT ARRAY");

                    }

                    else
                    {
                      //Do something
                      //var commentIndex = _.findIndex(user.feedAction[feedIndex].comments, function(o) { return o.comment == script_feed[0].comments[i].id; });
                      var commentIndex = _.findIndex(script_feed[0].comments, function(o) { return o.id == user.feedAction[feedIndex].comments[i].comment; });
                      //If user action on Comment in Script Post
                      if(commentIndex!=-1)
                      {

                        //console.log("WE HAVE AN ACTIONS ON COMMENTS!!!!!");
                        //Action is a like (user liked this comment in this post)
                        if (user.feedAction[feedIndex].comments[i].liked)
                        { 
                          script_feed[0].comments[commentIndex].liked = true;
                          script_feed[0].comments[commentIndex].likes++;
                          //console.log("Post %o has been LIKED", script_feed[0].id);
                        }

                        //Action is a FLAG (user Flaged this comment in this post)
                        if (user.feedAction[feedIndex].comments[i].flagged)
                        { 
                          console.log("Comment %o has been LIKED", user.feedAction[feedIndex].comments[i].id);
                          script_feed[0].comments.splice(commentIndex,1);
                        }
                      }
                    }//end of ELSE

                }//end of for loop

              }//end of IF Comments
              
              
              if (user.feedAction[feedIndex].viewedTime[0]) //I changed it from readTime to viewedTime
              { 
                script_feed[0].read = true;
                script_feed[0].state = 'read';
                // console.log("Post: %o has been READ?", script_feed[0].id);
              }
              else 
              {
                script_feed[0].read = false;
                
                //script_feed[0].state = 'read';
              }

              if (user.feedAction[feedIndex].liked)
              { 
                script_feed[0].like = true;
                script_feed[0].likes++;
                // console.log("Post %o has been LIKED", script_feed[0].id);
              }

              if (user.feedAction[feedIndex].replyTime[0])
              { 
                script_feed[0].reply = true;
                //console.log("Post %o has been REPLIED", script_feed[0].id);
              }

              //If this post has been flagged - remove it from FEED array (script_feed)
              if (user.feedAction[feedIndex].flagTime[0])
              { 
                script_feed.splice(0,1);
                //console.log("Post %o has been FLAGGED", script_feed[0].id);
              }

              //post is from blocked user - so remove  it from feed
              else if (user.blocked.includes(script_feed[0].actor.username))
              {
                script_feed.splice(0,1);
              }

              //if bully post && first viewing of the day
              else if (script_feed[0].class == "bullying" && user.study_days[current_day] > 0 && bully_count == 0 && !script_feed[0].read)
              {
                bully_post = script_feed[0];
                bully_count = 1;
                console.log("%$%$%$%$%$%$%$Found a bully post and will push it :", bully_post._id);
                script_feed.splice(0,1);
              }
              else
              {
                
                finalfeed.push(script_feed[0]);
                final_actors_feed.push(script_feed[0]);
                script_feed.splice(0,1);
              }

            }//end of IF we found Feed_action

            else
            {
              if (user.blocked.includes(script_feed[0].actor.username))
              {
                script_feed.splice(0,1);
              }

              else if (script_feed[0].class == "bullying" && user.study_days[current_day] > 0 && bully_count == 0)
              { 
                bully_post = script_feed[0];
                console.log("%$%$%$%$%$%$%$Found a bully post and will push it^2 :",bully_post._id );
                bully_count = 1;
                script_feed.splice(0,1);
                if ( (scriptFilter =="var3" || scriptFilter == "var4" || scriptFilter == 'var5' || scriptFilter == 'var6') && bully_story_count == 0)
                {
                  bully_story_count == 1
                  bully_story = bully_post
                  console.log('we have a bully story: ', bully_story)
                }

              }


              else
              { 
                finalfeed.push(script_feed[0]);
                final_actors_feed.push(script_feed[0]);
                script_feed.splice(0,1);
              }
            }
                        
            }//else in while loop
      }//while loop
      

      user.save((err) => {
        if (err) {
          console.log("ERROR IN USER SAVE IS "+err);
          return next(err);
        }
        //req.flash('success', { msg: 'Profile information has been updated.' });
      });

      finalfeed = shuffle(finalfeed); // it includes all the user's and actors' posts .. 

      // Control Condition: (feed, message centric)
      var control_feed = JSON.parse(JSON.stringify(finalfeed));
      if(typeof last_user_post!== 'undefined')
      {
        if(last_user_post.relativeTime>control_feed[0].time)
        {
          // find the user's last post in the feed, and move it on the top of the feed:
          for(var i=0; i<control_feed.length; i++)
          {
            if(last_user_post._id == control_feed[i]._id)
            {
              var a = control_feed.splice(i, 1);
              control_feed.splice(0,0, a[0]);
              break;
            }
          }
        }
      }
      
      if (user.study_days[current_day] > 0 && bully_post)
      {
        var bully_index = Math.floor(Math.random() * 4) + 1 
        control_feed.splice(bully_index, 0, bully_post);
        console.log('bullying post added ***Control Condition*** ');

      }


      // Condition: stories message centric
      var stry_msg =JSON.parse(JSON.stringify(finalfeed));
      if(typeof last_user_post!== 'undefined'){
        // var stry_msg = []
        // if user posted recently, put the user's post on the top!
        if(last_user_post.relativeTime>finalfeed[0].time)
        {
          // stry_msg.push(last_user_post);
          for(var i = 0; i<stry_msg.length; i++)
          {
            if(last_user_post._id == stry_msg[i]._id)
            {
              var a = stry_msg.splice(i, 1);
              stry_msg.splice(0,0, a[0]);
              break;
            }
          }
        }
      }
      // add the bully post to stories message centric.
      if (user.study_days[current_day] > 0 && bully_post && bully_story)
      {
        var bully_index = Math.floor(Math.random() * 4) + 1 
        // if it duplicates the bullied post, first remove the bullied post from the str_msg, then add it to the bully_index!!!!
        stry_msg.splice(bully_index, 0, bully_post);
        console.log('bullying post added **Story-Message-Centric*** ', bully_story);

      }
      // console.log('STORY message centric :', stry_msg)

      // need to restore the ids for some reason they will be lost if I don't do it manually 
      for(var i=0; i<stry_msg.length; i++){
        var temp = new Object();
        temp.modal_id = i+1
        tmp = stry_msg[i]._id;        
        const temp_stories_feed = JSON.parse(JSON.stringify(stry_msg[i]));
        stry_msg[i] = Object.assign(temp_stories_feed,temp);
        stry_msg[i].id = tmp;
      }
      // final_actors_feed.splice(0, 0, bully_post);


      // for the stories-individual centric, group the stories by their authors: 
      unique_authors = [...new Set(final_actors_feed.map(item => item.actor.username))];
      if(final_user_posts.length>0)
      {
        unique_authors.push(user.username); 
      }    
      
      unique_authors = shuffle(unique_authors);

      // feed Individual-Centric: group the posts based on their authors
      var individual_feed_version = []
      for( var i=0; i<unique_authors.length; i++)
      {
        if(unique_authors[i] == user.username)
        {
          // Sam says we don't need to say these are the post YOU created. 
          var middle = {
            type:'user',
            picture: user.profile.picture
          }
          individual_feed_version.push(middle);
          Array.prototype.push.apply(individual_feed_version, final_user_posts);

        }
        else // actor's posts
        {
          let temp = final_actors_feed.find(item => item.actor.username == unique_authors[i])
          var temp_record;

          var temp_record = final_actors_feed.filter(obj => { return obj.actor.username == unique_authors[i]})
          
          var middle_post = {
            type:'actor',
            picture : temp_record[0].actor.profile.picture,
            name: temp_record[0].actor.profile.name,
            username: temp_record[0].actor.username
          }
          
          //  I now only store the bullied actor posts in bullied_actor and then add them to the individual_feed_version
          if(user.study_days[current_day] > 0 && bully_post && unique_authors[i] == bully_post.actor.username && bullied_actor.length==0)
          { 
            // store all this actor's posts in a temporary array to shift these posts within the first four posts...
            bullied_actor.push(middle_post)
            bullied_actor.push(bully_post);
            
            Array.prototype.push.apply(bullied_actor, temp_record)
            // console.log('Found a bullied actor', bully_post)

          }
          else{
            individual_feed_version.push(middle_post);
            Array.prototype.push.apply(individual_feed_version, temp_record);
          }
        }
      }

      // add the bullied person's post in the first 4 posts
      if (user.study_days[current_day] > 0 && bully_post)
      {
        // 
        var bully_index = Math.floor(Math.random() * 4) + 1 
      
        if(individual_feed_version[bully_index].type)
        {
         bully_index = bully_index+1; 
        }

        // passing the posts pf previous author -- untill we get to the an intro (profile) post 
        while(!individual_feed_version[bully_index].hasOwnProperty('type'))
        {
          bully_index = bully_index+1;
        }                


        // for(var i=0; i<individual_feed_version.length; i++)
        // {
        //   if(individual_feed_version[i].hasOwnProperty('type') && individual_feed_version[i].type ==='actor' && individual_feed_version[i].username === bully_post.actor.username)
        //   {
        //     var a = individual_feed_version.splice(i, 1);
        //     individual_feed_version.splice(bully_index, 0, bullied_actor[0]);
        //     break;
        //   }
        // }

        // add the posts of the bullied actor
        for(var i=1; i<=bullied_actor.length; i++)
        {
          individual_feed_version.splice(bully_index+i-1, 0, bullied_actor[i-1]);
          // for(var j=1; j<individual_feed_version.length; j++)
          // { 
            
          //   if((typeof individual_feed_version[j]['type']=='undefined') && bullied_actor[i-1].actor.username ===individual_feed_version[j].actor.username)
          //   {
          //     var a = individual_feed_version.splice(j, 1);
          //     individual_feed_version.splice(bully_index+i-1, 0, bullied_actor[i-1]);
          //   }
          // }
          
        }

        // Add the user's recent post on the top in case he/she recently posted something
        if(typeof last_user_post!== 'undefined')
        {
          if(last_user_post.relativeTime>individual_feed_version[1].time)
          {
            for(var i = 0; i<individual_feed_version.length; i++)
            {
              if(last_user_post._id == individual_feed_version[i]._id)
              {
                var a = individual_feed_version.splice(i, 1);
                individual_feed_version.splice(0,0, a[0]);
                break;
              }

            }
          }
        }
      }



      var stories_person_feed = []
      for( var i=0; i<unique_authors.length; i++)
      {
        // find posts that are created by this authors ..
        if(unique_authors[i] == user.username)
        {
          //Sam says we don't need to have a module to say these are posts created by you (user)
          //comment it for now to check how it looks ..
          var middle_post = {
            type:'user',
            picture : user.profile.picture
          }
          stories_person_feed.push(middle_post);
          Array.prototype.push.apply(stories_person_feed, final_user_posts);

        }
        else //adding actor's post
        {
          
          var temp_record = final_actors_feed.filter(obj => { return obj.actor.username == unique_authors[i]})

          var middle_post = {
            type:'actor',
            picture : temp_record[0].actor.profile.picture,
            name: temp_record[0].actor.profile.name,
            username: temp_record[0].actor.username
          }
          


          if(user.study_days[current_day] > 0 && bully_story&& unique_authors[i] == bully_post.actor.username && bullied_actor_stories.length==0)
          {
            bullied_actor_stories.push(middle_post);
            bullied_actor_stories.push(bully_post);
            Array.prototype.push.apply(bullied_actor_stories, temp_record)
          }
          else{
            stories_person_feed.push(middle_post);
            Array.prototype.push.apply(stories_person_feed, temp_record);

          }
          
        }
        
      } // end of adding the author's related info (to be shown between posts of each authors) 

       // adding bully post to individual-centric stories: 
      if (user.study_days[current_day] > 0 && bully_story)
      {
        var bully_index = Math.floor(Math.random() * 4) + 1 
        if(stories_person_feed[bully_index].type)
        {
          bully_index = bully_index+1;
        }

        while(!stories_person_feed[bully_index].hasOwnProperty('type'))//passing the posts till we get to a intro (profile picture) post
        { 
          bully_index = bully_index+1;
        }
        
        // add the profile of the bullied actor at the index "bully_index"
        // for(var i=0; i<stories_person_feed.length; i++)
        // {
        //   if(stories_person_feed[i].hasOwnProperty('type') && stories_person_feed[i].type ==='actor' && stories_person_feed[i].username === bully_post.actor.username)
        //   {
        //     var a = stories_person_feed.splice(i, 1);
        //     stories_person_feed.splice(bully_index, 0, bullied_actor_stories[0]);
        //     break;
        //   }
        // }
        // add the posts created by the bullied actor .. [is there a better way to do it? I had to use a 2 for loop because I wanted to remove the posts, then add them to the front]
        for(var i=1; i<=bullied_actor_stories.length; i++)
        {
          stories_person_feed.splice(bully_index+i-1, 0, bullied_actor_stories[i-1]);
          // for(var j=1; j<stories_person_feed.length; j++)
          // {            
          //   if( (typeof stories_person_feed[j]['type']=='undefined') && bullied_actor_stories[i-1].actor.username ===stories_person_feed[j].actor.username)
          //   {
          //     var a = stories_person_feed.splice(j, 1);
          //     stories_person_feed.splice(bully_index+i-1, 0, bullied_actor_stories[i-1]);
          //   }
          // }
          
        }
      }

      


      // stories-individual centric .. put users' recent post on the top 
      if(typeof last_user_post!== 'undefined')
      {
        if(last_user_post.relativeTime>stories_person_feed[1].time)
        {
          // stry_prsn.splice(0, 0, last_user_post);
          for(var i = 0; i<stories_person_feed.length; i++)
          {
            if(last_user_post._id == stories_person_feed[i]._id)
            {
              var a = stories_person_feed.splice(i, 1);
              stories_person_feed.splice(0,0, a[0]);
              break;
            }
          }
        }
      }
      
      // we have to do it to restore the IDs, otherwise they will be lost! find a better way to do it
      for(var i=0; i<stories_person_feed.length; i++){
        var temp = new Object();
        temp.modal_id = i+1
        tmp = stories_person_feed[i]._id;
        const temp_final_feed = JSON.parse(JSON.stringify(stories_person_feed[i]));
        stories_person_feed[i] = Object.assign(temp_final_feed,temp);
        stories_person_feed[i].id = tmp;
      }



      if(scriptFilter == 'var1'){
        res.render('script', { script: control_feed}); //control condition ... /
      }
      else if(scriptFilter == 'var2'){
        res.render('feedIndividualCentric', { script: individual_feed_version}); // ... /
      }
      else if(scriptFilter == 'var3'){ //stories-person-delay??
        res.render('stories',{script:stories_person_feed}) 
      }
      else if(scriptFilter == 'var4'){//stories-person-NO-delay
        res.render('storiesIndividualCentric',{script:stories_person_feed})
      }
      else if(scriptFilter == 'var5'){ //no delay
        res.render('storiesMessageClick', { script: stry_msg});
      }
      else if(scriptFilter == 'var6'){//delay
        res.render('storiesMessageDelay', { script: stry_msg}); // .... 
      }
     

      

      });//end of Script.find()

    
  });//end of User.findByID

};//end of .getScript

exports.getScriptPost = (req, res) => {

	Script.findOne({ _id: req.params.id}, (err, post) => {
		// console.log(post);
		res.render('script_post', { post: post });
	});
};

/**
 * GET /
 * List of Script posts for Feed
 * Made for testing
*/
exports.getScriptFeed = (req, res, next) => {


  console.log("$#$#$#$#$#$#$START GET FEED$#$#$$#$#$#$#$#$#$#$#$#$#");
  //console.log("time_diff  is now "+time_diff);
  //console.log("time_limit  is now "+time_limit);
  //study2_n0_p0
  console.log("$#$#$#$#$#$#$START GET FEED$#$#$$#$#$#$#$#$#$#$#$#$#");
  var scriptFilter = "";

  

  var profileFilter = "";
  //study3_n20, study3_n80



  scriptFilter = req.params.caseId;

  //req.params.modId
  console.log("#############SCRIPT FILTER IS NOW " + scriptFilter);
  
  //{
  
    Script.find()
      //change this if you want to test other parts
      //.where(scriptFilter).equals("yes")
      //.where('time').lte(0)
      .sort('-time')
      .populate('actor')
      .populate({ 
       path: 'comments.actor',
       populate: {
         path: 'actor',
         model: 'Actor'
       } 
    })
      .exec(function (err, script_feed) {
        if (err) { return next(err); }
        //Successful, so render

        //update script feed to see if reading and posts has already happened
        var finalfeed = [];
        finalfeed = script_feed;
  

      console.log("Script Size is now: "+finalfeed.length);
      res.render('feed', { script: finalfeed, namefilter:profileFilter}); //ZH: does this feed include all the posts
      //from both actors and users? In other words, does the finalfeed include all the posts from bots and users?

      });//end of Script.find()

};//end of .getScript


/*
##############
NEW POST
#############
*/
exports.newPost = (req, res) => {

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    //var lastFive = user.id.substr(user.id.length - 5);
   // console.log(lastFive +" just called to create a new post");
    //console.log("OG file name is "+req.file.originalname);
    //console.log("Actual file name is "+req.file.filename);
    console.log("###########NEW POST###########");
    console.log("Text Body of Post is "+req.body.body);

    var post = new Object();
    post.body = req.body.body;
    post.absTime = Date.now();
    post.relativeTime = post.absTime - user.createdAt;

    //if numPost/etc never existed yet, make it here - should never happen in new users
    if (!(user.numPosts) && user.numPosts < -1)
    {
      user.numPosts = -1;
      console.log("numPost is "+user.numPosts);
    }

    if (!(user.numReplies) && user.numReplies < -1)
    {
      user.numReplies = -1;
      console.log("numReplies is "+user.numReplies);
    }

    if (!(user.numActorReplies) && user.numActorReplies < -1)
    {
      user.numActorReplies = -1;
      console.log("numActorReplies is "+user.numActorReplies);
    }

    //This is a new post - not comment or reply
    if (req.file)
    {
      console.log("Text PICTURE of Post is "+req.file.filename);
      post.picture = req.file.filename;
      console.log('num of posts: ', user.numPosts);

      user.numPosts = user.numPosts + 1;
      post.postID = user.numPosts;
      post.type = "user_post";
      post.comments = [];
      

      //Now we find any Actor Replies (Comments) that go along with it
      Notification.find()
        .where('userPost').equals(post.postID)
        .where('notificationType').equals('reply')
        .populate('actor')
        .exec(function (err, actor_replies) {
          if (err) { return next(err); }
          //console.log("%^%^%^^%INSIDE NOTIFICATION&^&^&^&^&^&^&");
          if (actor_replies.length > 0)
          {
            //we have a actor reply that goes with this userPost
            //add them to the posts array

            //console.log("@@@@@@@We have Actor Comments to add: "+actor_replies.length);
            for (var i = 0, len = actor_replies.length; i < len; i++) {
              var tmp_actor_reply = new Object();

              //actual actor reply information
              tmp_actor_reply.body = actor_replies[i].replyBody;
              //tmp_actor_reply.actorReplyID = actor_replies[i].replyBody;
              //might need to change to above
              user.numActorReplies = user.numActorReplies + 1;
              tmp_actor_reply.commentID = user.numActorReplies;
              tmp_actor_reply.actor = actor_replies[i].actor;

              tmp_actor_reply.time = post.relativeTime + actor_replies[i].time;

              //add to posts
              post.comments.push(tmp_actor_reply);

              

            }

            
          }//end of IF

          //console.log("numPost is now "+user.numPosts);
          user.posts.unshift(post);
          user.logPostStats(post.postID);
          //console.log("CREATING NEW POST!!!");

          user.save((err) => {
            if (err) {
              return next(err);
            }
            //req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/');
          });

        });//of of Notification

    }

    else
    {
      console.log("@#@#@#@#@#@#@#ERROR: Oh Snap, Made a Post but not reply or Pic")
      req.flash('errors', { msg: 'ERROR: Your post or reply did not get sent' });
      res.redirect('/');
    }

  });
};

/**
 * POST /feed/
 * Update user's profie feed posts Actions.
 */
exports.postUpdateFeedAction = (req, res, next) => {
  var n;
  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { 
      console.log('somehow user does not exist here');
      return next(err);
       }


    // set the loging time...
    // console.log('What the hell is the the request in feed: ', req.body);
    if(req.body.last_loging)
    { 
      // console.log('HAH the request: ', req.body);       
      user.last_loging = parseInt(req.body.last_loging);
      console.log('########## Here we go - LAST LOGING TIME  in feed ##########: ', user.last_loging);
      
    }
    //find the object from the right post in feed 
    var feedIndex = _.findIndex(user.feedAction, function(o) { return o.post == req.body.postID; });

    // console.log("@@@ USER index is  ", feedIndex);

    if(feedIndex==-1)
    {
      //Post does not exist yet in User DB, so we have to add it now
      console.log("$$$$$Making new feedAction Object! at post ", req.body.postID);
      var cat = new Object();
      cat.post = req.body.postID;
      if(!(req.body.start))
        {
          console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!No start");
        }
      cat.startTime = req.body.start || 0;
      cat.rereadTimes = 0;
      //add new post into feedAction
      user.feedAction.push(cat);
      feedIndex = user.feedAction.length - 1;

    }

    //we found the right post, and feedIndex is the right index for it
    // console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);

    //create a new Comment
    if(req.body.new_comment)
    {
       
        var cat = new Object();
        cat.new_comment = true;
        user.numReplies = user.numReplies + 1;
        cat.new_comment_id = user.numReplies; 
        cat.comment_body = req.body.comment_text;
        //console.log("Start Time is: "+user.feedAction[feedIndex].startTime);
        //console.log("DATE Time is: "+req.body.new_comment);
        cat.commentTime = req.body.new_comment - user.feedAction[feedIndex].startTime;
        //console.log("Comment Time is: "+cat.commentTime);

        //create a new cat.comment id for USER replies here to do actions on them. Empty now

        cat.absTime = Date.now();
        cat.time = cat.absTime - user.createdAt;
        user.feedAction[feedIndex].comments.push(cat);
        user.feedAction[feedIndex].replyTime = [cat.time];
        user.numComments = user.numComments + 1;
      
        //console.log("$#$#$#$#$#$$New  USER COMMENT Time: ", cat.commentTime);
    }

    //Are we doing anything with a comment?
    else if(req.body.commentID)
    {
      console.log("We have a comment action");
      var commentIndex = _.findIndex(user.feedAction[feedIndex].comments, function(o) { return o.comment == req.body.commentID; });

      //no comment in this post-actions yet
      if(commentIndex==-1)
      {
        console.log("@@@@@@@@@@ COMMENT new feedAction Object! at commentID ", req.body.commentID);
        var cat = new Object();
        cat.comment = req.body.commentID;
        user.feedAction[feedIndex].comments.push(cat);
        //commentIndex = 0;
        commentIndex = user.feedAction[feedIndex].comments.length - 1;
      }

      //LIKE A COMMENT
      if(req.body.like)
      {
        console.log("Comment ID is  ", commentIndex);
        let like = req.body.like - user.feedAction[feedIndex].startTime
        console.log("!!!!!!New FIRST COMMENT LIKE Time: ", like);
        if (user.feedAction[feedIndex].comments[commentIndex].likeTime)
        {
          user.feedAction[feedIndex].comments[commentIndex].likeTime.push(like);

        }
        else
        {
          user.feedAction[feedIndex].comments[commentIndex].likeTime = [like];
          console.log("!!!!!!!adding FIRST COMMENT LIKE time [0] now which is  ", user.feedAction[feedIndex].likeTime[0]);
        }
        user.feedAction[feedIndex].comments[commentIndex].liked = true;
        user.numCommentLikes++
        
      }
      //FLAG A COMMENT
      else if(req.body.flag)
      {
        let flag = req.body.flag - user.feedAction[feedIndex].startTime
        console.log("!!!!!!New FIRST COMMENT flag Time: ", flag);
        if (user.feedAction[feedIndex].comments[commentIndex].flagTime)
        {
          user.feedAction[feedIndex].comments[commentIndex].flagTime.push(flag);

        }
        else
        {
          user.feedAction[feedIndex].comments[commentIndex].flagTime = [flag];
          //console.log("!!!!!!!adding FIRST COMMENT flag time [0] now which is  ", user.feedAction[feedIndex].flagTime[0]);
        }
        user.feedAction[feedIndex].comments[commentIndex].flagged = true;
        
      }

    }//end of all comment junk

    //not a comment - its a post action
    else
    {

      //array of flagTime is empty and we have a new (first) Flag event
      if ((!user.feedAction[feedIndex].flagTime)&&req.body.flag && (req.body.flag > user.feedAction[feedIndex].startTime))
      { 
        let flag = req.body.flag - user.feedAction[feedIndex].startTime
        console.log("!!!!!New FIRST FLAG Time: ", flag);
        user.feedAction[feedIndex].flagTime = [flag]; 
        //console.log("!!!!!adding FIRST FLAG time [0] now which is  ", user.feedAction[feedIndex].flagTime[0]);
      }

      //Already have a flagTime Array, New FLAG event, need to add this to flagTime array
      else if ((user.feedAction[feedIndex].flagTime)&&req.body.flag && (req.body.flag > user.feedAction[feedIndex].startTime))
      { 
        let flag = req.body.flag - user.feedAction[feedIndex].startTime
        console.log("%%%%%Add new FLAG Time: ", flag);
        user.feedAction[feedIndex].flagTime.push(flag);
      }

      //array of likeTime is empty and we have a new (first) LIKE event
      else if ((!user.feedAction[feedIndex].likeTime)&&req.body.like && (req.body.like > user.feedAction[feedIndex].startTime))
      { 
        let like = req.body.like - user.feedAction[feedIndex].startTime
        console.log("!!!!!!New FIRST LIKE Time: ", like);
        user.feedAction[feedIndex].likeTime = [like];
        user.feedAction[feedIndex].liked = true;
        user.numPostLikes++;
        //console.log("!!!!!!!adding FIRST LIKE time [0] now which is  ", user.feedAction[feedIndex].likeTime[0]);
      }

      //Already have a likeTime Array, New LIKE event, need to add this to likeTime array
      else if ((user.feedAction[feedIndex].likeTime)&&req.body.like && (req.body.like > user.feedAction[feedIndex].startTime))
      { 
        let like = req.body.like - user.feedAction[feedIndex].startTime
        console.log("%%%%%Add new LIKE Time: ", like);
        user.feedAction[feedIndex].likeTime.push(like);
        if(user.feedAction[feedIndex].liked)
        {
          user.feedAction[feedIndex].liked = false;
          user.numPostLikes--;
        }
        else
        {
          user.feedAction[feedIndex].liked = true;
          user.numPostLikes++;
        }
      }

      //array of replyTime is empty and we have a new (first) REPLY event
      else if ((!user.feedAction[feedIndex].replyTime)&&req.body.reply && (req.body.reply > user.feedAction[feedIndex].startTime))
      { 
        let reply = req.body.reply - user.feedAction[feedIndex].startTime
        //console.log("!!!!!!!New FIRST REPLY Time: ", reply);
        user.feedAction[feedIndex].replyTime = [reply];
        //console.log("!!!!!!!adding FIRST REPLY time [0] now which is  ", user.feedAction[feedIndex].replyTime[0]);
      }

      //Already have a replyTime Array, New REPLY event, need to add this to replyTime array
      else if ((user.feedAction[feedIndex].replyTime)&&req.body.reply && (req.body.reply > user.feedAction[feedIndex].startTime))
      { 
        let reply = req.body.reply - user.feedAction[feedIndex].startTime
        //console.log("%%%%%Add new REPLY Time: ", reply);
        user.feedAction[feedIndex].replyTime.push(reply);
      }

      //array of viewedTimes is empty and we have a new VIEW event
      else if ((!user.feedAction[feedIndex].viewedTime) && req.body.viewed)
      {
        let viewedTime = req.body.viewed;
        user.feedAction[feedIndex].viewedTime = [viewedTime];
        console.log('add the viewedTime: ', viewedTime)
        console.log('ID of the viewed post: ??: ', req.body.postID)

        var bully_messages =["60b0ed6c42961f56f9dac468","60b0ed6d42961f56f9dac4d5","60b0ed6c42961f56f9dac4ae","60b0ed6e42961f56f9dac566"];


        if(req.body.postID=='60b0ed6c42961f56f9dac468' || req.body.postID == "60b0ed6d42961f56f9dac4d5" || req.body.postID =="60b0ed6c42961f56f9dac4ae" || req.body.postID =="60b0ed6e42961f56f9dac566")
        {

          // console.log('SEEN BULLY !!!!!!!!! ', user);
          var d = new Date();
          n = d.getTime();
          user.last_bullyPost_viewed_Time = n;
          // console.log('print this for me:' , typeof n, user.last_bullyPost_viewed_Time)
          // user.feedAction[feedIndex].bully_viewed_timePeriod = viewedTime;
          // console.log('Check this: ', user.last_bullyPost_viewed_Time);
          user.seen_bullyPost_readTime.push(viewedTime);
          user.seen_bully_time.push(n);
        }
      }

      //Already have a viewedTime Array, New VIEW event, need to add this to readTime array
      else if ((user.feedAction[feedIndex].viewedTime)&&req.body.viewed)
      {
        let viewedTime = req.body.viewed;
        user.feedAction[feedIndex].viewedTime.push(viewedTime);
        console.log('add the viewedTime^2 ', viewedTime);
        console.log('ID of the viewed post^2: ??: ', req.body.postID);
        if(req.body.postID=='60b0ed6c42961f56f9dac468' || req.body.postID == "60b0ed6d42961f56f9dac4d5" || req.body.postID =="60b0ed6c42961f56f9dac4ae" || req.body.postID =="60b0ed6e42961f56f9dac566")
        {
          // console.log('SEEN BULLY !!!!!!!!! ', user);
          var d = new Date();
          n = d.getTime();
          // if the iD is not currently in bully_ID
          // console.log('what is inside the user.bully_ID ', user.bully_ID);
          var index = user.bully_ID.findIndex(x => x.id ===req.body.postID)
          user.last_bullyPost_viewed_Time = n;
          user.seen_bullyPost_readTime.push(viewedTime);
          user.seen_bully_time.push(n);
          if(index === -1)
          {
            var temp = {
            id:req.body.postID,
            t : n
            }
            user.bully_ID.push(temp);          }
          //just update the last seen time...
          else
          {
            user.bully_ID[index].t = n;
          }          
        }
      }

      
      else if(req.body.session_survey)
      {
        // find the time of the last seen post...
        console.log('session survey values: ', req.body.session_survey);
        // console.log("what is in request000", req.body);
        var cat = new Object(); 

        var bully_messages =["60b0ed6c42961f56f9dac468","60b0ed6d42961f56f9dac4d5","60b0ed6c42961f56f9dac4ae","60b0ed6e42961f56f9dac566"];


        cat.compassionate =req.body.session_survey[0];
        cat.sympathy = req.body.session_survey[1];
        cat.warm =req.body.session_survey[2];
        cat.touched = req.body.session_survey[3];
        cat.effort = req.body.session_survey[4];
        cat.efficacy = req.body.session_survey[5];
        cat.closeness = req.body.session_survey[6];
        var last_loging = req.body.session_survey[7];
        cat.likes = req.body.session_likes;
        cat.flags = req.body.session_flags;
        cat.time =req.body.time;

      // ‍  cat.unique_bully_count = user.bully_ID.filter(x => x.t>Date.parse(user.log[user.log.length-1].time)).length;
        seen_bully_count = user.seen_bully_time.filter(x => x>Date.parse(user.log[user.log.length-1].time)).length; 
        cat.seen_bully_count = seen_bully_count;
        // console.log('LAST Bully Post: ', user.last_bullyPost_viewed_Time);
        // console.log('Last loging updated new version: ', user.last_loging);
        
        // Zhila: this is not true!! Log is not accurate
        // if (user.last_bullyPost_viewed_Time> Date.parse(user.log[user.log.length-1].time))
        console.log('the second approach for last_loging: ', last_loging);
        if (user.last_bullyPost_viewed_Time> last_loging)
        {
          console.log('SAW THE BULLY before the survey');
          cat.seen_bully_post = 'True';
          cat.bully_post_viewedTime = user.seen_bullyPost_readTime[user.seen_bullyPost_readTime.length-1];
        }
        else{
          console.log('MISSED THE BULLY before the survey')
          cat.seen_bully_post = 'False';
        }

        user.session_survey.push(cat);

      }

      else
      {
        // I get this one as well! what happened? 
        console.log("Got a POST that did not fit anything. Possible Error.")
      }
    }//else ALL POST ACTIONS IF/ELSES
    // test and remove:
    
       //console.log("####### END OF ELSE post at index "+ feedIndex);

    //}//end of else
    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in feedAction went crazy. You should never see this.' });

          return res.redirect('/');
        }
        console.log("ERROR ON FEED_ACTION SAVE")
        console.log(JSON.stringify(req.body));
        console.log(err);
        return next(err);
      }
      //req.flash('success', { msg: 'Profile information has been updated.' });
      //res.redirect('/account');
      console.log("@@@@@@@@@@@ SAVED TO DB!!!!!!!!! ");
      res.send({result:"success"});
    });
  });
};

/**
 * POST /pro_feed/
 * Update user's profile feed posts Actions.
 getUserPostByID
 */
exports.postUpdateProFeedAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }

    console.log("@@@@@@@@@@@ TOP profile of PRO FEED  ", req.body.postID);



    //find the object from the right post in feed 
    var feedIndex = _.findIndex(user.profile_feed, function(o) { return o.profile == req.body.postID; });

    console.log("index is  ", feedIndex);

    if(feedIndex==-1)
    {
      //Profile does not exist yet in User DB, so we have to add it now
      console.log("$$$$$Making new profile_feed Object! at post ", req.body.postID);
      var cat = new Object();
      cat.profile = req.body.postID;
      if(!(req.body.start))
        {
          console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!No start");
        }
      cat.startTime = req.body.start;
      cat.rereadTimes = 0;
      //add new post into feedAction
      user.profile_feed.push(cat);

    }
    else
    {
      //we found the right post, and feedIndex is the right index for it
      // console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);

      //update to new StartTime
      if (req.body.start && (req.body.start > user.profile_feed[feedIndex].startTime))
      { 
        
        user.profile_feed[feedIndex].startTime = req.body.start;
        user.profile_feed[feedIndex].rereadTimes++;

      }

      //OLD READ TIME APPROACH
/*


      //array of readTimes is empty and we have a new READ event
      else if ((!user.profile_feed[feedIndex].readTime)&&req.body.read && (req.body.read > user.profile_feed[feedIndex].startTime))
      { 
        let read = req.body.read - user.profile_feed[feedIndex].startTime
        //console.log("!!!!!New FIRST READ Time: ", read);
        user.profile_feed[feedIndex].readTime = [read];
        //console.log("!!!!!adding FIRST READ time [0] now which is  ", user.feedAction[feedIndex].readTime[0]);
      }

      //Already have a readTime Array, New READ event, need to add this to readTime array
      else if ((user.profile_feed[feedIndex].readTime)&&req.body.read && (req.body.read > user.profile_feed[feedIndex].startTime))
      { 
        let read = req.body.read - user.profile_feed[feedIndex].startTime
        //console.log("%%%%%Add new Read Time: ", read);
        user.profile_feed[feedIndex].readTime.push(read);
      }

      //array of picture_clicks is empty and we have a new (first) picture_clicks event
      else if ((!user.profile_feed[feedIndex].picture_clicks)&&req.body.picture && (req.body.picture > user.profile_feed[feedIndex].startTime))
      { 
        let picture = req.body.picture - user.profile_feed[feedIndex].startTime
        console.log("!!!!!New FIRST picture Time: ", picture);
        user.profile_feed[feedIndex].picture_clicks = [picture];
        console.log("!!!!!adding FIRST picture time [0] now which is  ", user.profile_feed[feedIndex].picture_clicks[0]);
      }
*/

      //Already have a picture_clicks Array, New PICTURE event, need to add this to picture_clicks array
      else if ((user.profile_feed[feedIndex].picture_clicks)&&req.body.picture && (req.body.picture > user.profile_feed[feedIndex].startTime))
      { 
        let picture = req.body.picture - user.profile_feed[feedIndex].startTime
        console.log("%%%%%Add new PICTURE Time: ", picture);
        user.profile_feed[feedIndex].picture_clicks.push(picture);
      }

      else
      {
        console.log("Got a POST that did not fit anything. Possible Error.")
      }

    }//else 




    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in profile_feed went crazy. You should never see this.' });

          return res.redirect('/');
        }
        console.log(err);
        return next(err);
      }
      //req.flash('success', { msg: 'Profile information has been updated.' });
      //res.redirect('/account');
      //console.log("@@@@@@@@@@@ SAVED TO DB!!!!!!!!! ");
      res.send({result:"success"});
    });
  });
};

/**
 * POST /userPost_feed/
 * Update user's POST feed Actions.
 */
exports.postUpdateUserPostFeedAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }
    console.log('the request in USER FEED: ', req.body);
    // if(req.body.last_loging)
    // { 
    //   user.last_loging = parseInt(req.body.last_loging);
    //   console.log('########## Here we go - LAST LOGING TIME  in POST FEED ACTION ##########: ', user.last_loging);
      
    // }

    //find the object from the right post in feed 
    var feedIndex = _.findIndex(user.posts, function(o) { return o.postID == req.body.postID; });

    console.log("User Posts index is  ", feedIndex);
    // console.log("what is in request", req.body);
    if(feedIndex==-1)
    {
      //User Post does  not exist yet, This is an error
      console.log("$$$$$ERROR: Can not find User POST ID: ", req.body.postID);

    }

   //create a new Comment
    else if(req.body.new_comment)
    {
        var cat = new Object();
        cat.new_comment = true;
        user.numReplies = user.numReplies + 1;
        cat.commentID = 900 + user.numReplies; //this is so it doesn't get mixed with actor comments
        cat.body = req.body.comment_text;
        cat.isUser = true;
        cat.absTime = Date.now();
        cat.time = cat.absTime - user.createdAt; // relative time ...
        user.posts[feedIndex].comments.push(cat);
        console.log("$#$#$#$#$#$$New  USER COMMENT Time: ", cat.time);
    }

    //Are we doing anything with a comment?
    else if(req.body.commentID)
    {
      var commentIndex = _.findIndex(user.posts[feedIndex].comments, function(o) { return o.commentID == req.body.commentID; });

      //no comment in this post-actions yet
      if(commentIndex==-1)
      {
        console.log("!!!!!!Error: Can not find Comment for some reason!");
      }

      //LIKE A COMMENT
      else if(req.body.like)
      {

        console.log("%^%^%^%^%^%User Post comments LIKE was: ", user.posts[feedIndex].comments[commentIndex].liked);
        user.posts[feedIndex].comments[commentIndex].liked = user.posts[feedIndex].comments[commentIndex].liked ? false : true;        
        console.log("^&^&^&^&^&User Post comments LIKE was: ", user.posts[feedIndex].comments[commentIndex].liked);
      }

      //FLAG A COMMENT
      else if(req.body.flag)
      {
        console.log("%^%^%^%^%^%User Post comments FLAG was: ", user.posts[feedIndex].comments[commentIndex].flagged);
        user.posts[feedIndex].comments[commentIndex].flagged = user.posts[feedIndex].comments[commentIndex].flagged ? false : true;
        console.log("%^%^%^%^%^%User Post comments FLAG was: ", user.posts[feedIndex].comments[commentIndex].flagged);
      }

    }//end of all comment junk

    else
    {
      //we found the right post, and feedIndex is the right index for it
      // console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);


      //array of likeTime is empty and we have a new (first) LIKE event
      if (req.body.like)
      { 
        
        console.log("!!!!!!User Post LIKE was: ", user.posts[feedIndex].liked);
        user.posts[feedIndex].liked = user.posts[feedIndex].liked ? false : true;
        console.log("!!!!!!User Post LIKE is now: ", user.posts[feedIndex].liked);
      }

      else
      {
        console.log("Got a POST that did not fit anything. Possible Error.")
      }
      

    }//else 

    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in profile_feed went crazy. You should never see this.' });

          return res.redirect('/');
        }
        console.log(err);
        return next(err);
      }
      //req.flash('success', { msg: 'Profile information has been updated.' });
      //res.redirect('/account');
      //console.log("@@@@@@@@@@@ SAVED TO DB!!!!!!!!! ");
      res.send({result:"success"});
    });
  });
}
