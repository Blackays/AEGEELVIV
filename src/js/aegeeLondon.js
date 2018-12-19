
function showTopBarEntries() {
	var menuEntries = d.qsa(".top-bar__tab-container:nth-child(n+3)");
	menuEntries.forEach(function(e, i) {
		e.classList.add("top-bar__tab-container--in");
		e.classList.add("top-bar__tab-container--in" + (i + 1));
	});
	
	d.st(function() { moveLine(); }, 500);
}





// https://developers.google.com/youtube/player_parameters
// http://stackoverflow.com/questions/8869372/how-do-i-automatically-play-a-youtube-video-iframe-api-muted
// http://stackoverflow.com/questions/20501010/youtube-api-onplayerready-not-firing
function onYouTubeIframeAPIReady() { // eslint-disable-line no-unused-vars
	var player = new YT.Player("intro__video", {
		events: {
			onReady: function() {
				player.mute();
				player.playVideo();
			},
			onStateChange: function(e) {
				if (e.data === YT.PlayerState.PLAYING) {
					showTopBarEntries();
					d.gc("intro__video-container").classList.add("intro__video-container--in");
					
					// The 'end' and 'loop' YouTube parameters didn't work
					var t = 0;
					var id = d.si(function() {
						player.seekTo(0);
						if (t===2) {
							player.pauseVideo();
							clearInterval(id);
						}
						++t;
					}, 20000);
				}
			}
		}
	});
}





function isMobile(width) {
	return window.innerWidth < (width || 810);
}





function setMargin() {
	return isMobile() ? 80 : 300;
}





function setBodyHeight(delayed) {
	var height = d.calcClientHeightsSum("section.skrollr-deck") + setMargin()*6;
	document.body.style.height = height + "px";
	
	delayed ? d.st(function() { moveLine(); }, 500) : moveLine();
}





function moveLine(position) {
	var hash = window.location.hash;
	if (position === undefined && hash) {
		switch (hash.slice(1)) {
			case "intro":		position = 0; break;
			case "who-we-are":	position = 1; break;
			case "activities":	position = 2; break;
			case "the-board":	position = 3; break;
			case "join-us":		position = 4; break;
			case "faq":			position = 5; break;
			case "contact":		position = 6; break;
			default:			position = 5; break;
		}
	} else if (position === undefined) {
		position = 0;
	}
	
	var topBarPositions = d.calcPositionsToViewport(".top-bar__tab");
	var line = d.gc("top-bar__line");
	line.style.width = topBarPositions[position].width + "px";
	line.style.transform = "translate3d(" + topBarPositions[position].left + "px, 0, 0)";
}





