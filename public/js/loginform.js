function set_handlename() {
	var input_handlename = $('#handlename');
	var handlename = input_handlename.val();
	window.sessionStorage.setItem(['hash'],handlename);
	sysalert2('Updated !');
}

function upload_ID() {
	var formData = new FormData();
	var ID = $('#profile_ID').val();
	var sysid = window.sessionStorage.getItem(['sysid']);
	formData.append('sysid',sysid);
	formData.append('mode','ID');
	formData.append('id',ID);
	$.ajax({
       	url: '/upload_profile',
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(data){
       		sysalert2('Uploaded !');
       		console.log(data);
       	},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			alert('Error : ' + errorThrown+textStatus+XMLHttpRequest);
		}
   	});
}
function upload_selfintro() {
	var formData = new FormData();
	var selfintro = $('#profile_textarea').val();
	var sysid = window.sessionStorage.getItem(['sysid']);
	formData.append('sysid',sysid);
	formData.append('mode','selfintro');
	formData.append('selfintro',selfintro);
	$.ajax({
       	url: '/upload_profile',
       	type: "POST",
       	contentType: false,
       	processData: false,
       	cache: false,
       	data: formData,
       	success: function(data){
       		sysalert2('Uploaded !');
       		console.log(data);
       	},
       	error: function(XMLHttpRequest,textStatus,errorThrown){
			alert('Error : ' + errorThrown);
		}
   	});
}
function upload_img(){
	var formData = new FormData();
	var profileimg_file = $('#profileimg_file');
	var sysid = window.sessionStorage.getItem(['sysid']);
	formData.append('sysid',sysid);
	formData.append('mode','img');
	if (profileimg_file.val() !== '') {
    	files = profileimg_file.prop("files");
    	formData.append('file',files[0]);
    } else {
   		sysalert1('Input imagefile !');
    }
    $.ajax({
    	url : '/upload_profile',
    	type : 'POST',
    	contentType : false,
    	processData : false,
    	cache : false,
    	data : formData,
    	success : function(data){
    		img = data;
    		console.log(img);
    		sysalert2('Uploaded !');
    		profile_img = $('#profile_img');
    		profile_img.empty();
    		profile_img.attr('src','../img/' + img);
    	},
    	error : function(XMLHttpRequest,textStatus,errorThrown){
    		alert(errorThrown);
    	}
    });
}


function confirm2(){
	var sysid = window.sessionStorage.getItem(['sysid']);
	var pass = $('#confirm_pass').val();
	$.ajax({
			type : "POST",
			url: "/confirm2",
			data: {'sysid':sysid,'pass':pass},
			dataType: "text",
			success: function(data, dataType){
				if(data == 'failed') sysalert1('Input correct password !');
				else {
					sysalert1('Welcome to hagulumaBlog !');
				        var timeid = setInterval(function() {
					    location.href = "https://haguluma.com";					    
					},3000);
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				sysalert1('Error : ' + errorThrown);
			}
		});
}

function registmember(){
        sysalert2('Proceeding ...');
	var mail = $('#res_mail').val();
	var pass = $('#res_pass').val();
	if (mail == '' || pass == ''){
		sysalert1('Please input User Id and Password.');
	}else{
		$.ajax({
			type : "POST",
			url: "/registmember",
			data: {'mail':mail,'pass':pass},
			dataType: "text",
			success: function(data, dataType){
				if(data == 'failed')alert('This User Id already used.');
				else{
					sysalert1('I sended e-mail. Please check it !');
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				sysalert1('Error : ' + errorThrown);
			}
		});
	}
}

function trylogin(){
	var mail = $('#login_mail').val();
	var pass = $('#login_pass').val();
	$.ajax({
			type : "POST",
			url: "/trylogin",
			data: {'mail':mail,'pass':pass},
			dataType: "json",
			success: function(data, dataType){
				var profile_data = data[0]['profile'];
				if (data[0]['login'] == 'success'){
					sysalert2('Wellcome !');
					$('#profile').animate({
						'opacity' : 1
					},500);
					var ID = profile_data['ID'];
					var img = profile_data['img'];
					//broadcast_message(ID+'さんがログインしました');
					window.sessionStorage.setItem(['sysid'],profile_data['sysid']);
					window.sessionStorage.setItem(['ID'],ID);
					window.sessionStorage.setItem(['img'],img);
					var self_intro=profile_data['profile'];
					$('#profile_ID').val(ID);
					var profile_img = $('#profile_img');
					if (img != 'no_image.png') profile_img.attr('src','../img/' + img);
					else profile_img.attr('src','../sysimg/no_image.png');
					$('#profile_textarea').val(self_intro);
				}else{
					sysalert1('Please input correct email address and password !');
				}
			},
			error: function(XMLHttpRequest,textStatus,errorThrown){
				sysalert1('Error : ' + errorThrown);
			}
		});
	
}
