//$(document).ready(function() {

//Before Page load:
$('#content').hide();
$('#loading').show();


// $('.event-modal').modal({
//     allowMultiple: true
//   });

// capture when the user closes the windows ..
$(window).on('mouseover', (function () {
    window.onbeforeunload = null;
}));
$(window).on('mouseout', (function () {
    window.onbeforeunload = ConfirmLeave;
}));
function ConfirmLeave() {
    alert('One question survey');
    return "Please fill in this one question before you leave";
}
var prevKey="";
$(document).keydown(function (e) {            
    if (e.key=="F5") {
        window.onbeforeunload = ConfirmLeave;
    }
    else if (e.key.toUpperCase() == "W" && prevKey == "CONTROL") {                
        window.onbeforeunload = ConfirmLeave;   
    }
    else if (e.key.toUpperCase() == "R" && prevKey == "CONTROL") {
        window.onbeforeunload = ConfirmLeave;
    }
    else if (e.key.toUpperCase() == "F4" && (prevKey == "ALT" || prevKey == "CONTROL")) {
        window.onbeforeunload = ConfirmLeave;
    }
    prevKey = e.key.toUpperCase();
});
//@@@@ pop up question when closing a window ... second solution ...
// window.addEventListener('beforeunload', (event) => {
//   // Cancel the event as stated by the standard.
//   event.preventDefault();
//   // Chrome requires returnValue to be set.
//   event.returnValue = 'Please fill in this one question before you leave';
// });

// $(window).bind("beforeunload",function(event) {
//     return "You have some unsaved changes";
// });



