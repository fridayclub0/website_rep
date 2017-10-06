// セッションの格納
//window.sessionStorage.setItem(['キー名'],['値']);
// セッションの数の取得
//window.sessionStorage.length
// セッションの値の取得
//window.sessionStorage.getItem(['キー名']);
//console.log(a);    // => value1
// 指定したセッションの削除
//window.sessionStorage.removeItem(['キー名']);
// 全てのセッションの削除
//window.sessionStorage.clear();

$(function(){
	window.sessionStorage.setItem(['sysid'],['0000000000']);
	window.sessionStorage.setItem(['talk_no'],0);
	window.sessionStorage.setItem(['img'],'no_image.png');
	window.sessionStorage.setItem(['ID'],'guest');
	var hash = gethash();
	window.sessionStorage.setItem(['hash'],[hash]);
	$('#handlename').val(hash);
	talk_list('begin');
});

function gethash(){ //ゲストネームとして用いる三文字のランダム文字列を出力する
	var l = 3;
// 生成する文字列に含める文字セット
	var c = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわおん";

	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
 	 	r += c[Math.floor(Math.random()*cl)];
	}
	return r;
}

function handleFileUpload(files){ //ファイルのアップロードに使う
	var fd = new FormData();
	console.log('uploadfile:'+files.length);
   	for (var i = 0; i < files.length; i++){
       	//var fd = new FormData(); <=変じゃね？直したけどエラーがあったら要チェック
       	fd.append('file', files[i]);
       	sendFileToServer(fd);
	}
}

function sendFileToServer(formData){ //handleFileUploadで使っている。
	console.log('sendfile');
   	var uploadURL ="/upload"; //Upload URL
   	var extraData ={}; //Extra Data.
   	$.ajax({
       	url: uploadURL,
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(data){
       		window.sessionStorage.setItem(['upload_temp'],data);
       	},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			sysalert1('Error : ' + errorThrown);
		}
   	});
}

function submit_talk() { //つぶやき投稿のための関数
	var formData = new FormData();
	var author_sysid=window.sessionStorage.getItem(['sysid']);
	formData.append('file','none');
	if ($("input[name='input_themeimg']").val()!== '') {
    	files = $("input[name='input_themeimg']").prop("files");
    	formData.append('file',files[0]);
  	}
	title = $('#talk_title').val();
	comment = $('#talk_comment').val();
	formData.append('title',title);
	formData.append('comment',comment);
	formData.append('author_sysid',author_sysid);
	$.ajax({
       	url: 'submit',
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(){
       		sysalert2('投稿しました');
       		close_obj('#writing_pad');
       		$('#talk_title').val('');
       		$('#talk_comment').val('');
       		$('#submit_talk_file').val('');
       	},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			alert('Error : ' + errorThrown);
		}
   	});
   	
}

function submit_comment() { //つぶやきに対するコメントのための関数
	var formData = new FormData();
	var author_sysid =  window.sessionStorage.getItem(['sysid']);
	var hash = window.sessionStorage.getItem(['hash']);
	formData.append('file','none');
	theme_sysid = window.sessionStorage.getItem(['now_viewing']);
	comment = $('#guest_talk_comment').val();
	imgpass = 'none';
	if ($("input[name='input_commentimg']").val()!== '') {
    	files = $("input[name='input_commentimg']").prop("files");
    	formData.append('file',files[0]);
  	}
  	formData.append('sysid',theme_sysid);
  	formData.append('comment',comment);
  	formData.append('author_sysid',author_sysid);
  	formData.append('hash',hash);
	$.ajax({
       	url: 'submit_comment',
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(data){
       		console.log(data);
		},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			sysalert1('Error : ' + errorThrown);
		}
   	});
	var ID = window.sessionStorage.getItem(['ID']);
	var commenter_img_path = window.sessionStorage.getItem(['img']);
   	var chattable = $('#talk_chattable');
	var tr = $('<tr>');
	tr.addClass('comment');
	var commenter_profile = $('<td>').addClass('commenter_profile').attr('valign','top');
	var commenter_img = $('<img>');
	commenter_img.addClass('commenter_img').attr('src','../img/'+commenter_img_path).appendTo(commenter_profile);
	commenter_profile.appendTo(tr);
	var comment = $('<td>');
	comment.html('<small style="font-size:10;">date : '+'...'+'　　ID : '+ID+'</small>'+'<br>');
	comment.append('<p>'+'Sending ...'+'</p>').addClass('commentbox').attr({valign : 'top'}).appendTo(tr);
	tr.appendTo(chattable);
	
   	$('#guest_talk_comment').val('');
   	$("input[name='input_commentimg']").val('');
}

