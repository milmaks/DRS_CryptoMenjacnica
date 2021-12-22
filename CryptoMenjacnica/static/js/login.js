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
			url: '/logIn',
			data: $('#log_form').serialize(),
			type: 'POST',
			success: function(response){
				window.location.href = response
			},
			error: function(error){
				window.location.href = error
			}
		});
	});
});
