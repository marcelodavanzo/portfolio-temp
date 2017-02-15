/*
 Theme Name:    Marcelo Davanzo Portfolio
 Theme URI:     http://www.marcelodavanzo.com
 Description:   Marcelo Davanzo Portfolio Theme
 Author:        Marcelo Davanzo
 Author URI:    http://www.marcelodavanzo.com
 Template:      twentythirteen
 Version:       1.0.0
*/

var clickHandler  = ('ontouchstart' in document.documentElement ? 'touchend' : 'click'),
    downHandler   = ('ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown'),
    headerHeight;

/* -------------------------------- 
// DEV MODE TOGGLE
-------------------------------- */
$(document).on('click', '.header-nav .copy', function(){
  $('body').toggleClass('devMode');
});

/* -------------------------------- 
// KILL INITIAL SPINNER
-------------------------------- */
function killLoader(){
  $('.header-nav').removeClass('loading');
  // GET HEADER HEIGHT FOR PARALLAX FX
  setTimeout(function(){
    headerHeight = $('.header-nav').outerHeight();
  }, 1200);
}

/* -------------------------------- 
// DETECT PAGE AND ACT ACCORDINGLY
-------------------------------- */
$(window).on('load', function(){
  if ( $('body').hasClass('home') ) {
    homePageStart();
  } else if ( $('body').hasClass('project') || $('body').hasClass('error404') ) {
    //if more than one slide
    if ( $('.swiper-slide').length > 1 ) {
      projectPageStart();
    } else {
      $('.swiper-container').addClass('single');
    }
    stickyNavAutohide();
  }
});

/* -------------------------------- 
// HOME PAGE
-------------------------------- */
function homePageStart(){
  //console.log('HOME PAGE');
  getDribbbleUser();
  killLoader();
  casestudiesWaypoints();
  dribbbleWaypoints();
  //parallaxHeader();
}

/* -------------------------------- 
// PROJECT PAGE
-------------------------------- */
function projectPageStart(){
  //console.log('PROJECT PAGE');
  startMoreSwiper();
  casestudiesWaypoints();
}

  // MORE SWIPER - only on project and error404 pages
  function startMoreSwiper(){
    var moreSwiper = new Swiper('.swiper-container', {
      pagination:'.swiper-pagination',
      nextButton:'.swiper-button-next',
      prevButton:'.swiper-button-prev',
      paginationClickable:true,
      spaceBetween:0,
      mousewheelControl: true,
      mousewheelForceToAxis:true,
      loop:false,
      autoplay:5000,
      autoplayDisableOnInteraction:true,
      grabCursor:true,
      slidesPerView: 'auto',
      centeredSlides: true,
      preventClicksPropagation:false
    });
  }

/* -------------------------------- 
// BURGER TOGGLE
-------------------------------- */
$(document).on(clickHandler, '.header-nav .burger', function(){
  $('.header-nav').toggleClass('open');
});

  // CLICKING ANYWHERE CLOSES MENU
  $('body').on(downHandler, function(evt) {
    if ( evt.target.id == '.header-nav.open')
      return;
    // DESCENDANTS
    if ( $(evt.target).closest('.header-nav.open').length)
      return;             
      menuClose();
  });

  function menuClose(){
    $('.header-nav').removeClass('open');
  }

/* -------------------------------- 
// ACCORDIONS
-------------------------------- */
$(document).on('click', '.read-more', function(){
  $(this).siblings('.accordion').toggleClass('open');
  $(this).remove();
});

/* -------------------------------- 
// DRIBBBLE API
-------------------------------- */
var dribbbleShots,
    dribbbleShotsCount,
    dribbbleToken  = '5d033ab7a2975f939dbdd073dd449c5c3dd0862b34cde6d22d8a49cf797e9761',
    dribbbleUser   = 'marcelodavanzo';

// get total shots
function getDribbbleUser(){
  $.jribbble.setToken(dribbbleToken);
  
  $.jribbble.users(dribbbleUser).then(function(user) {
    dribbbleShotsCount = user.shots_count;
    getDribbbleShots();
  });
}

