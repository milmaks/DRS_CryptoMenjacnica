$(document).ready(function(){
	$("#log_form").validate();

	$('#log_form input').on('keyup blur', function () { // fires on every keyup & blur
        if ($('#log_form').valid()) {                   // checks form for validity
            $('#login').prop('disabled', false);        // enables button
        } else {
            $('#login').prop('disabled', 'disabled');   // disables button
        }
    });
});

$(document).ready(function(){
	$('#login').click(function(){
		event.preventDefault();
		$.ajax({
			url: 'http://127.0.0.1:8000/logIn',
			data: $('#log_form').serialize(),
			type: 'POST',
			success: function(response){
				if(response['data'] =="ok"){
					console.log(response)
					window.location.href = 'index.html'
				}else{
					console.log(response)
					window.location.href = 'login.html'
				}
			},
			error: function(error){

				console.log(error)
				window.location.href = 'login.html'
			}
		});
	});
});
