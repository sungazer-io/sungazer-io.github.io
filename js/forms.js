//Contact Form
$('.contact-form').submit(function(e){
	var form = $(this);
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url : 'https://hooks.zapier.com/hooks/catch/3093476/kqum9f/',
		data: form.serialize(),
		success: function(data){
			form.find('.form-message').html('<span class="text-success send-true">Your email was sent!</span>').fadeIn();
			form.find('.btn').prop('disabled', true);						
			if ($(data).is('.send-true')){
				setTimeout(function(){
					form.trigger('reset');						
					form.find('.btn').prop('disabled', false);						
					form.find('.form-message').fadeOut().delay(500).queue(function(){
					form.find('.form-message').html('').dequeue();
					});
				}, 2000);
			} else {
				form.find('.btn').prop('disabled', false);
			}
		}
	});
});

//Notify Me
function resetForm(e){
	isSend = true;
	if(e.keyCode !== 13){
		resetFormError($('.text-danger'));
		$(this).off('keydown');
	}else{
		$('.notify-me').trigger('submit');
	}
}

function resetFormError(message, interval){
  	interval = interval || 500;
  	message.fadeOut(interval);
		setTimeout(function(){
			message.removeClass('text-danger');
			newQuery = true;
		}, interval);
}

var isSend = true;
var newQuery = true;

$('.notify-me').submit(function(e){
	var form           = $(this),
		message        = form.find('.form-message'),
		messageSuccess = 'Your email has been sent',
		messageInvalid = 'Please enter a valid email address',
		messageSigned  = 'This email is already signed',
		messageErrore  = 'Error request';
	e.preventDefault();
	if(isSend === false){
		isSend = true;
		resetFormError(message);
		return;
	}
	if(newQuery){
		newQuery = false;
    	$.ajax({
			url     : 'php/notify-me.php',
			type    : 'POST',
			data    : form.serialize(),
			success : function(data){
				form.find('.btn').prop('disabled', true);
				message.removeClass('text-danger').removeClass('text-success').fadeIn();
				switch(data) {
					case 0:
						message.html(messageSuccess).addClass('text-success').fadeIn();
						setTimeout(function(){
							message.removeClass('text-success').fadeOut(10);
							newQuery = true;
						}, 3000);
						setTimeout(function(){
							form.trigger('reset');
							message.fadeOut().delay(500).queue(function(){
								message.html('').dequeue();
								newQuery = true;
							});
						}, 2000);
						break;
					case 1:
						message.html(messageInvalid).addClass('text-danger').fadeIn();
						 $('.form-control').on('keydown',resetForm);
						 // $('.form-control').css('color',"#fd6967");
						 isSend = false;
						break;
					case 2:
						message.html(messageSigned).addClass('text-danger').fadeIn();
						setTimeout(function(){
							form.trigger('reset');
							message.queue(function(){
								message.html('').dequeue();
							});
							newQuery = true;
						}, 2000);
						break;
					default:
						message.html(messageErrore).addClass('text-danger').fadeIn();
				}
				form.find('.btn').prop('disabled', false);
			}
		});
	}
});