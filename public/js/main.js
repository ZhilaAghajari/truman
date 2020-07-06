// Issues to be fixed: 
// User's comments and likes are not shown on page reload... and after the user log in for next time ... 
// Number of post seen in the session is not accurate because if a post is seen and the user get back and forth to see the posts I count them each time. Need to be fixed... 

$('#content').hide();
$('#loading').show();
var modal_id;
var next_id ='1';
var check_id;
var move_id;
var next_post;
var $window = $(window);
var iteration;
var active_flag;
var logged = 0;
// @@@@@@@@@
$(window).on("load", function() {
  $('.modal').modal({
    // this parameter will enable/disable the closing for the previous .united modals when the next will be opened :)
    allowMultiple: false,
  });

  $('.coupled.modal')
  .modal({
    allowMultiple: false
  });

  $('.ui.tiny.post.modal').modal({
    closable: false,
  });
  
  var session_userComments=0;
  var check_id ='1';


if(localStorage.getItem("total_seconds")){
    var total_seconds = localStorage.getItem("total_seconds");
    console.log('time is: ', total_seconds);

    if (total_seconds==0)
    {
      console.log('timer is over');
    }
}
 else {
  console.log('Does it get here at all?');
  // window.localStorage.setItem("total_seconds", t);
    
}


if(localStorage.getItem("total_logedin_time")){
  var total_logedin_time = localStorage.getItem("total_logedin_time");
}


if(typeof total_seconds != 'undefined')
{
  console.log('something something');
  // if there were new posts, first show
  function countDownTimer(){
      if(total_seconds == 0){
          // if(survey_flag ==1 && (parseInt(next_id)+1)>=3 )
          // ZHILA: NEXT TASK ...survey falg should also be stored in local storage ...
          if(localStorage.getItem("survey_flag") ==1)
          {
            // if((parseInt(next_id)+1)>=3 )
            if(localStorage.getItem("session_posts")>=3) //in this case if they refresh it won't reset the counter. which one is a better desig?
            {
              console.log('nextid is : ', next_id);
              console.log('pas of next id: ', (parseInt(next_id)+1));
              show_survey();
            }         
            else
            {
              if($('.ui.blue.fluid.button')[0].attributes[2].value==="stories"){
                console.log('retry:',next_id); //try every second and each time it checks if the user sees more than 3 posts, then pop up the session survey ...
                setTimeout(countDownTimer,1000);
              }
              else{
                show_survey();
              }
              
            }
          }
      } else if(total_seconds>0) {
          total_seconds = total_seconds -1 ;
          localStorage.setItem("total_seconds",total_seconds);
          setTimeout(countDownTimer,1000);
      }

  }
  setTimeout(countDownTimer,1000);
}


// Check whether user has been idle for more than 5 minutes 
if(typeof total_logedin_time != 'undefined')
{
  // console.log('Total time counter');
  total_logedin_time = parseInt(localStorage.getItem("total_logedin_time"));
  function countDownTimerTotal(){
    if(total_logedin_time == 0 && logged == 1){
      // kick the user out of the site because 10 minutes has passed from the user's last activitiy ... 
      console.log('Did it get here after 4 minutes???');
      window.location.href='/info'; //How to log the user out here? 
      alert('You have been inactive for 4 minutes now!!');    
    }
    else if(total_logedin_time>0) {
      if(active_flag ==0)
      {
        total_logedin_time = total_logedin_time -1;
        window.localStorage.setItem("total_logedin_time",total_logedin_time);
      }
      else{
        // reset the timer on active flag, each time the user does something ... 
        var z = 5*60;
        window.localStorage.setItem("total_logedin_time",z);
        total_logedin_time = window.localStorage.getItem("total_logedin_time");
        active_flag = 0;
      }
      
      setTimeout(countDownTimerTotal,1000);
    }
  }
  setTimeout(countDownTimerTotal,1000);
}


  $('#sessionSurvey.ui.blue.right.fluid.button').on('click', function(){
    show_survey();
  });

  function show_survey(){
    // create a delay if necessary ... 
    console.log('Iteration in move is: ',iteration);

    // maybe fist hide the previous modal?
    $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('hide');
    var j='321';
    $(".ui.small.post.modal[modal_id='"+j+"']").modal('show');
    survey_flag =0;
    window.localStorage.setItem("survey_flag", 0);
    console.log('RESET the session survey flag :', survey_flag);
  }
  

  $('.ui.tiny.gray.progress')
  .progress({
    total: 10 //Zh: change it back to 10 after testing is done ..
  });

  function move(j) {
    console.log('modal id is: ', j);
     progressing_id = $("[progressing_id='"+j+"']");
      (function loop(itr) {
        setTimeout(function () { 
          // console.log(itr);
          iteration =itr; 
          $(progressing_id)
            .progress('increment')
          ;
          if (--itr) loop(itr); // iteration counter
          else {
            var element_pre = $("[pre_id='"+j+"']");
            var element_next = $("[next_id='"+j+"']");
            
            element_pre[0].classList.remove("disabled");
            element_next[0].classList.remove("disabled");     
          }
          },1000) //
       })(10) ; //time duration in seconds to show each post

  }

  $('#stratButton.button.fluid.ui.button').on('click', function(){
    var j=1;  //Zh: this should change to the modal id related to the starting modal of the day .. 
    var first_modal=$(".ui.tiny.post.modal[modal_id='"+j+"']");
    first_modal.modal('show');
    move(1);
  });
  

 // the flag array should be as large as posts numbers .. for now I have it fixed but I need to fix it ...  
  flag=new Array(100).fill(0)
  //I assume there are at most 100 posts a day.. how many posts are we going to show them? 
  for (let i=1; i<100;i++){
    j=i+1;
    $(" .ui.tiny.post.modal[modal_id='"+j+"']").modal('attach events',".ui.right.button[next_id='"+i+"']");
  } 

  $('.ui.right.button').on('click', function(){    
      active_flag = 1;
      temp = parseInt(localStorage.getItem("session_posts"))+1;
      window.localStorage.setItem("session_posts",temp);

      // reset session timer ... 
      console.log('Posts seen in this session : ', localStorage.getItem("session_posts"));
      console.log('Time Left: ', total_seconds);
      next_id = $(this)[0].attributes[1].value;
      check_id = (parseInt(next_id)+1).toString(); //next modal to be shown .. 
      var move_id = (parseInt(next_id)+1).toString();
      modal_id = $('.ui.tiny.post.modal')[0].attributes[1].value;

      if($("[next_id='"+check_id+"']").length==0)
      {
        console.log('next id is: ', next_id)
        var s ='321';
        show_survey();
        console.log('LAST POST of today');
      }
      else if(flag[next_id]==0)
        {
          flag[next_id]=1;
          move(move_id);
        }
    
  });



  $('.ui.left.button').on('click', function(){

     active_flag = 1;
    var next_id = $(this)[0].attributes[1].value;
    check_id = next_id;
    var move_id = (parseInt(next_id)-1).toString();
    if(move_id>=1)
    {
      $(" .ui.tiny.post.modal[modal_id='"+move_id+"']").modal('attach events',$(this)[0]);
    }
    var curr_id= $(this)[0].id;
    console.log('Next ID');
    console.log(curr_id);

  }); 
  

 //@@@@@@@@@@@@@@@@@@@@@
  //close loading dimmer on load
  $('#loading').hide();
  $('#content').attr('style', 'block');
  $('#content').fadeIn('slow');
  //close messages from flash message 
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });

  //check bell
  if (!(top.location.pathname === '/login' || top.location.pathname === '/signup'))
  {
      
    $.getJSON( "/bell", function( json ) {
      
      if (json.result)
      {
        $("i.big.alarm.icon").replaceWith( '<i class="big icons"><i class="red alarm icon"></i><i class="corner yellow lightning icon"></i></i>' );
      }

   });
  }

  //make checkbox work
  $('.ui.checkbox')
  .checkbox();


  $(' .ui.tiny.post.modal').modal({
      observeChanges  : true
    })
  ;

  // ZH: Set local variables after loging. ( do I need to set session id here as well?)
  $('button.ui.button').on('click', function(){
    active_flag = 1;
    var t = 2*60; //ZHILA: change it back to 120
    var f =1;
    var logged_time = 5*60;
    logged = 1;
    window.localStorage.setItem("total_seconds", t);
    window.localStorage.setItem("total_logedin_time",logged_time);
    if($('button.ui.button').text()=="Login")
    {
      console.log('SET TIMER');
      window.localStorage.setItem("total_seconds", t);
      window.localStorage.setItem("survey_flag", f);
      console.log('the survey flag is: ',window.localStorage.getItem("survey_flag"));
      //  set the session variables ...
      var z =0;
      window.localStorage.setItem("session_likes",z);
      window.localStorage.setItem("session_flags",z);
      window.localStorage.setItem("session_posts",z);
      window.localStorage.setItem("session_userComments",z);
    }
    
  });

  //get add new feed post modal to work
  $("#newpost, a.item.newpost").click(function () {
    console.log('Check ID is now : ',check_id);
    $(' #newpost.ui.tiny.post.modal').modal('show');
     active_flag = 1;
     
});

  //new post validator (picture and text can not be empty)
  $('.ui.feed.form')
  .form({
    on: 'blur',
    fields: {
      body: {
        identifier  : 'body',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please add some text about your meal'
          }
        ]
      },
      picinput: {
        identifier  : 'picinput',
        rules: [
          {
            type: 'notExactly[/public/photo-camera.svg]',
            prompt : 'Please click on Camera Icon to add a photo'
          }
        ]
      }
    },

    onSuccess:function(event, fields){
      console.log("Event is :");
      // event.preventDefault();
      //console.log(event);
      console.log("fields is :");
      //console.log(fields);
      $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events','#submitNewPost.ui.blue.fluid.button');
      $(".ui.feed.form")[0].submit();
    }

  });


