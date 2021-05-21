// Issues to be fixed: Survey pops up below the previous posts
//2- welcome message ..
//3- person centric design
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
var timer_flg='0';
// @@@@@@@@@
$(window).on("load", function() {
  // change the message here ... ...
  // Zhila :check if it is the story version
  if($("[pre_id='"+1+"']").attr('study_group') =="stories" || $("[pre_id='"+1+"']").attr('study_group') =="clickThrough")
  {
    document.getElementById("stratButton").childNodes[0].nodeValue="Click to see today's Snaps";
    document.getElementById("stratButton").style.backgroundColor="#2D3436";
    // document.getElementById("stratButton").style.backgroundColor="#EC5B64";
    
  }
  // 

  $('.modal').modal({
    // this parameter will enable/disable the closing for the previous .united modals when the next modal is opened :)
    allowMultiple: false,
  });

  $('.coupled.modal')
  .modal({
    allowMultiple: false
  });

  $('.ui.tiny.post.modal').modal({
    closable: false,
  });


   // $('.slider').glide({
   //    autoplay: false,
   //    arrowsWrapperClass: 'slider-arrows',
   //    arrowRightText: '',
   //    arrowLeftText: ''
   //  });



// $('#smooth').range({
//     min: 0,
//     max: 10,
//     start: 5,
//     smooth: true,
//   });

  const allRanges = document.querySelectorAll(".range-wrap");
  allRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });


  const allRanges0_lonely = document.querySelectorAll(".range-wrap-2");
  allRanges0_lonely.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });


  const allRanges_inferior = document.querySelectorAll(".range-wrap-3");
  allRanges_inferior.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });

  const new_inferior = document.querySelectorAll(".range-wrap-4");
  new_inferior.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });

  function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;

  }
  
  var session_userComments=0;
  // var check_id ='1';


