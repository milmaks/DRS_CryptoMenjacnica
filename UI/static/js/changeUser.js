$(document).ready(function(){
	$("#change_form").validate();

	$('#change_form input').on('keyup blur', function () { // fires on every keyup & blur
        if ($('#change_form').valid()) {                   // checks form for validity
            $('#butn').prop('disabled', false);        // enables button
        } else {
            $('#butn').prop('disabled', 'disabled');   // disables button
        }
    });
	$('#id_error').hide();
});

$(document).ready(function(){
    $('#butn').click(function (){
		event.preventDefault();
        $.ajax({
			url: 'http://127.0.0.1:8000/change',
			//xhrFields: { withCredentials: true },
			data: $('#change_form').serialize(),
			type: 'POST',
			success: function(response){
				console.log(response)
				window.location.href = response["redirect"]
			},
			error: function(error){
				console.log(error)
			}
		});
    });
	$('#butnHome').click(function (){
		event.preventDefault();
        window.location.href = '/'
    });
});
