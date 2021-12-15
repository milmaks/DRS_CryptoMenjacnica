$(document).ready(function(){
	$('#login').click(function(){
		event.preventDefault();
		$.ajax({
			url: '/logIn',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
				window.location.href = response
			},
			error: function(error){
				window.location.href = response
			}
		});
	});
});