//Add a validator for login submit, and save the timer in the local storage

// $('#submitnewpost.ui.blue.fluid.button').click(function(){
//   $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events','#submitnewpost.ui.blue.fluid.button');
//   $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('show');
// });

  // $('#submitNewPost.ui.blue.fluid.button').click(function() {
  $('.ui.feed.form').submit(function(e) {
     active_flag = 1;
      // alert('Submited the post?');
      e.preventDefault();
      // e.stopPropagation();
      this.submit(); //if I don't submit ... will it get through and do I only need to take care of fron end .. ?
      console.log("Submit the junks!!!!")
      // attach the previously shown modal to this submit button...
      console.log('Check ID: ', check_id);
      console.log('Next ID: ', next_id);

      // $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events','#submitNewPost.ui.blue.fluid.button');


      //Zhila: This idea works on Safari but not on Firefox and Chrome! it is weird but I'll try it after other issues are solved .. 
      // $(" .ui.tiny.post.modal[modal_id='"+check_id+"']")
      //     .modal({
      //       onApprove : function(){
      //         return false;
      //       },
      //       onDeny : function(){
      //         return false
      //       }
      //     })
      //     .modal('show');
   
      console.log('Check ID: ', check_id);
      //  We don't need as as we write onApprove return false but in firefox and chrome it doesn't work it only work for Safari
      window.localStorage.setItem("reload",1);
      console.log('Reload flag: ',localStorage.getItem("reload"));
      return false
    });
