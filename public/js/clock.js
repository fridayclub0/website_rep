function imageloginform() {
	$('#loginform').css('zIndex',5);
	$('#loginplate').animate({
		'left' : '0'
	},200);
}
function resizeclock(){
	var winheight = document.documentElement.clientHeight * 0.2;
	var winwidth = document.documentElement.clientWidth * 0.2;
	if (winheight < winwidth){
		$('#clock_plate').css({
			'width' : winheight,
			'height' : winheight
		});
	} else {
		$('#clock_plate').css({
			'width' : winwidth,
			'height' : winwidth
		});
	}
		
}
function imageclock(){
	$('#clock').css('zIndex',3).animate({
		'opacity' : 1
	},200);
	$('#img3').css('zIndex',-1).animate({
		'opacity' : 0
	},100);
}

$(function(){
	
	var clockheight = $('#clock').height()*0.65;
	$('#clock').css('font-size',clockheight);
	//resizeclock();
	$(window).resize(function(){
		var clockheight = $('#clock').height()*0.7;
		console.log(clockheight);
		$('#clock').css('font-size',clockheight);
		//resizeclock();
	});
	
	
	//背景の変更
	var date_time = new Date();
	var hour = date_time.getHours();
    /*
	if (3 < hour && hour <= 6 || 15 < hour && hour <= 16){
		var before = $('<div>').addClass('sunsetc');
		$('#title_logo').css('color','orange');
		$('body').append(before);
		$('header').addClass('sunset');
		$('#writing_pad').addClass('sunset2');
		$('#talk_comment_pad').addClass('sunset2');
	} else */
        if (6 < hour && hour <= 17) {
		var before = $('<div>').addClass('daylightc');
		$('#title_logo').css('color','aqua');
		$('body').append(before);
		$('header').addClass('daylight');
		$('#writing_pad').addClass('daylight2');
		$('#talk_comment_pad').addClass('daylight2');
	} else {
		var before = $('<div>').addClass('nightc');
		$('#title_logo').css('color','grey');
		$('body').append(before);
		$('header').addClass('night');
		$('#writing_pad').addClass('night2');
		$('#talk_comment_pad').addClass('night2');
	}
	
	
	var timeid = setInterval(function() {
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		
		$("#h").text(h);
		$("#m").text(m);
		$("#s").text(s);

		
	},1000);
	var count = 1;
	var img = new Array("_sleep1.png","_sleep2.png");
	sleeping = setInterval(function(){	 
		if (count == img.length) count = 0; 
		$('#miku').attr('src','../sysimg/'+img[count]);
		count++; 
	},2000);
	
	setTimeout(function(){
		$('#title_logo').animate({
			'opacity' : 0
		},1000);
	},5000);
	
	setTimeout(function(){
		$('#clock').animate({
			'opacity' : 1
		},1000);
	},6000);
});


