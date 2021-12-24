$(document).ready(function(){

	$('#change').click( function () { 
       $('#changecontainer').empty();
       $('#changecontainer').append(
       '<div>'+
      ' <form method="post" id="change_form">'+
        ' <h1>Create Account</h1>'+
           '<label class="error-msg" id="id_error"> Err msg </label>'+
           '<table style="width:100%">'+
               '<tr style="width:100%">'+
                   '<td style="align-items:left;justify-content: left;">'+
                       '<input type="text" class="first" placeholder="First name" name="first_name" required minlength="2" maxlength="32"/>'+
                   '</td style="align-items:right">'+
                   '<td>'+
                       '<input type="text" class="second" placeholder="Last name" name="last_name" required minlength="2" maxlength="32"/>'+
                   '</td>'+
               '</tr>'+
               '<tr>'+
                   '<td colspan=2>'+
                       '<input type="text" placeholder="Home address" name="address" required/>'+
                   '</td>'+
               '</tr>'+
               '<tr style="width:100%">'+
                   '<td style="align-items:left;justify-content: left;">'+
                       '<input type="text" class="first" placeholder="City" name="town" required/>'+
                   '</td style="align-items:right">'+
                   '<td>'+
                       '<input type="text" class="second" placeholder="Country" name="country" required/>'+
                   '</td>'+
               '</tr>'+
               '<tr>'+
                   '<td colspan=2>'+
                       '<input type="text" placeholder="Phone number" name="phone_number" required/>'+
                   '</td>'+
               '</tr>'+
               '<tr>'+
                   '<td colspan=2>'+
                       '<input type="email" placeholder="Email" name="email" required/>'+
                   '</td>'+
               '</tr>'+
               '<tr>'+
                   '<td colspan=2>'+
                       '<input type="password" placeholder="Password" name="password" required minlength="8" maxlength="32"/>'+
                   '</td>'+
               '</tr>'+
           '</table>'+	
           '</br>'+
           '<button id="butn"  class="buttonH">Change</button>'+
       '</form>'+
   '</div>');
    });
    $('#changecontainer').on("click", "#butn", function (){
        $.ajax({
			url: 'http://127.0.0.1:8000/change',
			data: $('#signup_form').serialize(),
			type: 'PUT',
			success: function(response){
				console.log(response)
				if(response['data'] == 'ok'){
                    $('#changecontainer').empty();
				}else{
                    $('#changecontainer').empty();		
        		}
			},
			error: function(error){
				console.log(response)
                $('#changecontainer').empty();
			}
		});
    });
});