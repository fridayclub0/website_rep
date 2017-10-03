function sysalert1(text){
	var alertbox = $('#alert_box1');
	alertbox.text(text).animate({
		'opacity' : 1,
		'left' : 0
	},500);
	
	setTimeout(function(){
		alertbox.animate({
			'opacity' : 0,
			'left' : '-200%'
		},500);
	},2000);
}

function sysalert2(text){
	var alertbox = $('#alert_box2');
	alertbox.text(text).animate({
		'opacity' : 1,
		'left' : 0
	},500);
	
	setTimeout(function(){
		alertbox.animate({
			'opacity' : 0,
			'left' : '-200%'
		},500);
	},2000);
}

function broadcast_message(message) {
	var data = ['message',message];
	ws.send(data);
}
