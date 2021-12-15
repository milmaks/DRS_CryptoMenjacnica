$(document).ready(function(){
	$('#butn').click(function(){
		event.preventDefault();
		$.ajax({
			url: '/register',
			data: $('form').serialize(),
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
