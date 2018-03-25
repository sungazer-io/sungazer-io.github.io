"use strict";

var $ = jQuery;
var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/);

	/*scrollbar*/
	function scrollbar(){
		if (isTouchDevice){
		  $('.container-wrap-block').addClass('scroll-block');
		} 
		else {
			$('.container-wrap-block').mCustomScrollbar({
				scrollInertia: 150,
				axis			:"y",
				callbacks:{
				 	onScrollStart:function(){
		      $('header').addClass('backdroundHeader');
			  },
		    onTotalScrollBack:function(){
		      $('header').removeClass('backdroundHeader');
		    }
				}
			});
		}
		$('.scroll-block').on('scroll', function() {
	    if($(this).scrollTop()>1) {
	    	$('header').addClass('backdroundHeader');
	    }
	    else {
	    	$('header').removeClass('backdroundHeader');
	    }
		});
  }

	 /*animatecontent*/
	function animatecontent() { 
	  $('.right-animate').removeClass('fadeInRightBig').addClass('fadeOutRightBig').css('opacity','0');
		$('.left-animate').removeClass('fadeInLeftBig').addClass('fadeOutLeftBig').css('opacity','0');
	  $('.active .right-animate').removeClass('fadeOutRightBig').addClass('fadeInRightBig').css('opacity','1');
		$('.active .left-animate').removeClass('fadeOutLeftBig').addClass('fadeInLeftBig').css('opacity','1');
		$('.down-animate').removeClass('fadeInUpBig').addClass('fadeOutDownBig').css('opacity','0');
		$('.active .down-animate').removeClass('fadeOutDownBig').addClass('fadeInUpBig').css('opacity','1');
		var $menuLinks   = $('.menu-block li a');
		$menuLinks.on('click', function(){
			var nextPanelName = $(this).attr('href');
			changePanel(nextPanelName);
		});
	}

	function changePanel(nextPanelName){
	    var nextPanel = $(nextPanelName);
	    $('header').removeClass('backdroundHeader');
	    $('.right-animate').removeClass('fadeInRightBig').addClass('fadeOutRightBig').css('opacity','0');
			$('.left-animate').removeClass('fadeInLeftBig').addClass('fadeOutLeftBig').css('opacity','0');
			$('.down-animate').removeClass('fadeInUpBig').addClass('fadeOutDownBig').css('opacity','0');
			nextPanel.find('.right-animate').removeClass('fadeOutRightBig').addClass('fadeInRightBig').css('opacity','1');
			nextPanel.find('.left-animate').removeClass('fadeOutLeftBig').addClass('fadeInLeftBig').css('opacity','1');
			nextPanel.find('.down-animate').removeClass('fadeOutDownBig').addClass('fadeInUpBig').css('opacity','1');
	  $('.animated').each(function(){
			var $this     = $(this),
				duration = $this.data('duration');
			$this.css('animation-duration', duration + 'ms');
	  });
	}


	 /*layout*/
	function layout() {  
		var $this   = $('section');
		$this.each(function() {
		  var bodyhm=$('body').height() -200;
			var $this = $(this);
			var heightcontent=$this.find('.container-wrap').height();
	    $this.parent('.general-block').css('height','heightWrap');
		  if ( bodyhm > heightcontent ) {
		  	$this.addClass('noScrollRelative');
		    $this.find('.pp-tableCell').css('display','table-cell');
		    $this.css('display','table');
		    $this.find('.container-wrap-block').css({'height':'auto', 'overflow':'visible'});
		    $this.find('.footer').css('position','absolute');
		  }
		  else {
		  	$this.removeClass('noScrollRelative');
		  	$this.find('.pp-tableCell').addClass('paddingTop').css('display','block');
		    $this.css('display','block');
		    $this.find('.container-wrap-block').css({'height':'100%', 'overflow':'auto'});
		    $this.find('.footer').css('position','static');
		  }
		  if ( $('body').width() < 768 ) {
		  	$('.close-block').on('click', function(){
		  		$('.main-menu').css('left','-100%');
		  	});
		  }
		});
	}

	/*social*/
	function social() {
	  $('.soc-link, .soc-link-close').on('click', function(e){
	    e.preventDefault();
	    $('.social-links').toggleClass('fadeOutRight fadeInRight');
	    $('.menu').toggleClass('fadeOutLeft fadeInLeft');
	  });

    var ua = navigator.userAgent;
	  if ((ua.match(/MSIE 9.0/i))) {
	    $('.block-nav').addClass('ie');
	    $('.social-links').addClass('dnone');
	    $('.menu').addClass('dblock');
	    $('.soc-link, .soc-link-close').on('click', function(){
  	    $('.social-links').toggleClass('dnone dblock');
  	    $('.menu').toggleClass('dblock dnone');
	    });
	  } 
	}

	/*carouselAdvantage*/
	function carouselAdvantage(){
	  var carouselBox = $('.carousel-advantage');
	  carouselBox.each(function(){
		var thisBox      = $(this),
				carousel     = $(this).find('.carousel-box'),
				animation    = 'zoomIn',
				animationOut = 'zoomOut',
				items        = {0 : {items : 1}, 1200 : { items :3}};
	 	
	 		carousel.owlCarousel({
	 			loop            : true,
	 			pullDrag        : false,
	 			responsiveClass : true,
	 			margin          : 20,
	 			responsive      : items,
	 			mouseDrag       : false,
	 			touchDrag       : false,
	 			navRewind       : false,
	 			dots            : false
	 		}).touchwipe({
	 			wipeLeft: function(){
	 				thisBox.find('.carousel-controls .prev ').trigger('click');
	 			},
	 			wipeRight: function(){
	 				thisBox.find('.carousel-controls .next').trigger('click');
	 			},
	 			preventDefaultEvents: false
	 		});
 		 	carousel.find('.owl-item.active').first().addClass('first');
 			carousel.find('.owl-item.active').last().addClass('last');
 			carousel.on('changed.owl.carousel', function(event) {
 				var first = event.item.index + 1;
 				var last = event.item.index + 3;
 				carousel.find('.owl-item').removeClass('first').removeClass('last');
 				carousel.find('.owl-item:nth-child('+first+')').addClass('first');
 				carousel.find('.owl-item:nth-child('+last+')').addClass('last');
 			});

	 		carousel.closest('.carousel-advantage').on('click', '.nav-item', function(e){
	 			var item = carousel.find('.owl-item .item');
	 			e.preventDefault();

	 			item.css('animation-delay', '1ms');
	 			
	 			item.each(function(){
	 				var $this = $(this);
	 					item.removeClass(animation);
	 					$this.addClass(animationOut);
	 			});
	 			
	 			var event = 'next';
				
				if ($(this).hasClass('prev')) {
					event = 'prev';
				}
	 			
	 			setTimeout(function(){
	 				carousel.trigger(event + '.owl.carousel');
	 				item.addClass(animationOut);
	 			}, 400);
	 			
	 			setTimeout(function(){
	 				item.removeClass(animationOut).addClass(animation);
	 			}, 800);
	 		});
	  });
	}

	/*carousel*/
	function carousel(){
		var $this   = $('.carousel'),
				visible = 3,
				mdcol   =$('.container').width() - 440,
				smcol = 220,
				direction = 'down';

		$this.each(function() {
			var $this = $(this);
			
			if ($('body').width() >= 992) {
				$this.trigger('destroy');
				visible = 3,
				direction = 'left';
			}
			else if ($('body').width() >= 768) {
				$this.trigger('destroy');
				visible = 1;
				direction = 'left';
			}
			else {
				$this.trigger('destroy');
				visible = 1;
			}
		
			var cssSmall = {
				width: smcol,
				height: 250
			};

			var cssLarge = {
				width: mdcol,
				height: 250,
				marginTop: 0
			};

			var aniConf = {
				queue: false,
				duration: 500
			};
		
			if ($('body').width() >= 992) {
				$this
					.children().css(cssSmall)
					.eq(1).css(cssLarge)
					.next().css(cssSmall);
			} else {
				$this
					.children().css(cssSmall)
					.eq(1).css(cssLarge)
					.next().css(cssSmall);
			}
		
			$this.carouFredSel({
				width: '100%',
				items: {
					visible: visible
				},
				direction: direction,
				auto: false,
				scroll: {
					items: 1,
					duration: aniConf.duration
				},
				onCreate: function (data){
					data.items.removeClass('last');
					data.items.addClass('active');
					data.items.first().addClass('first');
					data.items.last().addClass('last');
				},
				prev: {
					button: function() {
					return $(this).parent().siblings(".prev");
					},
					onBefore: function( data ) {				
						data.items.old.removeClass('active');
						data.items.visible.addClass('active');
						data.items.old.removeClass('first').removeClass('last');
						data.items.visible.first().addClass('first');
						data.items.visible.last().addClass('last');
						if ($('body').width() >= 992) {
							data.items.old.eq(-1).animate(cssSmall, aniConf);
							data.items.old.eq(0).animate(cssLarge, aniConf);
							data.items.old.eq(1).animate(cssSmall, aniConf);
						} else {
							data.items.old.eq(-1).animate(cssSmall, aniConf);
							data.items.old.eq(0).animate(cssLarge, aniConf);
							data.items.old.eq(1).animate(cssSmall, aniConf);
						}
					}
				},
				next: {
					button: function() {
						return $(this).parent().siblings(".next");
					},
					onBefore: function( data ) {				
						data.items.old.removeClass('active');
						data.items.visible.addClass('active');
						data.items.old.removeClass('first').removeClass('last');
						data.items.visible.first().addClass('first');
						data.items.visible.last().addClass('last');
						if ($('body').width() >= 992) {
							data.items.old.eq(1).animate(cssSmall, aniConf);
							data.items.old.eq(2).animate(cssLarge, aniConf);
							data.items.old.eq(3).animate(cssSmall, aniConf);
						} else {
							data.items.old.eq(1).animate(cssSmall, aniConf);
							data.items.old.eq(2).animate(cssLarge, aniConf);
							data.items.old.eq(3).animate(cssSmall, aniConf);
						}
					}
				}
			}).touchwipe({
				wipeLeft: function(){
					$this.trigger('next', 1);
				},
				wipeRight: function(){
					$this.trigger('prev', 1);
				},
				preventDefaultEvents: false
			});
		});
	}

	/*pagepiling*/
	function pagepiling(){    
		$('.pagepiling').pagepiling({
			sectionSelector: 'section',
			direction: 'horizontal',
			menu: '.menu-block',
			anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'],
			navigation: false,
			scrollingSpeed: false,
			normalScrollElements: false
		});
	  $('.pagepiling').pagepiling.setAllowScrolling(false);
	  $('.pagepiling').pagepiling.setScrollingSpeed(0);
	}

	/*menuselect*/
	function menuselect(){
	  if ( $('body').width() < 767 ) {
	    $('.main-menu').css('left','-100%');
	    $('.menu-select').on('click', function(){
	      $('.main-menu').css('left','0');
	    });
	    $('.main-menu a').on('click', function(){
	      $('.main-menu').css('left','-100%');
	    });
	  }
	}

	/*page*/
	function page(){
	  if ( $('body').width() < 767 ) {
	  	$('.menu-block').addClass('main-menu');
	    menuselect();
	  }
	   else {
	    $('.menu-block').removeClass('main-menu').removeClass('slideOutLeft');
		}
	}

	/*.svg to svg */
	function imgtosvg() {     
	  $('img.svg').each(function(){
	    var $img = $(this);
	    var imgID = $img.attr('id');
	    var imgClass = $img.attr('class');
	    var imgURL = $img.attr('src');
	    $.get(imgURL, function(data) {
	      var $svg = $(data).find('svg');
	      if(typeof imgID !== 'undefined') {
	        $svg = $svg.attr('id', imgID);
	      }
	      if(typeof imgClass !== 'undefined') {
	        $svg = $svg.attr('class', imgClass+' replaced-svg');
	      }
	      $svg = $svg.removeAttr('xmlns:a');
	      $img.replaceWith($svg);
	    }, 'xml');
	  });
	}  

	$(document).ready(function(){
		if($('.pagepiling').length) {
		  pagepiling();
		}
		animatecontent();
		scrollbar();
	  page();
	  layout();
	  imgtosvg();
	  carousel();
	  social();
	  carouselAdvantage();
		if(window.location.hash) {
			var url    = window.location.href,
					hash   = url.substring(url.indexOf('#'));
			changePanel(hash);
		} 
		else {
			var url   = "#page1";
			location.hash = url;
		}
	  $(window).on('hashchange', function(){
	  var panelName = window.location.hash;
		  if(window.location.hash) {
		  	changePanel(panelName);
				if ( $('body').width() < 767 ) {
	  	    $('.main-menu').css('left','-100%');
				}
		  }
		  else {
		  	if ( $('body').width() < 767 ) {
	  	    $('.main-menu').css('left','0');
				}
		  }
	  });

	  if ( $('body').width() > 767 ) {
	  	if($('.image-link').length) {
	  	 	$('.image-link').fancybox({
	  	 		openEffect  : 'elastic',
					prevEffect	: 'none',
					nextEffect	: 'none',
					padding: 0
	  	 	});
	  	}
	  }

	  /*selectbox*/
	  if($('select').length) {
	    $('select').selectik({maxItems: 5},{
	      _generateHtml: function(){
	        this.$collection = this.$cselect.children();
	        var html = '';
	        for (var i = 0; i < this.$collection.length; i++){
	          var $this = $(this.$collection[i]);
	          var textOption = $this[0].text;
	          html += '<li class=""+ ($this.attr("disabled") === "disabled" ? "disabled" : "") + "new" data-value="" + valueOption + "">'+textOption+'</li>';
	        }
	        return html;
	      }
	    });
	  }
	  $('.select-scroll+ul ').wrap( '<div class="select-list-wrap"></div>' );
	  $('.custom-text').append('<span class="border-top"></span><span class="border-bottom"></span>');
	  if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)){
	    $('select').wrap( '<div class="custom-text"></div>');
	    $('.custom-text').wrap('<div class="custom-select"></div>');
	  }
		$('.iphone-block').css('height',$(".app-text").height()+ 40 + 'px' );

		/*Background*/
		/*Slider*/
		if($('.rslides').length){
		  $(function() {
		    $('.rslides').responsiveSlides({
		      timeout: 5000,
		      speed: 1000
		    });
		  });
		}
	});

	$(window).load(function(){
	  /*preloader*/
	  $('.loader').delay(1500).fadeOut();
	});

	//Window Resize
	(function(){
	  var delay = (function(){
			var timer = 0;
			return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
	  })();
	  
	  function resizeFunctions() {
		  layout();
	    page();
	    scrollbar();
	    menuselect();
	    carousel();
	    carouselAdvantage();
	  }
		if(isTouchDevice) {
			 $(window).on('orientationchange', function(){
				 delay(function(){
				 resizeFunctions();
			 }, 300);
				 });
		} else {
			 $(window).on('resize', function(){
				 delay(function(){
				 resizeFunctions();
			}, 500);
		 });
		}
	}());