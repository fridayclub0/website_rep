function open_obj(id,zindex){ //左からスライドイン
	var obj = $(id);
	obj.css('zIndex',zindex);
	obj.animate({'left' : '0','opacity' : '1'},800);
}

function close_obj(id){ //透明化しながら左側へスライドアウトする
	var obj = $(id);
	obj.animate({'left' : '-200%','opacity' : '0'},800)
	.queue( function(next){$(this).css('zIndex','-1').dequeue();});
	//そのうちどうにかしたいよね
	if(id='#writing_pad'){
		$('#talk_title').val('');
       	$('#talk_comment').val('');
       	$('#submit_talk_file').val('');
	}
}

function open_obj2(id,zindex){ //縦方向に広がりながら現れるパターン
	var obj = $(id);
	obj.css('zIndex',zindex);
	obj.animate({'height' : '200px','opacity' : '1'},800);
}

function close_obj2(id){ //縦方向に潰れながら消えるパターン
	var obj = $(id);
	obj.animate({'height' : '0','opacity' : '0'},800)
	.queue( function(next){$(this).css('zIndex','-1').dequeue();});
}



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


