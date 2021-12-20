$(document).ready(function(){
	$("#signup_form").validate();

	$('#signup_form input').on('keyup blur', function () { // fires on every keyup & blur
        if ($('#signup_form').valid()) {                   // checks form for validity
            $('#butn').prop('disabled', false);        // enables button
        } else {
            $('#butn').prop('disabled', 'disabled');   // disables button
        }
    });
});

$(document).ready(function(){
	$('#butn').click(function(){
		event.preventDefault();
		$.ajax({
			url: 'http://127.0.0.1:8000/register',
			data: $('#signup_form').serialize(),
			type: 'POST',
			success: function(response){
				console.log(response)
				if(response['data'] == 'ok'){
					window.location.href = 'index.html'
				}else{
					window.location.href = 'login.html'
				}
			},
			error: function(error){
				console.log(response)
				window.location.href = 'login.html'
			}
		});
	});
});
