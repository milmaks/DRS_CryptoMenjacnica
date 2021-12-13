$(document).ready(function(){
	$('#butn').click(function(){
		
		$.ajax({
			url: '/register',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
				if(response == "True"){
					console.log(response);
					$('#forma').submit();
					
				}else{
					console.log(response)
				}
			},
			error: function(error){
				console.log(error);
			}
		});
	});

	
});