function init() { // eslint-disable-line no-unused-vars
	d.st(function() { showTopBarEntries(); }, 2500);
	setBodyHeight();
	
	
	
	var margin = setMargin();
	var gap = -margin;
	
	
	
	// Sets up Skroller
	var offsetFunctions = {
		get d0() { return d.gi("intro").clientHeight + margin; },
		get d0g() { return gap + this.d0; },
		get d1() { return d.gi("who-we-are").clientHeight + margin + this.d0; },
		get d1g() { return gap + this.d1; },
		get d2() { return d.gi("activities").clientHeight + margin + this.d1; },
		get d2g() { return gap + this.d2; },
		get d3() { return d.gi("the-board").clientHeight + margin + this.d2; },
		get d3g() { return gap + this.d3; },
		get d4() { return d.gi("join-us").clientHeight + margin + this.d3; },
		get d4g() { return gap + this.d4; },
		get d5() { return d.gi("faq").clientHeight + margin + this.d4; },
		get d5g() { return gap + this.d5; },
		get d6() { return d.gi("contact").clientHeight + margin + this.d5; }
	};
		
	var skrollrInstance = skrollr.init({
		smoothScrolling: false,
		forceHeight: false,
		constants: offsetFunctions,
		mobileCheck: function() { return false; },
		keyframe: function(element, name, direction) {
			// console.log("keyframe:");
			// console.log(name);
			// console.log(name.slice(6));
			var extra = 0;
			if (direction === "up")
				--extra;
			switch (name.slice(6)) {
				case "0g": moveLine(1 + extra); break;
				case "1g": moveLine(2 + extra); break;
				case "2g": moveLine(3 + extra); break;
				case "3g": moveLine(4 + extra); break;
				case "4g": moveLine(5 + extra); break;
				case "5g": moveLine(6 + extra);
			}
		}
	});
	
	// Sets up Skroller Menu
	skrollr.menu.init(skrollrInstance, {
		animate: true,
		easing: "outCubic",
		duration: 500,
		handleLink: function(link) {
			var extra = 1;
			var linkText = link.href.split("#").pop();
			
			try { // To prevent SYNTAX_ERR exception
				if (d.qs("#" + linkText) === null)
					throw Error;
			} catch(e) {
				document.location.hash = "";
				return 0;
			}
			
			switch (linkText) {
				case "intro":		return 0;
				case "who-we-are":	return offsetFunctions.d0 + extra;
				case "activities":	return offsetFunctions.d1 + extra;
				case "the-board":	return offsetFunctions.d2 + extra;
				case "join-us":		return offsetFunctions.d3 + extra;
				case "faq":			return offsetFunctions.d4 + extra;
				case "contact":		return offsetFunctions.d5 + extra;
			}
			
			var linkPosition = d.calcRelativePosition("#faq", "#" + linkText);
				
			if (linkPosition)
				return offsetFunctions.d4 + linkPosition.top - 70;
			
			return 0;
		}
	});
	
	
	
	// Sets the size FB iframes depending on desktop or mobile
	var width = isMobile() ? 320 : 500,
		height = isMobile() ? 500 : 560,
		width2 = isMobile() ? 320 : 500,
		height2 = isMobile() ? 400 : 500;
	
	d.gc("activities__fb-iframe").src = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAegeeLondon%2F&tabs=events&small_header=true&hide_cover=false&show_facepile=true&width=" + width + "&height=" + height;
	d.gc("contact__fb-iframe").src = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAegeeLondon%2F&tabs=messages&small_header=false&hide_cover=false&show_facepile=true&width=" + width2 + "&height=" + height2;
	
	
	
	// Loads the intro video if on desktop
	if (!isMobile() && (d.getOS() === "Windows" || d.getOS() === "macOS" || d.getOS() === "Linux")) {
		d.gc("intro__video").src = "//www.youtube.com/embed/7x8BCbo45qA?controls=0&enablejsapi=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&origin=http://aegee-london.eu";
	}
	
	
	
	// Adds logic for 'scroll' and 'resize' events
	var scrolled = false,
		distance = offsetFunctions.d0/3.5,
		header = d.gc("top-bar");
	
	d.ae("scroll", function() {
		if (window.pageYOffset > distance && !scrolled) {
			header.classList.add("top-bar--in");
			scrolled = true;
		} else if (window.pageYOffset < distance && scrolled) {
			header.classList.remove("top-bar--in");
			scrolled = false;
		}
	});
	
	d.ae("resize", function() {
		setBodyHeight(true);
		d.gc("top-bar").classList.remove("top-bar--open");
		d.gc("top-bar__three-bars-close-surface").classList.remove("top-bar__three-bars-close-surface--in");
	});
	
	d.ae("load", function() {
		setBodyHeight();
	});
	
	
	
	// Adapts the UI to remove intro animations if the URL points to a section
	var hash = window.location.hash;
	if ((hash && hash !== "#intro") || isMobile()) {
		d.gc("top-bar").classList.add("top-bar--in");
		d.gc("top-bar").classList.add("top-bar--in-no-delay");
		d.st(function() { d.gc("top-bar").classList.remove("top-bar--in-no-delay"); }, 1000);
		
		showTopBarEntries();
	}
	
	
	
	// Set ups the navigation top bar for mobile screens
	d.qsa(".top-bar__tab, .top-bar__three-bars, .top-bar__three-bars-close-surface").forEach(function(item) {
		item.addEventListener("click", function() {
			if (isMobile()) {
				d.gc("top-bar").classList.toggle("top-bar--open");
				d.gc("top-bar__three-bars-close-surface").classList.toggle("top-bar__three-bars-close-surface--in");
			}
		});
	});
	
	
	
	// https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits
	d.qs("a.top-bar__tab[href='#intro']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "intro"); });
	d.qs("a.top-bar__tab[href='#who-we-are']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "who-we-are"); });
	d.qs("a.top-bar__tab[href='#activities']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "activities"); });
	d.qs("a.top-bar__tab[href='#the-board']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "the-board"); });
	d.qs("a.top-bar__tab[href='#join-us']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "join-us"); });
	d.qs("a.top-bar__tab[href='#faq']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "faq"); });
	d.qs("a.top-bar__tab[href='#contact']").addEventListener("click", function() { ga("send", "event", "Top bar link", "click", "contact"); });
	
	
	
	d.gc("body").classList.add("body--in");
}
