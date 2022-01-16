var crypto_array;

$(document).ready(function() {
    $('.js-select2').select2();
    $('#id_error').hide();

    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        data: {'cookie' : document.cookie},
        type: 'POST',
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

function changePrice(){
    if(document.getElementById('cryptocurr').selectedIndex != 0 && document.getElementById('amount').value != ""){
        document.getElementById('price').innerHTML= Math.round((parseFloat(crypto_array[document.getElementById('cryptocurr').selectedIndex - 1][2]) * parseFloat(document.getElementById('amount').value) + Number.EPSILON) * 100) / 100;
        document.getElementById('endPrice').value = parseFloat(document.getElementById('price').innerHTML);
    }
    else{
        document.getElementById('price').innerHTML= "";
        document.getElementById('endPrice').value = "";
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

        if(document.getElementById('card_number').value.includes("•")){
            $('#id_error').show();
			document.getElementById('id_error').innerHTML = "Invalid card number"
            document.getElementById('card_number').focus()
            return
        }
        if(document.getElementById('expiry_date').value.includes("m") || document.getElementById('expiry_date').value.includes("y")){
            $('#id_error').show();
			document.getElementById('id_error').innerHTML = "Enter expiry date"
            document.getElementById('expiry_date').focus()
            return
        }
        if(document.getElementById('ccv').value.includes("•")){
            $('#id_error').show();
			document.getElementById('id_error').innerHTML = "CCV too short"
            document.getElementById('ccv').focus()
            return
        }

		$.ajax({
			url: 'http://127.0.0.1:8000/buyCrypto',
			data: $('#buyCrypto_form').serialize()+ '&' + document.cookie,
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

document.addEventListener('DOMContentLoaded', () => {
    for (const el of document.querySelectorAll("[placeholder][data-slots]")) {
    const pattern = el.getAttribute("placeholder"),
    slots = new Set(el.dataset.slots || "_"),
    prev = (j => Array.from(pattern, (c,i) => slots.has(c)? j=i+1: j))(0),
    first = [...pattern].findIndex(c => slots.has(c)),
    accept = new RegExp(el.dataset.accept || "\\d", "g"),
    clean = input => {
    input = input.match(accept) || [];
    return Array.from(pattern, c =>
    input[0] === c || slots.has(c) ? input.shift() || c : c
    );
    },
    format = () => {
    const [i, j] = [el.selectionStart, el.selectionEnd].map(i => {
    i = clean(el.value.slice(0, i)).findIndex(c => slots.has(c));
    return i<0? prev[prev.length-1]: back? prev[i-1] || first: i; }); el.value=clean(el.value).join``; el.setSelectionRange(i, j); back=false; }; let back=false; el.addEventListener("keydown", (e)=> back = e.key === "Backspace");
        el.addEventListener("input", format);
        el.addEventListener("focus", format);
        el.addEventListener("blur", () => el.value === pattern && (el.value=""));
        }
        });

