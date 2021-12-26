var crypto_array;

$(document).ready(function() {
    $('.js-select2').select2();

    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        //data: $('#log_form').serialize(),
        type: 'GET',
        success: function(response){
            //document.cookie = "username=" + response["cookie"]
            console.log(response)
            crypto_array = response['data'].split("],");
            for (let i = 0; i < crypto_array.length; i++) {
                crypto_array[i] = crypto_array[i].replace('[','');
                crypto_array[i] = crypto_array[i].replace('[','');
                crypto_array[i] = crypto_array[i].replace(']','');
                crypto_array[i] = crypto_array[i].replace(']','');
                crypto_array[i] = crypto_array[i].replace(' ','');
            }
            for (let i = 0; i < crypto_array.length; i++) {
                crypto_array[i] = crypto_array[i].split(',');
            }
            for (let i = 0; i < crypto_array.length; i++) {
                for (let j = 0; j < 2; j++) {
                    crypto_array[i][j] = crypto_array[i][j].replace('"','');
                    crypto_array[i][j] = crypto_array[i][j].replace('"','');
                }
            }
            console.log(crypto_array);
            for (let i = 0; i < crypto_array.length; i++) {
                // Create a DOM Option and pre-select by default
                var newOption = new Option(crypto_array[i][1]+"("+crypto_array[i][0]+")", crypto_array[i][0], false, false);
                // Append it to the select
                $('#cryptocurr').append(newOption).trigger('change');
            } 
        },
        error: function(error){
            console.log(error)
        }
    });

});

function changePrice(){
    if(document.getElementById('cryptocurr').selectedIndex != 0 && document.getElementById('amount').value != ""){
        document.getElementById('price').innerHTML= parseFloat(crypto_array[document.getElementById('cryptocurr').selectedIndex - 1][2]) * parseFloat(document.getElementById('amount').value);
    }
    else{
        document.getElementById('price').innerHTML= "";
    }
}

$(document).ready(function(){
	$("#buyCrypto_form").validate();

	$('#buyCrypto_form input').on('keyup blur', function () { // fires on every keyup & blur
        if ($('#buyCrypto_form').valid()) {                   // checks form for validity
            $('#buy').prop('disabled', false);        // enables button
        } else {
            $('#buy').prop('disabled', 'disabled');   // disables button
        }
    });
});

$(document).ready(function(){
	$('#buy').click(function(){
		event.preventDefault();
        document.getElementById('endPrice').value = document.getElementById('price').innerHTML
		$.ajax({
			url: 'http://127.0.0.1:8000/buyCrypto',
			data: $('#buyCrypto_form').serialize(),
			type: 'POST',
			success: function(response){
				window.location.href = response["redirect"]
			},
			error: function(error){
				console.log(error)
				window.location.href = "/logIn"
			}
		});
	});
});

