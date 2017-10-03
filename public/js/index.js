function show_talkindex() {
	var talk_index = $('#talk_index');
	var login_index = $('#login_index');
	talk_index.animate({
		'left' : 0,
		'opacity' : 1
	},1000);
	login_index.animate({
		'left' : '-200%',
		'opacity' : 0
	},500);
}

function show_loginindex() {
	var talk_index = $('#talk_index');
	var login_index = $('#login_index');
	talk_index.animate({
		'left' : '-200%',
		'opacity' : 0
	},500);
	login_index.animate({
		'left' : 0,
		'opacity' : 1
	},1000);
}


