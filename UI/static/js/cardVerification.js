$(document).ready(function(){
    $('#id_error').hide();

	$('#logOut').click(function(){
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.location.href = '/logIn'
	});

    $('#butnHome').click(function(){
    window.location.href = '/'
    });
    $('#butnVerify').click(function(){
        event.preventDefault();
        $.ajax({
			url: 'http://127.0.0.1:8000/verify',
            //xhrFields: { withCredentials: true },
			data: $('#card_form').serialize(),
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
});