// @@@@@@@@@
$(window).on("load", function() {
  $('.modal').modal({
    // this parameter will enable/disable the closing for the previous .united modals when the next will be opened :)
    allowMultiple: false,
  });

  $('.ui.tiny.post.modal').modal({
    closable: false,
  });
  //@@@@@@@@@@@ No time restrictions: users need to click to see the next post @@@@@@@@@@
  // // why doesn't this allow me to write or like or anything? 
  // $('#modal1').modal('show')
  // $('.angle.double.left.icon').on('click', function(){
  //   $('#modal2').modal('attach events', '#modal1');
  //   $('#modal3').modal('attach events', '#modal2');
  //   $('#modal1').modal('attach events', '#modal3');
  // });
  // $('.angle.double.right.icon').on('click', function(){
  //   $('#modal3').modal('attach events', '#modal1');
  //   $('#modal1').modal('attach events', '#modal2');
  //   $('#modal2').modal('attach events', '#modal3');     
  // });
  // time-based transitions WORKS
  $('.ui.tiny.gray.progress')
  .progress({
    total: 10
  });

  function move(j) {
     progressing_id = $("[progressing_id='"+j+"']");
     //j=i;
      (function loop(i) {
        setTimeout(function () { 
          console.log(i);  
          $(progressing_id)
            .progress('increment')
          ;
          if (--i) loop(i); // iteration counter
          else {
            // nextt_id = 'next'+(j)
            // prev_id = 'pre'+(j)
            // console.log(nextt_id);
            var element_pre = $("[pre_id='"+j+"']");
            var element_next = $("[next_id='"+j+"']");
            // var element_pre = document.getElementById(pre_id);
            element_pre[0].classList.remove("disabled");
            // var element_next = document.getElementById(next_id);
            element_next[0].classList.remove("disabled");
          }
          },1000) //
       })(10) ;
  }
  
  $('#stratButton.button.fluid.ui.button').on('click', function(){
    var j=1;
    var first_modal=$(" .ui.tiny.post.modal[modal_id='"+j+"']");
    first_modal.modal('show');
    move(1);
  });
  
  $('#survey.button.fluid.ui.button').on('click',function(){
    var j ='321'
    var survey_modal=$(" .ui.tiny.post.modal[modal_id='"+j+"']");
    survey_modal.modal('show')
    alert('clicked')
  });
 // flag should be as large as posts numbers .. 
  flag=new Array(100).fill(0)
  //fix this 20 number.. how many posts are we going to show them? 
  for (let i=0; i<20;i++){
    j=i+1;
    // $(" .ui.tiny.post.modal[modal_id='"+j+"']").modal('attach events',$(this)[0]);
    $(" .ui.tiny.post.modal[modal_id='"+j+"']").modal('attach events',".ui.right.button[next_id='"+i+"']");
  } 
  $('.ui.right.button').on('click', function(){    
    // NEXT OF LAST post should show an alert that these are the posts for today...
    var next_id = $(this)[0].attributes[1].value;
    var move_id = (parseInt(next_id)+1).toString();
    if(flag[next_id]==0)
    {
      flag[next_id]=1;
      move(move_id);
    }

  });

  $('.ui.left.button').on('click', function(){

    var next_id = $(this)[0].attributes[1].value;
    var move_id = (parseInt(next_id)-1).toString();
    if(move_id>=1)
    {
      $(" .ui.tiny.post.modal[modal_id='"+move_id+"']").modal('attach events',$(this)[0]);
    }
    var curr_id= $(this)[0].id;
    console.log('current next id is');
    console.log(curr_id);

  }); 
  // lierally time-based (show each post for 5 seconds and jumps to next post...
  // (function loop(i) {
  // console.log('itr'+i);          
  //    setTimeout(function () {   
  //       modal_id = '#modal'+ (i);
  //       $(modal_id).modal({
  //         transition:'fade right'
  //       }).modal('show');
  //       //alert('POST'+i); // your code
  //       if (--i) loop(i); // iteration counter
  //       else loop(3);
  //    }, 5000) // delay : but this delay is activated without caring about whether ot not the user plans to react to a story! 
  //    //but this time should be reset if the user touch somethign, right?
  // })(3); // iterations count


  //@@@@@@@ Gathering the survey results @@@@@@@

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

  //get add new feed post modal to work
  $("#newpost, a.item.newpost").click(function () {
    $(' .ui.tiny.post.modal').modal('show'); 
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
      //console.log(event);
      console.log("fields is :");
      //console.log(fields);
      $(".ui.feed.form")[0].submit();
    }

  });

  $('.ui.feed.form').submit(function(e) {
        e.preventDefault();
        console.log("Submit the junks!!!!")
        //$('.ui.tiny.nudge.modal').modal('show'); 
        //return true;
        });


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
  var text = $(this).siblings( "input.newcomment").val();
  var card = $(this).parents( ".ui.fluid.card" );
  var comments = card.find( ".ui.comments" )
  //no comments area - add it
  console.log("Comments is now "+comments.length)
  if( !comments.length )
  {
    //.three.ui.bottom.attached.icon.buttons
    console.log("Adding new Comments sections")
    var buttons = card.find( ".three.ui.bottom.attached.icon.buttons" )
    buttons.after( '<div class="content"><div class="ui comments"></div>' );
    var comments = card.find( ".ui.comments" )
  }
  if (text.trim() !== '')
  {
    console.log(text)
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
  ///////////////////


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

    
    console.log("***********Block USER "+username);
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
  $('.like.button')
  .on('click', function() {

    //if already liked, unlike if pressed
    if ( $( this ).hasClass( "red" ) ) {
        console.log("***********UNLIKE: post");
        $( this ).removeClass("red");
        var label = $(this).next("a.ui.basic.red.left.pointing.label.count");
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

      if ($(this).closest( ".ui.fluid.card" ).attr( "type" )=='userPost')
        $.post( "/userPost_feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );
      else
        $.post( "/feed", { postID: postID, like: like, _csrf : $('meta[name="csrf-token"]').attr('content') } );

    }

  });

  //a.like.comment
  $('a.like.comment')
  .on('click', function() {

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

  //this is the POST FLAG button
  $('.flag.button')
  .on('click', function() {

     var post = $(this).closest( ".ui.fluid.card.dim");
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


//////TESTING
/*setTimeout(function() {
  //.ui.fluid.card.test
    $('.ui.fluid.card.test .content.read')
      .transition({
        animation: 'fade down',
        duration   : '1.5s',
      });
      }.bind(this), 1500);

  //Dimm cards as user scrolls - send Post to update DB on timing of events .image
  //$('.ui.fluid.card.dim') img.post $('.ui.fluid.card.dim .image'
  /*
  $('img.post.s3, .content.pro.s3')
  .visibility({
    once       : false,
    continuous : false,
    observeChanges: true,
    //throttle:100,
    offset: 250,
    
    //USER HAS NOW READ THE POST (READ EVENT) 
    //onBottomVisibleReverse:function(calculations) { onBottomPassed
      onBottomPassed:function(calculations) {
        console.log(":::::Now passing onBottomPassed:::::");
        var parent = $(this).parents(".ui.fluid.card.dim, .profile_card");

        //As Post is not READ and We have a transparency condistion - Show Read Conent and send Post READ event
        if ((!(parent.attr( "state" )=='read')) && (parent.attr( "transparency" )=='yes'))
        {
          console.log("::::UI passing::::Adding Seen Box Now::::::::");

          var postID = parent.attr( "postID" );
          var read = Date.now();

          //actual show the element
          
           parent.find('.read')
            .transition({
              animation: 'fade',
              duration   : '1.5s',
            });
          //$('img.post').visibility('refresh')  $('img.post, .content.pro').visibility('refresh')
          //<div style="text-align:center;background:#b5bfce" class="content read"> <p>You've read this!</p><a href="/user/"><img src="/profile_pictures/" class="ui avatar image"><span>cat</span></a> has been notified.</div>
          //parent.append( '<div style="text-align:center;background:#b5bfce" class="content read"> <p>You have read this!</p><a href="/user/'+parent.attr( "actor_un" )+'"><img src="/profile_pictures/'+parent.attr( "actor_pic" )+'" class="ui avatar image"><span>'+parent.attr( "actor_name" )+'</span></a> has been notified.</div>' );
          parent.attr( "state", "read" );
          console.log("::::UI passing::::SENDING POST TO DB::::::::");
          $.post( "/feed", { postID: postID, read: read, _csrf : $('meta[name="csrf-token"]').attr('content') } );

        }

        //if we are not in UI condistion, and we are reading, then send off Post to DB for new Read Time
        //Maybe kill this so we don't fill the DB with all this stuff. Seems kind of silly (or only do like 10, etc)
        //else if ((parent.attr( "ui" )=='no') && (parent.attr( "state" )=='unread'))

        //Need to get all "read" and "start" times in non-UI case (as all other times rests on it)
        else if ((parent.attr( "transparency" )=='no'))
        {
          console.log("::::NO UI passing:::");
          //console.log("::::first time reading -> UNREAD:::");
          var postID = parent.attr( "postID" );
          var read = Date.now();
          //set to read now
          //parent.attr( "state" , "read");

          //send post to server to update DB that we have now read this
          console.log("::::NO UI :::::READ::::SENDING POST TO DB:::::::POST:"+postID+" at time "+read);
          if (parent.attr( "profile" )=="yes")
            $.post( "/pro_feed", { postID: postID, read: read, _csrf : $('meta[name="csrf-token"]').attr('content') } );
          else
            $.post( "/feed", { postID: postID, read: read, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        }

        //UI and DIMMED READ, which does not count as a READ
        else
          {console.log("::::passing::::Already dimmed - do nothing - transparency is now "+parent.attr( "transparency" ));}

      },

    ////POST IS NOW Visiable - START EVENT
    onBottomVisible:function(calculations) {
        console.log("@@@@@@@ Now Seen @@@@@@@@@");
        var parent = $(this).parents(".ui.fluid.card.dim, .profile_card");
        
        var postID = parent.attr( "postID" );
        var start = Date.now();
        console.log("@@@@@@@ UI!!!! @@@@@@SENDING TO DB@@@@@@START POST UI has seen post "+postID+" at time "+start);
        if (parent.attr( "profile" )=="yes")
          $.post( "/pro_feed", { postID: postID, start: start, _csrf : $('meta[name="csrf-token"]').attr('content') } );
        else
          $.post( "/feed", { postID: postID, start: start, _csrf : $('meta[name="csrf-token"]').attr('content') } );

        }
  })
;//WTF!!!
//lazy loading of images
  $('.img.post img')
  .visibility({
    type       : 'image'
    //offset: 450,
    //transition : 'fade in',
    //duration   : 1000,

    
  })
;
*/
});