function talk_back(){ //つぶやきタイトル一覧に戻る際につぶやき内容をクリーンする
	close_obj('#talk_template');
	$('#writing_pad_openbutton').animate({'opacity' : 1},800);
	$('#talk_title_list').animate({'opacity' : 1},800);
	$('#talk_selecter').animate({'opacity' : 1},800);
	$('#guest_talk_comment').val('');
	$("#talk_guest_comment_file").val('');
}

function show_theme(sysid) { //つぶやきの閲覧時につぶやき内容テンプレートをクリーンしつつ新しく選択された内容に更新する関数
	$('#talk_chattable').empty();
	$('#template_title .theme_imagebox').empty();
	$('#writing_pad_openbutton').animate({'opacity' : 0},800);
	$('#talk_title_list').animate({'opacity' : 0},800);
	$('#talk_selecter').animate({'opacity' : 0},800);
	$('body').animate({scrollTop: 0},1000);
	window.sessionStorage.setItem(['now_viewing'],[sysid]);
	open_obj('#talk_template',5);
	$.ajax({
		type : "POST",
		url: "/fetch_theme",
		data: {'sysid':sysid},
		dataType: "json",
		success: function(data, dataType){
			window.sessionStorage.setItem(['test'],['aaa']);
			data_header = data[0];
			comments = data[1];
			members_info = data[2];
			check_no = data[3];
			window.sessionStorage.setItem(['check_no'],check_no);
			console.log(data);
			var temp_sysid = data_header['author'];
			console.log(members_info);
			$('#talk_top_theme_date').text('date : '+data_header['date'].replace(/.000Z/g,'').replace(/T/g,' ')+'　ID : '+members_info[temp_sysid]['ID']);
			$('#talk_top_theme_title').text(data_header['title']);
			$('#talk_author_comment').html('<p>'+data_header['comment']+'</p>');
			var init_imgpass = data_header['title_img'];
			var theme_imagebox = $('#template_title .theme_imagebox');
			var title_image = $('<img>').addClass('title_image');
			if (init_imgpass != 'no_image.png') title_image.attr('src','../img/' + init_imgpass).appendTo(theme_imagebox);
			else title_image.attr('src','../sysimg/no_image.png').appendTo(theme_imagebox);
			theme_imagebox.appendTo(theme_imagebox);
			$.each(comments,function(){
				var line = this;
				temp_sysid = line['commenter_sysid'];
				console.log(line);
				var chattable = $('#talk_chattable');
				var tr = $('<tr>');
				tr.addClass('comment');
				var commenter_profile = $('<td>').addClass('commenter_profile').attr('valign','top');
				var commenter_img = $('<img>');
				commenter_img.addClass('commenter_img').attr('src','../img/'+members_info[temp_sysid]["img"]).appendTo(commenter_profile);
				commenter_profile.appendTo(tr);
				//'<img class="commenter_img" src="../img/'+members_info[temp_sysid]["img"]+'"></img>
				var comment = $('<td>');
				if(temp_sysid == '0000000000'){
					comment.html('<small style="font-size:10;">date : '+line['date']+'　　ID : '+line['hash']+' (Guest)</small>'+'<br>');
				}else{
					comment.html('<small style="font-size:10;">date : '+line['date']+'　　ID : '+members_info[temp_sysid]['ID']+'</small>'+'<br>');
				}
				if (line['imgpass'] != 'no_image.png') comment.append('<img class="comment_img" src="../img/'+line['imgpass']+'"></img>');
				comment.append('<p>'+line['comment']+'</p>').addClass('commentbox').attr({valign : 'top'}).appendTo(tr);
				tr.appendTo(chattable);
			});
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert('showtheme_Error : ' + errorThrown);
		}
	});
	var check_theme_timer = setInterval(function() {
		check_theme();
	},3000);
}

