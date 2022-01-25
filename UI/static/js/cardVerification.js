$(document).ready(function(){
    $('#id_error').hide();

	$('#logOut').click(function(){
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.location.href = '/logIn'
	});

    $('#butnVerify').click(function(){
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
			url: endpoint + '/verify',
            //xhrFields: { withCredentials: true },
			data: $('#card_form').serialize() + '&' + document.cookie,
			type: 'POST',
			success: function(response){
				console.log(response)
				window.location.href = response["redirect"]
			},
			error: function(error){
				console.log(error)
                $('#id_error').show();
			    document.getElementById('id_error').innerHTML = error.responseJSON['message']
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