// fetch all shots
function getDribbbleShots(){
  $.jribbble.users(dribbbleUser).shots({per_page:dribbbleShotsCount}).then(function(shots) {
    var html = [];
    dribbbleShots = shots;
    //console.log(shots);
    
    shots.forEach(function(shot, i) {
      var id                = shot.id,
          image_hidpi       = shot.images.hidpi,
          image_normal      = shot.images.normal,
          image_teaser      = shot.images.teaser,
          likes_count       = shot.likes_count,
          views_count       = shot.views_count,
          title             = shot.title,
          url               = shot.html_url,
          myDelay           = i*60+'ms';

      //console.log(title, id, url, likes_count, views_count);
      
      //tile template
      html += '<li ';
      
      if (shot.animated) {
        html += 'class="isgif" ';
      }
      
      html += 'style="transition-delay:' + myDelay + '; -webkit-transition-delay:' + myDelay + '">';
      html +=   '<a href="' + url + '" target="_blank">';
      html +=     '<div class="info flex-it flex-align-item-end">';
      html +=       '<div class="details flex-it flex-align-item-center flex-justify-between">';
      html +=         '<h2 class="views_count"><i class="material-icons">remove_red_eye</i>' + views_count + '</h2>';
      html +=         '<h2 class="likes_count"><i class="material-icons">favorite</i>' + likes_count + '</h2>';
      html +=       '</div>';
      html +=     '</div>';
      html +=     '<img src="' + image_normal + '" alt="' + title + '" />';
      html +=   '</a>';
      html += '</li>';
    });
    
    $('.dribbble ul').html(html);
  });
} //getShots()

	// HOVER TRIGGERS ANIMATED GIFS
  $(document).on('mouseenter', '.no-touch .dribbble ul li.isgif', function(){
    hovered = $(this).index();
    $(this).find('img').attr('src', dribbbleShots[hovered].images.hidpi);
  });
	$(document).on('mouseleave', '.no-touch .dribbble ul li.isgif', function(){
    hovered = $(this).index();
    $(this).find('img').attr('src', dribbbleShots[hovered].images.normal);
  });

	// TOUCH TRIGGERS ANIMATED GIFS
	$(document).on('touchstart', '.touch .dribbble ul li.isgif', function(){
    touched = $(this).index();
    $(this).find('img').attr('src', dribbbleShots[touched].images.hidpi);
  });
	$(document).on('touchend', '.touch .dribbble ul li.isgif', function(){
    touched = $(this).index();
    $(this).find('img').attr('src', dribbbleShots[touched].images.normal);
  });

/* -------------------------------- 
// WAYPOINTS
-------------------------------- */
function dribbbleWaypoints(){
  var visibility = $('#dribbble').waypoint(function(direction) {
    //console.log(this.element.id + ' hit');
    $('#dribbble').addClass('visible').removeClass('loading');
  }, {
    offset: '60%'
  }); 
}

function casestudiesWaypoints(){
  var visibility = $('#casestudies').waypoint(function(direction) {
    //console.log(this.element.id + ' hit');
    $('#casestudies').addClass('visible');
  }, {
    offset: '60%'
  });
  
  $('.cards-container ul li').each(function(i){
  	$(this).css({'transition-delay': i*60+'ms'});
  });
}

/* -------------------------------------- 
// AUTOHIDE STICKY NAV ON PROJECT PAGES
----------------------------------------- */
function stickyNavAutohide(){
  var didScroll,
      lastScrollTop = 0,
      delta         = 50,
      navbarHeight  = $('.header-nav').outerHeight();

  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
      return;
    
    if (st > lastScrollTop && st > navbarHeight){
      // Scroll Down
      $('body').addClass('hide-nav');
    } else {
      // Scroll Up
      if(st + $(window).height() < $(document).height()) {
        $('body').removeClass('hide-nav');
      }
    }
    
    lastScrollTop = st;
  }
}

/* -------------------------------- 
// PARALLAX ON HEADER
-------------------------------- */
function parallaxHeader(){
  if ( $('html').hasClass('no-touch') && !$('html').hasClass('-ms-') ) {
    var headerHeight = $('.header-nav').outerHeight() - 175;
    $('.brand').attr('data-top-bottom','transform:translate3d(0px,' + headerHeight + 'px,0px)');
    $('.brand, .copy, .location').addClass('notransition');
    
    // Init Skrollr
    skrollr.init({
      forceHeight:true,
      smoothScrolling:true,
      render:function(data) {
        //Debugging - Log the current scroll position.
        //console.log('data.curTop: ' + data.curTop);
      }
    });
  }
  
  $(window).on('resize', function(){
    skrollr.get().refresh();
  });
}