// zhila:uncomment this one ..

if(parseInt(localStorage.getItem("reload")) == 1)
{
  var j=1;
  $(" .ui.tiny.post.modal[modal_id='"+j+"']").modal('show');
  // $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('show');
  window.localStorage.setItem("reload",0);
  move(check_id);
}

// on Login button set this timer to 2:00 minutes and store in in local storage ..
//Picture Preview on Image Selection
function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            //console.log("Now changing a photo");
            reader.onload = function (e) {
                $('#imgInp').attr('src', e.target.result);
                //console.log("FILE is "+ e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
$("#picinput").change(function(){
    //console.log("@@@@@ changing a photo");
    readURL(this);
});

//Modal to show "other users" in Notifications 
/*
$('a.others').click(function(){
  let key = $(this).attr('key');


  $('.ui.long.extrausers.modal#'+key).modal({
    onVisible: function() {
      var el = document.querySelector('.ui.long.extrausers.modal#'+key+" div.ui.extra.divided.items");
      var lazyLoad = new LazyLoad({
         container: el /// <--- not sure if this works here, read below
    });
      
      
      
    }
  }).modal('show')  
}); */

//add humanized time to all posts
$('.right.floated.time.meta, .date').each(function() {
    var ms = parseInt($(this).text(), 10);
    let time = new Date(ms);
    $(this).text(humanized_time_span(time)); 
});

  //Sign Up Button
  $('.ui.big.green.labeled.icon.button.signup')
  .on('click', function() {
    window.location.href='/signup';
  });

  //Sign Up Info Skip Button
  $('button.ui.button.skip')
  .on('click', function() {
    window.location.href='/com';
  });

  //Community Rules Button (rocket!!!)
  $('.ui.big.green.labeled.icon.button.com')
  .on('click', function() {
    window.location.href='/info'; //maybe go to tour site???
  });

  //Community Rules Button (rocket!!!)
  $('.ui.big.green.labeled.icon.button.info')
  .on('click', function() {
    window.location.href='/'; //maybe go to tour site???
  });

  //Profile explaination Page
  $('.ui.big.green.labeled.icon.button.profile')
  .on('click', function() {
    window.location.href='/profile_info'; //maybe go to tour site???
  });

  //More info Skip Button
  $('button.ui.button.skip')
  .on('click', function() {
    window.location.href='/com'; //maybe go to tour site???
  });

  //Edit button
  $('.ui.editprofile.button')
  .on('click', function() {
    window.location.href='/account';
  });


////////////////////
$("input.newcomment").keyup(function(event) {
    //i.big.send.link.icon
    //$(this).siblings( "i.big.send.link.icon")
    if (event.keyCode === 13) {
        $(this).siblings( "i.big.send.link.icon").click();
    }
});

//create a new Comment
$("i.big.send.link.icon").click(function() {
   active_flag = 1;
  var text = $(this).siblings( "input.newcomment").val();
  var card = $(this).parents( ".ui.fluid.card" );
  var comments = card.find( ".ui.comments" )
  //no comments area - add it
  console.log("Comments is now "+comments.length);
  temp = parseInt(localStorage.getItem("session_userComments"))+1;
  window.localStorage.setItem("session_userComments",temp);
  console.log('user comments number in this session: ',localStorage.getItem("session_userComments"));
  if( !comments.length )
  {
    //.three.ui.bottom.attached.icon.buttons
    console.log("Adding new Comments sections")
    // var buttons = card.find( ".two.ui.bottom.attached.icon.buttons" )
    // buttons.after( '<div class="content"><div class="ui comments"></div>' );
    // var buttons = card.find( "#likeButton.ui.basic.button" )
   
    // var buttons = card.find("#flgComment.span.right.floated");
    // // var buttons = card.find("#comment.ui.fluid.left.labeled.right.icon.input")
    // buttons.after( '<div class="content"><div class="ui comments"></div>' );


    var buttons = card.find(".two.fluid.ui.buttons");
    buttons.before('<div class="content"><div class="ui comments"></div>');
    var comments = card.find( ".ui.comments" )
  }
  if (text.trim() !== '')
  {
    console.log(text);
    var date = Date.now();
    var ava = $(this).siblings('.ui.label').find('img.ui.avatar.image');
    var ava_img = ava.attr( "src" );
    var ava_name = ava.attr( "name" );
    var postID = card.attr( "postID" );

    var mess = '<div class="comment"> <a class="avatar"> <img src="'+ava_img+'"> </a> <div class="content"> <a class="author">'+ava_name+'</a> <div class="metadata"> <span class="date">'+humanized_time_span(date)+'</span> <i class="heart icon"></i> 0 Likes </div> <div class="text">'+text+'</div> <div class="actions"> <a class="like">Like</a> <a class="flag">Flag</a> </div> </div> </div>';   
    $(this).siblings( "input.newcomment").val('');
    comments.append(mess);
    console.log("######### NEW COMMENTS:  PostID: "+postID+", new_comment time is "+date+" and text is "+text);
   
    if (card.attr( "type" )=='userPost')
      $.post( "/userPost_feed", { postID: postID, new_comment: date, comment_text: text, _csrf : $('meta[name="csrf-token"]').attr('content') } );
    else
      $.post( "/feed", { postID: postID, new_comment: date, comment_text: text, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  }
});

  //this is the REPORT User button
  $('button.ui.button.report')
  .on('click', function() {

    var username = $(this).attr( "username" );

    $('.ui.small.report.modal').modal('show');

    $('.coupled.modal')
      .modal({
        allowMultiple: false
      })
    ;
    // attach events to buttons
    $('.second.modal')
      .modal('attach events', '.report.modal .button')
    ;
    // show first now
    $('.ui.small.report.modal')
      .modal('show')
    ;

  });

  //Report User Form//
  $('form#reportform').submit(function(e){

    e.preventDefault();
    $.post($(this).attr('action'), $(this).serialize(), function(res){
        // Do something with the response `res`
        console.log(res);
        // Don't forget to hide the loading indicator!
    });
    //return false; // prevent default action

});

  $('.ui.home.inverted.button')
    .on('click', function() {
      window.location.href='/';
    });

  //this is the Block User button
  $('button.ui.button.block')
  .on('click', function() {

    var username = $(this).attr( "username" );
    //Modal for Blocked Users
    $('.ui.small.basic.blocked.modal')
      .modal({
        closable  : false,
        onDeny    : function(){ 
          //report user
          
        },
        onApprove : function() {
          //unblock user
          $.post( "/user", { unblocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }
      })
      .modal('show')
    ;

    
    console.log("*********** Block USER "+username);
    $.post( "/user", { blocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  });

  //Block Modal for User that is already Blocked
  $('.ui.on.small.basic.blocked.modal')
  .modal({
    closable  : false,
    onDeny    : function(){ 
      //report user
      
    },
    onApprove : function() {
      //unblock user
      var username = $('button.ui.button.block').attr( "username" );
      $.post( "/user", { unblocked: username, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }
  })
  .modal('show')
;

  //this is the LIKE button
  // $('.like.button')
  $('#likeButton.ui.basic.button')
  .on('click', function() {
     active_flag = 1;

    //if already liked, unlike if pressed
    if ( $( this ).hasClass( "red" ) ) {
        console.log("***********UNLIKE: post");
        $( this ).removeClass("red");
        var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        temp = parseInt(localStorage.getItem("session_likes"))-1;
        window.localStorage.setItem("session_likes",temp);
        console.log('session likes : ', localStorage.getItem("session_likes"));
        label.html(function(i, val) { return val*1-1 });
    }
    //since not red, this button press is a LIKE action
    else{
      $(this).addClass("red");
      var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
      label.html(function(i, val) { return val*1+1 });
      var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
      var like = Date.now();
      console.log("***********LIKE: post "+postID+" at time "+like);
      temp = parseInt(localStorage.getItem("session_likes"))+1;
      window.localStorage.setItem("session_likes",temp);
      console.log('session likes : ', localStorage.getItem("session_likes"));

      if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost')
        $.post( "/userPost_feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      else
        $.post( "/feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }

  });

  //a.like.comment
  $('a.like.comment')
  .on('click', function() {
    active_flag = 1;
    //if already liked, unlike if pressed
    if ( $( this ).hasClass( "red" ) ) {
        console.log("***********UNLIKE: post");
        //Un read Like Button
        $( this ).removeClass("red");

        var comment = $(this).parents( ".comment" );
        comment.find( "i.heart.icon" ).removeClass("red");

        var label = comment.find( "span.num" );
        label.html(function(i, val) { return val*1-1 });
    }
    //since not red, this button press is a LIKE action
    else{
      $(this).addClass("red");
      var comment = $(this).parents( ".comment" );
      comment.find( "i.heart.icon" ).addClass("red");

      var label = comment.find( "span.num" );
      label.html(function(i, val) { return val*1+1 });

      var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
      var commentID = comment.attr("commentID");
      var like = Date.now();
      console.log("#########COMMENT LIKE:  PostID: "+postID+", Comment ID: "+commentID+" at time "+like);

      if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost')
        $.post( "/userPost_feed", { postID: postID, commentID: commentID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      else
        $.post( "/feed", { postID: postID, commentID: commentID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }

  });

 

   //this is the FLAG button
  $('a.flag.comment')
  .on('click', function() {
    active_flag = 1;
    var comment = $(this).parents( ".comment" );
    var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
    var typeID = $(this).closest( ".ui.fluid.card" ).attr( "type" );
    var commentID = comment.attr("commentID");
    comment.replaceWith( '<div class="comment" style="background-color:black;color:white"><h5 class="ui inverted header"><span>The admins will review this post further. We are sorry you had this experience.</span></h5></div>' );
    var flag = Date.now();
    console.log("#########COMMENT FLAG:  PostID: "+postID+", Comment ID: "+commentID+"  TYPE is "+typeID+" at time "+flag);

    if (typeID=='userPost')
      $.post( "/userPost_feed", { postID: postID, commentID: commentID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );
    else
      $.post( "/feed", { postID: postID, commentID: commentID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  });
  //ZH:current//
  //this is the POST FLAG button
  // $('.flag.button')
  $('#falgebutton.ui.basic.button')
  .on('click', function() {
     active_flag = 1;
    temp = parseInt(localStorage.getItem("session_flags"))+1;
    window.localStorage.setItem("session_flags",temp);
    console.log('session flag number: ', localStorage.getItem("session_flags"));
     var post = $(this).closest( ".ui.fluid.card.dim"); // ok I guess instead of doing on the whole card, do it on
     var postID = post.attr( "postID" );
     var flag = Date.now();
     console.log("***********FLAG: post "+postID+" at time "+flag);
     $.post( "/feed", { postID: postID, flag: flag, _csrf : $('meta[name="csrf-token"]').attr('content') } );
     console.log("Removing Post content now!");
     post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
      //repeat to ensure its closable             
      post.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');

    var img_flagged = $(this).closest( ".imgage.dim");
    img_flagged.find(".ui.dimmer.flag").dimmer({
                   closable: false
                  })
                  .dimmer('show');
    //repeat to ensure its closable             
    img_flagged.find(".ui.dimmer.flag").dimmer({
                 closable: false
                })
                .dimmer('show');
    

  });

  //User wants to REREAD
  $('.ui.button.reread')
  .on('click', function() {
    //.ui.active.dimmer
    $(this).closest( ".ui.dimmer" ).removeClass( "active" );
    $(this).closest( ".ui.fluid.card.dim" ).find(".ui.inverted.read.dimmer").dimmer('hide');
     var postID = $(this).closest( ".ui.fluid.card.dim" ).attr( "postID" );
     var reread = Date.now();
     console.log("##########REREAD######SEND TO DB######: post "+postID+" at time "+reread);
     $.post( "/feed", { postID: postID, start: reread, _csrf : $('meta[name="csrf-token"]').attr('content') } );
     //maybe send this later, when we have a re-read event to time???
     //$.post( "/feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );

  });

//@@@@@@@ Gathering the survey results @@@@@@@
//  Modify it to work for both versions.
j='321';
$(".ui.small.post.modal[modal_id='"+j+"']")
.modal({
  selector: { 
    close: '#submitSession.ui.blue.fluid'
  } 
})
;

$(".ui.tiny.post.modal[modal_id='"+check_id+"']")
.modal({
  selector: { 
    close: ".ui.small.post.modal[modal_id='"+j+"']"
  } 
})
;

$("#newpost.ui.tiny.post.modal")
.modal({
  selector: { 
    close: 'input.ui.blue.button'
  } 
})
;

  $('#submitSession.ui.blue.fluid.button').on('click', function(){
    var post = $(this).closest( ".ui.fluid.card.dim");
    var session_time = Date.now();
    var softhearted = $('input:radio[name=Softhearted]:checked').val();
    var touched = $('input:radio[name=Touched]:checked').val();
    var sympathetic = $('input:radio[name=Sympathetic]:checked').val();
    var moved = $('input:radio[name=Moved]:checked').val();
    $.post("/userPost_feed", { time: session_time, modalID: modal_id, session_userComments: localStorage.getItem("session_userComments"), session_posts: localStorage.getItem("session_posts"), session_unique_posts: check_id, session_flags: localStorage.getItem("session_flags"), session_likes: localStorage.getItem("session_likes"), session_survey:[ softhearted, touched, sympathetic, moved], _csrf : $('meta[name="csrf-token"]').attr('content')});
    $.post("/feed", { time: session_time, modalID: modal_id, session_userComments: localStorage.getItem("session_userComments"), session_posts: localStorage.getItem("session_posts"), session_unique_posts: check_id, session_flags: localStorage.getItem("session_flags"), session_likes: localStorage.getItem("session_likes"), session_survey:[ softhearted, touched, sympathetic, moved], _csrf : $('meta[name="csrf-token"]').attr('content')});
    // reset the session variables .. 
    console.log('session likes stored : ', localStorage.getItem("session_likes"));
    window.localStorage.setItem("session_likes",0);
    window.localStorage.setItem("session_flags",0);
    window.localStorage.setItem("session_posts",0);
    window.localStorage.setItem("session_userComments",0);
    console.log('reset likes of this session: ', localStorage.getItem("session_likes"));

    // if the experimental group is stories-based, do the following, otherwise, just close the modal...
    if($('.ui.blue.fluid.button')[0].attributes[2].value==="stories")
    // 1- if the user reached the end of the posts for today, direct them to a link or to the login page 
    {
      console.log('Check_id: ', check_id);
      // no more posts to show .. 
      if($("[next_id='"+check_id+"']").length===0)
      {
        alert('This is the last post of this session!');
        window.location.href='/'; //maybe go to tour site??? or redirect 
      }
      //2- if it is activated after some amount of time !
      else 
      {
        $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events','#submitSession.ui.blue.fluid.button');
        // $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events',$(".ui.small.post.modal[modal_id='"+j+"']"));
        $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('show');
        if(check_id=='1')
        {
          move(1);
        }
      }

    }
    else //if this is the feed version.. just close the modal...
    {
      console.log('Not sure what to do here yet!'); // in this case we only need to close the modal after submit
      j='321';
      $(".ui.small.post.modal[modal_id='"+j+"']")
      .modal({
        selector: { 
          close: '#submitSession.ui.blue.fluid'
        } 
      })
    ;
      
    } 
  });

});


