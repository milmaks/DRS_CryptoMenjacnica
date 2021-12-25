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
				window.location.href = response["redirect"]
			},
			error: function(error){
				console.log(error)
				$('#id_error').content = error.responseJSON['message']
				window.location.href = error.responseJSON['redirect	']
			}
		});
	});
});

/*if(response['data'] == 'ok'){

					$.ajax({
						url: 'http://127.0.0.1:8001/register',
						data: {'data':'ok'},
						type: 'POST',
						success: function(response){
							console.log(response)
							window.location.href = '/'
						},
						error: function(error){
							console.log(response)
							window.location.href = '/logIn'
						}
					});
				}else{
					window.location.href = '/logIn'
				} */