function re_show_theme(sysid) {  //check_themeで使っている関数
		$.ajax({
		type : "POST",
		url: "/fetch_theme",
		data: {'sysid':sysid},
		dataType: "json",
		success: function(data, dataType){
			
			comments = data[1];
			var members_info = data[2];
			var chattable = $('#talk_chattable');
			chattable.empty();
			$.each(comments,function(){
				var line = this;
				temp_sysid = line['commenter_sysid'];
				console.log(line);
				var tr = $('<tr>');
				tr.addClass('comment');
				var commenter_profile = $('<td>').addClass('commenter_profile').attr('valign','top');
				var commenter_img = $('<img>');
				commenter_img.addClass('commenter_img').attr('src','../img/'+members_info[temp_sysid]["img"]).appendTo(commenter_profile);
				commenter_profile.appendTo(tr);
				//'<img class="commenter_img" src="../img/'+members_info[temp_sysid]["img"]+'"></img>
				var comment = $('<td>');
				if(temp_sysid == '0000000000'){
					comment.html('<small style="font-size:10;">date : '+line['date']+'　　ID : '+line['hash']+' (Guest)</small>'+'<br>');
				}else{
					comment.html('<small style="font-size:10;">date : '+line['date']+'　　ID : '+members_info[temp_sysid]['ID']+'</small>'+'<br>');
				}
				
				if (line['imgpass'] != 'no_image.png') comment.append('<img class="comment_img" src="../img/'+line['imgpass']+'"></img>');
				comment.append('<p>'+line['comment']+'</p>').addClass('commentbox').attr({valign : 'top'}).appendTo(tr);
				tr.appendTo(chattable);
			});
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			alert('showtheme_Error : ' + errorThrown);
		}
	});
}

function check_theme() { //新しいコメントをチェックするのに一定時間ごとにデータベースにアクセスする仕組みになってる。ちょっとこれは直さないとまずい
	var sysid = window.sessionStorage.getItem(['now_viewing']);
	var check_no = window.sessionStorage.getItem(['check_no']);
	var formData = new FormData();
	formData.append('sysid',sysid);
	formData.append('check_no',check_no);
	$.ajax({
       	url: '/check_theme',
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(data){
       		if (check_no != data) {
       			console.log('ok!');
       			window.sessionStorage.setItem(['check_no'],data);
       			re_show_theme(sysid);
       		}
       	},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			alert('Error : ' + errorThrown);
		}	
	});
}

function reload_talk() { // reloadボタンを押した時に呼ばれる関数。つぶやきタイトルリストを読み込み直す
	window.sessionStorage.setItem(['talk_no'],0);
	talk_list('begin');
}

function talk_list(mode) { // 全てのつぶやきをデータベースから取ってきて表示する関数。アクセス時一番最初に呼ばれる関数でもある
	formData = new FormData();
	formData.append('mode',mode);
	talk_no = window.sessionStorage.getItem(['talk_no']);
	formData.append('talk_no',talk_no);
	$.ajax({
       	url: '/talk_list',
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(data){
       		data = JSON.parse(data);
       		$('#talk_title_list').empty();
       		talk_no = data[0];
       		window.sessionStorage.setItem(['talk_no'],talk_no);
       		var talks = data[1];
			var members_info = data[2];
			$.each(talks,function(){
				talk = this;
				console.log(talk);
				author_id = talk['author'];
				init_imgpass = talk['title_img'];
				var theme = $('<div>');
				theme.attr('onclick',"show_theme("+"'"+talk['sysid']+"'"+")");
				theme.addClass('theme');
				var theme_imagebox = $('<div>').addClass('theme_imagebox');
				var title_image = $('<img>').addClass('title_image');
				if (init_imgpass != 'no_image.png') title_image.attr('src','../img/' + init_imgpass).appendTo(theme_imagebox);
				else title_image.attr('src','../sysimg/no_image.png').appendTo(theme_imagebox);
				theme_imagebox.appendTo(theme);
				var theme_titlebox = $('<div>');
				author = members_info[author_id][0]['ID'];
				date = talk['date'].replace('T',' ');
				date = date.replace('.000Z','');
				theme_titlebox.append('<small>'+'date : '+date+'　　ID : '+author+'</small>'+talk['title']).addClass('theme_titlebox').appendTo(theme);
				theme.appendTo('#talk_title_list');
				console.log(members_info);
			});
       	},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			sysalert1('Error : ' + errorThrown);
		}
   	});
}