/*
var scrolled   		= $(document).scrollTop(),
    headerHeight	= $('.header-nav').outerHeight(),
    brandTop,
    distanceLocation,
    height1 			= headerHeight * 0.10;
		height2 			= headerHeight * 0.27;
		height3 			= headerHeight * 0.62;
    scrolled1 		= scrolled - height1,
    scrolled2 		= scrolled - height2,
    scrolled3 		= scrolled - height3;

$(window).scroll(function(){
  scrolled 					= $(document).scrollTop(),
  headerHeight			= $('.header-nav').outerHeight(),
    
  brandTop					= $('.brand').offset().top,
  distanceBrandTop	= brandTop - scrolled;
    
  if ( $('body').hasClass('home') && scrolled <= headerHeight ) {
    window.requestAnimationFrame( function(){
      headerParallax();
    });
  }

});

// when distance between .brand and top of window equals the padding of the section, make it stick
// when. logo is at 80px from the top of .about, being scaling until it reaches 0.5
// then make it scroll along with the header

/////////////////////////////////////////////////////////////////////////

/*
function headerParallax(){
  var progress = ((scrolled / headerHeight) * 100).toFixed(0);

  function translateY(ratio) { // ratio is the original value of the property
  	var transX = (scrolled / ratio);
    return transX;
  }
  
  function scale(start,end,progress) { // ratio is the original value of the property
  	var scale = start - ( progress / 100 ) * (1 - end);
    if (scale >= end)
    	return scale;
  }
  //'scale3d('+ scale(1,0.75) +','+ scale(1,0.75) +',1)'
  
  function opacity(start,end,progress) { // ratio is the original value of the property
  	var opacity = start - ( progress / 100 );
    return opacity.toFixed(2);
  }
  //opacity:opacity(1,0)
  
  //console.log(scrolled);
 
  if (scrolled >= height1) {
    scrolled1 = scrolled - height1;
    $('.header-nav .brand').addClass('notransition').css({transform:'translate3d(0,'+ scrolled1 +'px,0)'});
  }
  if (scrolled >= height2) {
    scrolled2 = scrolled - height2;
    $('.header-nav .copy').addClass('notransition').css({opacity:opacity(1,0,scrolled2)});
    $('.header-nav .location').addClass('notransition').css({transform:'translate3d(0,'+ scrolled2 +'px,0)', opacity:opacity(0.7,0,scrolled2)});
	}

  if (scrolled >= height3) {
    scrolled3 = scrolled - height3;
    $('.header-nav .logo').addClass('notransition').css({transform:'translate3d(0,-'+ scrolled3 +'px,0)'});
	}
}
*/

/////////////////////////////////////////////////////////////////////////

function headerParallax(){
  var progress = ((scrolled / headerHeight) * 100).toFixed(0);
  //console.log(progress);
  
  function translateY(ratio) { // ratio is the original value of the property
  	var transX = (scrolled / ratio);
    return transX;
  }
  
  function scale(start,end) { // ratio is the original value of the property
  	var scale = start - ( progress / 100 ) * (1 - end);
    return scale;
  }
  //'scale3d('+ scale(1,0.75) +','+ scale(1,0.75) +',1)'
  
  function opacity(start,end) { // ratio is the original value of the property
  	var opacity = start - ( progress / 100 );
    return opacity.toFixed(2);
  }
  //opacity:opacity(1,0)
  
  function blur(start,end) {
  	var blur = start + ( progress / end );
    return blur.toFixed(1);
  }
  //'-webkit-filter':'blur('+ blur(0,10) +'px)'

  $('.header-nav .brand').addClass('notransition').css({transform:'translate3d(0,'+ translateY(1.7) +'px,0)'});
  $('.header-nav .copy').addClass('notransition').css({transform:'translate3d(0,-'+ translateY(4) +'px,0) scale3d('+ scale(1,0.85) +','+ scale(1,0.85) +',1)', opacity:opacity(1,0)});
  $('.header-nav .location').addClass('notransition').css({opacity:opacity(0.7,0)});
}