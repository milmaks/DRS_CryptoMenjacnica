$(document).ready(function() {
    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/getUserCrypto',
        data: {'cookie' : document.cookie},
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
            window.location.href = error.responseJSON["redirect"]
        }
    });

});