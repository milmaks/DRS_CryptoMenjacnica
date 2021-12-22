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
			url: '/register',
			data: $('#signup_form').serialize(),
			type: 'POST',
			success: function(response){
				window.location.href = '/logIn'
			},
			error: function(error){
				window.location.href = '/register'
			}
		});
	});
});
