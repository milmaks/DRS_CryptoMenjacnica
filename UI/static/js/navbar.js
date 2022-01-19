$(document).ready(function(){
	$('#logOut').click(function(){
		document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.location.href = '/logIn'
	});
});

function loadBuyCrypto(){

    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        data: {'cookie' : document.cookie},
        type: 'POST',
        success: function(response){  
            window.location.href = '/buyCrypto';
        },
        error: function(error){
            console.log(error)
            window.location.href = error.responseJSON["redirect"]
        }
    });
}

function loadTradeCrypto(){
    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        data: {'cookie' : document.cookie},
        type: 'POST',
        success: function(response){  
            window.location.href = '/tradeCrypto';
        },
        error: function(error){
            console.log(error)
            window.location.href = error.responseJSON["redirect"]
        }
    });
}