if(localStorage.getItem("total_seconds")){
    var total_seconds = localStorage.getItem("total_seconds");
    console.log('Timer shows : ', total_seconds);

    if (total_seconds==0)
    {
      console.log('Time count down is now over (2 minutes)');
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
  function countDownTimer(){
      if(total_seconds == 0){
          if(localStorage.getItem("survey_flag")==1)
          {
            show_survey();
            
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
  logged = parseInt(localStorage.getItem("logged"));
  function countDownTimerTotal(){
    if(total_logedin_time == 0 && logged == 1){
      // kick the user out of the site because 10 minutes has passed from the user's last activitiy ... 
      console.log('User has been idel for 5 minutes, logging the user out!');
      window.location.href='/logout' 
      var z = 0;
      window.localStorage.setItem("logged",z);
      //window.localStorage.setItem("total_logedin_time",300);
      logged =0;  
    }
    else if(total_logedin_time>0) {
      if(active_flag ==0)
      {
        total_logedin_time = total_logedin_time -1;
        window.localStorage.setItem("total_logedin_time",total_logedin_time);
      }
      else{
        // reset the timer on active flag, each time the user does something ... 
        var z = 15*60;
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
    $(".ui.large.post.modal[modal_id='"+'321'+"']")
      .modal({
        closable  : false,
        onVisible    : function(){
          $(" .ui.tiny.post.modal[modal_id='"+(parseInt(next_id)+1).toString()+"']").modal('hide');
          console.log('hide the previous one?');
          return false;
        },
        onApprove : function() {
          return false;
        }

      })
      .modal('show')
    ;
    flg =0;
    window.localStorage.setItem("survey_flag", flg);
    window.localStorage.setItem("timer_flag",flg);
  }
  

  $('.ui.tiny.gray.progress')
  .progress({
    total: 8 //Zh: change it back to 10 after testing is done ..
  });


  $('.ui.tiny.red.progress')
  .progress({
    total: 3 //Zh: change it back to 10 after testing is done ..
  });


  function move(j) {
    console.log('modal id is: ', j);
    mdltype = $("[progressing_id='"+j+"']")[0].attributes[2].value;
    if(mdltype =='post')
    {
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
       })(8) ; //time duration in seconds to show each post --> change it to 8
    }
     
    else{//if it is a actors photo modal
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
       })(3) ; //time duration in seconds to show each post
    }
       
       

  }

  $('#stratButton.button.fluid.ui.button').on('click', function(){
    var j=1;  //Zh: this should change to the modal id related to the starting modal of the day .. 
    var first_modal=$(".ui.tiny.post.modal[modal_id='"+j+"']");
    first_modal.modal('show');
    // if($("[pre_id='"+1+"']")[0].attributes[3].value == "stories")
    var startTime = 0
    window.localStorage.setItem("startTime", startTime);
    if($("[pre_id='"+1+"']").attr('study_group') =="stories")
      move(1);
  });
  

 // the flag array should be as large as posts numbers .. for now I have it fixed but I need to fix it ...
  var l= $('.ui.tiny.post.modal').length;  
  flag=new Array(l).fill(0)
  //I assume there are at most 100 posts a day.. how many posts are we going to show them? 
  for (let i=1; i<l;i++){
    j=i+1;
    $(" .ui.tiny.post.modal[modal_id='"+j+"']").modal('attach events',".ui.right.button[next_id='"+i+"']");
  } 



  $('.ui.right.button').on('click', function(){ 
      // $(".ui.right.button[next_id='"+'3'+"']").on("click",{
      // },handler);
      var postID = $(this).closest( ".ui.fluid.card" ).attr( "postID" );
      // var current_post = postID;
      // current_posts.push(JSON.parse(current_post));
      // localStorage.setItem('session_seen_posts', JSON.stringify(current_post));

      // var startTime = parseInt($(this).parents('.two.fluid.ui.buttons').children(".myTimer").text()); // this is always zero for modal!!!
      var startTime = localStorage.getItem("startTime")
      var endTime = Date.now();
      var totalViewTime = endTime - startTime; //TOTAL TIME HERE
      window.localStorage.setItem("startTime",endTime);
      //POST HERE
      //console.log(postID);
      //Don't record it if it's longer than 24 hours, do this check because refresh causes all posts to be marked as "viewed" for 49 years.(???)
      // $.post( "/feed", { postID: postID, viewed: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      if(totalViewTime < 86400000){
        console.log('did it happened?')
        $.post( "/feed", { postID: postID, viewed: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      }
      active_flag = 1;
      temp = parseInt(localStorage.getItem("session_posts"))+1;
      window.localStorage.setItem("session_posts",temp);

      // console.log('Posts seen in this session : ', localStorage.getItem("session_posts"));
      console.log('Time Left: ', total_seconds);
      next_id = $(this)[0].attributes[1].value;
      check_id = (parseInt(next_id)+1).toString(); //next modal to be shown .. 
      var move_id = (parseInt(next_id)+1).toString();
      modal_id = $('.ui.tiny.post.modal')[0].attributes[1].value;
      if($("[next_id='"+check_id+"']").length===0)
        {
          if(localStorage.getItem("survey_flag") ==1)
          {
            show_survey();
            alert('This is the last post of this session!');
          }
          else{
            alert('This is the last post of this session!');
            window.location.href='/'; //maybe go to tour site??? or redirect 
          }
          
        }
        else if(flag[next_id]==0)
          {
            flag[next_id]=1;
            // if($("[pre_id='"+1+"']")[0].attributes[3].value=="stories")
            if($("[pre_id='"+1+"']").attr('study_group') =="stories")
              {
                move(move_id);
              }
          }
    
  });



  $('.ui.left.button').on('click', function(){

     active_flag = 1;
    next_id = $(this)[0].attributes[1].value;
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
    var t = 40; //ZHILA: change it back to 270
    var f =1;
    var logged_time = 15*60;
    window.localStorage.setItem("logged",f);
    window.localStorage.setItem("total_seconds", t);
    window.localStorage.setItem("total_logedin_time",logged_time);

    // if($('button.ui.button').text()=="Login")
    if($('button.ui.button').text()=="Login" || $('button.ui.button').text() =="Signup")
    {
      console.log('SET TIMER');
      window.localStorage.setItem("total_seconds", t);
      window.localStorage.setItem("survey_flag", f);
      console.log('At first, the survey flag is: ',window.localStorage.getItem("survey_flag"));
      //  set the session variables ...
      var z =0;
      window.localStorage.setItem("session_likes",z);
      window.localStorage.setItem("session_flags",z);
      window.localStorage.setItem("session_posts",z);
      window.localStorage.setItem("session_userComments",z);
      window.localStorage.setItem("timer_flag", z);
      window.localStorage.setItem("next",z);
      window.localStorage.setItem("passed",z);

    }
    
  });


  //get add new feed post modal to work
  $("#newpost, a.item.newpost").click(function () {
    console.log('Next modal ID is now : ',check_id);
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

    // onSuccess:function(event, fields){
    onSuccess:function(event, fields){
      if($('.ui.feed.form')[0].attributes[5].value != 'feed')
      {
        $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events','#submitNewPost.ui.blue.fluid.button');
      }      
      $(".ui.feed.form")[0].submit();
      event.preventDefault();
      return false;
      // The new idea: instead of submiting, send the data to the database manually..
    }

  });


  // $('#submitNewPost.ui.blue.fluid.button').click(function() {
  $('.ui.feed.form').submit(function(e) {
     active_flag = 1;
      //this.submit();
      e.preventDefault();
      if($('.ui.feed.form')[0].attributes[5].value != 'feed')
      {
        //  We don't need as as we write onApprove return false but in firefox and chrome it doesn't work it only work for Safari
        window.localStorage.setItem("reload",1);
      }  
      if($('.ui.feed.form')[0].attributes[5].value != 'feed')
      {
        $(" .ui.tiny.post.modal[modal_id='"+check_id+"']").modal('attach events','#submitNewPost.ui.blue.fluid.button');
      }       
    });
// zhila:uncomment this one ..
if(parseInt(localStorage.getItem("reload")) == 1)
{
  var j=1;
  $(" .ui.tiny.post.modal[modal_id='"+j+"']").modal('show');
  window.localStorage.setItem("reload",0);
  // move(1);
  // if($("[pre_id='"+1+"']")[0].attributes[3].value=="stories")
  if($("[pre_id='"+1+"']").attr('study_group') =="stories")
  {
    move(1);
    // n = j+1
    // $(" .ui.tiny.post.modal[modal_id='"+n+"']").modal('attach events'," .ui.tiny.post.modal[modal_id='"+j+"']");
    // move(check_id);
  } 
}

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
    // window.location.href='/logout';
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


    // var buttons = card.find(".two.fluid.ui.buttons");
    // buttons.after('<div class="content"><div class="ui comments"></div>');
    // var comments = card.find( ".ui.comments" )
    var buttons = card.find('#falgebutton.ui.basic.button').parents('div.content')
    buttons.after('<div class="content"><div class="ui comments"></div>')
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


// ZH: adding the stuff from the human moderation project!
//////TESTING
$('.ui.fluid.card .img.post')
.visibility({
  once       : false,
  continuous : false,
  observeChanges: true,
  //throttle:100,
  initialCheck : true,

//handling scrolling down like normal
  onBottomVisible:function(calculations){
    var startTime = Date.now();
    $(this).siblings(".content").children(".myTimer").text(startTime);
    if(calculations.topVisible){ //then we are scrolling DOWN normally and this is the START time
      $(this).siblings(".content").children(".myTimer").text(startTime);
    } else { //then we are scrolling UP and this event does not matter!
    }
  },

  onTopPassed:function(calculations){
    var endTime = Date.now();
    var startTime = parseInt($(this).siblings(".content").children(".myTimer").text());
    var totalViewTime = endTime - startTime; //TOTAL TIME HERE
    //POST HERE
    var parent = $(this).parents(".ui.fluid.card");
    var postID = parent.attr( "postID" );

    //console.log(postID);
    //Don't record it if it's longer than 24 hours, do this check because refresh causes all posts to be marked as "viewed" for 49 years.(???)
    if(totalViewTime < 86400000){
      $.post( "/feed", { postID: postID, viewed: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
    }
    //console.log("Total time: " + totalViewTime);
    //console.log($(this).siblings(".content").children(".description").text());
  },
//end handling downward scrolling

//handling scrolling back upwards
  onTopPassedReverse:function(calculations){
    var startTime = Date.now();
    $(this).siblings(".content").children(".myTimer").text(startTime);
  },

  onBottomVisibleReverse:function(calculations){
    if(calculations.bottomPassed){

    } else {
      //eND TIME FOR SCROLLING UP
      var endTime = Date.now();
      var startTime = parseInt($(this).siblings(".content").children(".myTimer").text());
      var totalViewTime = endTime - startTime; //TOTAL TIME HERE
      //POST HERE
      var parent = $(this).parents(".ui.fluid.card");
      var postID = parent.attr( "postID" );
      //console.log("PostID: " + postID);
      //console.log(postID);
      //Don't record it if it's longer than 24 hours, do this check because refresh causes all posts to be marked as "viewed" for 49 years. (???)
      if(totalViewTime < 86400000){
        $.post( "/feed", { postID: postID, viewed: totalViewTime, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      }
      //console.log("Total time: " + totalViewTime);
      //console.log($(this).siblings(".content").children(".description").text());
    }
//end handling scrolling back updwards

  }

});


//@@@@@@@ Gathering the survey results @@@@@@@
//  Modify it to work for both versions.
j='321';
$(".ui.large.post.modal[modal_id='"+j+"']")
.modal({
  selector: { 
    close: '#submitSession.ui.blue.fluid'
  } 
})
;

$(".ui.tiny.post.modal[modal_id='"+check_id+"']")
.modal({
  selector: { 
    close: ".ui.large.post.modal[modal_id='"+j+"']"
  }, 
    onApprove: function () {
    return true;
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

    var emotion_sharing_sadness = $('input:radio[name=emotion-sharing-1]:checked').val();
    var emotion_sharing_pain = $('input:radio[name=emotion-sharing-2]:checked').val();
    var mentalizing = $('input:radio[name=Mentalizing-1]:checked').val();
    var mentalizing_effort = $('input:radio[name=Mentalizing-2]:checked').val();
    var compassionate = $('input:radio[name=compassionate]:checked').val();
    var sympathy = $('input:radio[name=sympathy]:checked').val();
    var effort = $('input:radio[name=Effort]:checked').val();
    var efficacy = $('input:radio[name=Efficacy]:checked').val();
    var closeness = $('input:radio[name=closeness]:checked').val();
    
    var feel_old = $('input:radio[name=feel]:checked').val();
    var lonely_old = $('input:radio[name=lonely]:checked').val();
    var feel_inferior_old = $('input:radio[name=inferior]:checked').val();

    var feel= parseInt($(".bubble")[0].outerText); // it worked--yay
    var lonely = parseInt($(".bubble")[1].outerText);
    var feel_inferior= parseInt($(".bubble")[2].outerText);

    // ZHila -- for the feed version I need to do it differently
    // check if it is feed
    console.log("NUMEBR of seen post in this session is :",localStorage.getItem("session_posts"));

    // can we store all the posts' id that the user observed in this session...
    $.post("/userPost_feed", { time: session_time, modalID: modal_id, session_userComments: localStorage.getItem("session_userComments"), session_posts: localStorage.getItem("session_posts"), session_unique_posts: check_id, session_flags: localStorage.getItem("session_flags"), session_likes: localStorage.getItem("session_likes"), session_survey:[emotion_sharing_sadness,emotion_sharing_pain, mentalizing, mentalizing_effort, compassionate, sympathy,effort, efficacy, closeness, feel, lonely, feel_inferior], _csrf : $('meta[name="csrf-token"]').attr('content')});
    $.post("/feed", { time: session_time, modalID: modal_id, session_userComments: localStorage.getItem("session_userComments"), session_posts: localStorage.getItem("session_posts"), session_unique_posts: check_id, session_flags: localStorage.getItem("session_flags"), session_likes: localStorage.getItem("session_likes"), session_survey:[emotion_sharing_sadness,emotion_sharing_pain, mentalizing, mentalizing_effort, compassionate, sympathy,effort, efficacy, closeness, feel, lonely, feel_inferior], _csrf : $('meta[name="csrf-token"]').attr('content')});
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
        // if(check_id=='1' && $("[pre_id='"+1+"']")[0].attributes[2].value=="stories")
        if(check_id=='1' && $("[pre_id='"+1+"']").attr('study_group') =="stories")
        {
          move(1);
        }
      }

    }
    else //if this is the feed version.. just close the modal...
    {
      console.log('Not sure what to do here yet!'); // in this case we only need to close the modal after submit
      j='321';
      $(".ui.large.post.modal[modal_id='"+j+"']")
      .modal({
        selector: { 
          close: '#submitSession.ui.blue.fluid'
        } 
      })
    ;
      
    } 
  });

});


