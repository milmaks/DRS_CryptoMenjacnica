var crypto_array, user_crypto_array, valueOfTrade, tradeAvailabe = false;

$(document).ready(function() {
    $('.js-select2').select2();
    $('#id_error').hide();
    var crypto_array_temp;
    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        data: {'cookie' : document.cookie},
        type: 'POST',
        success: function(response){ 
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

            for (let i = 0; i < crypto_array.length; i++) {
                // Create a DOM Option and pre-select by default
                var newOption = new Option(crypto_array[i][1]+"("+crypto_array[i][0]+")", crypto_array[i][0], false, false);
                // Append it to the select
                //$('#user_cryptocurr').append(newOption).trigger('change');
                $('#cryptocurr').append(newOption).trigger('change');
                
            }

            crypto_array_temp = crypto_array;

            $.ajax({
                url: 'http://127.0.0.1:8000/getUserCrypto',
                data: document.cookie,
                type: 'POST',
                success: function(response){
                    user_crypto_array = response['json_c'];
                    
                    console.log(crypto_array)
                    for (let i = 0; i < crypto_array_temp.length; i++) {
                        // Create a DOM Option and pre-select by default
                        if(user_crypto_array[crypto_array_temp[i][0]] != "NULL"){
                            var newOption = new Option(crypto_array_temp[i][1]+"("+crypto_array_temp[i][0]+")", crypto_array_temp[i][0], false, false);
                            // Append it to the select
                            $('#user_cryptocurr').append(newOption).trigger('change');
                        }
                        
                    } 
                },
                error: function(error){
                    console.log(error)
                    window.location.href = error.responseJSON["redirect"]
                }
            });

        },
        error: function(error){
            console.log(error)
            window.location.href = error.responseJSON["redirect"]
        }
    });

    

});

function changeMessage(){
    var userSelected = 0;
    for (let i = 0; i < crypto_array.length; i++) {
        if(document.getElementById('user_cryptocurr').value == crypto_array[i][0])
            break;
        userSelected+=1;
    }
    console.log(document.getElementById('user_cryptocurr').value)
    console.log(crypto_array[6][0])
    if(document.getElementById('user_cryptocurr').selectedIndex != 0 && document.getElementById('cryptocurr').selectedIndex != 0 && document.getElementById('amount').value != ""){
        if(parseFloat(user_crypto_array[document.getElementById('user_cryptocurr').value]) >= parseFloat(document.getElementById('amount').value)){
            valueOfTrade = Math.round(((parseFloat(crypto_array[userSelected][2]) * parseFloat(document.getElementById('amount').value) / parseFloat(crypto_array[document.getElementById('cryptocurr').selectedIndex - 1][2])) + Number.EPSILON) * 10000) / 10000;
            document.getElementById('message').innerHTML = "By proceeding with this trade you will trade your's " + 
            document.getElementById('amount').value  + crypto_array[userSelected][1] + 
            " for " + valueOfTrade + " " + crypto_array[document.getElementById('cryptocurr').selectedIndex - 1][1];
            tradeAvailabe = true;
        }
        else{
            document.getElementById('message').innerHTML = "WARNING: You dont have enought funds, u have " + parseFloat(user_crypto_array[crypto_array[userSelected][0]]) + crypto_array[userSelected][1];
            tradeAvailabe = false;
        }
    }
    else{
        document.getElementById('message').innerHTML= "";
        tradeAvailabe = false;
    }
    
}

$(document).ready(function(){
	$("#tradeCrypto_form").validate();

	$('#tradeCrypto_form input').on('keyup blur', function () { // fires on every keyup & blur
        if ($('#tradeCrypto_form').valid()) {                   // checks form for validity
            $('#trade').prop('disabled', false);        // enables button
        } else {
            $('#trade').prop('disabled', 'disabled');   // disables button
        }
    });
});

$(document).ready(function(){
	$('#trade').click(function(){
		event.preventDefault();
        if(tradeAvailabe)
        {
            $.ajax({
                url: 'http://127.0.0.1:8000/tradeCrypto',
                data: $('#tradeCrypto_form').serialize() + '&' + document.cookie + '&valueOfTrade=' + valueOfTrade,
                type: 'POST',
                success: function(response){
                    window.location.href = response["redirect"]
                },
                error: function(error){
                    console.log(error)
                    window.location.href = "/logIn"
                }
            });
        }
	});
});