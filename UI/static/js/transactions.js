var crypto_array, user_crypto_array, currentValue, approveTransaction = false;

var transaction_array

$(document).ready(function () {
    $('.js-select2').select2();
    $('#id_error').hide();
    $('#message').hide();
    $('#table_empty').hide();
    $('#transaction_table').hide();
    load_transactions();
    var crypto_array_temp;
    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        data: { 'cookie': document.cookie },
        type: 'POST',
        success: function (response) {
            crypto_array = response['data'].split("],");
            for (let i = 0; i < crypto_array.length; i++) {
                crypto_array[i] = crypto_array[i].replace('[', '');
                crypto_array[i] = crypto_array[i].replace('[', '');
                crypto_array[i] = crypto_array[i].replace(']', '');
                crypto_array[i] = crypto_array[i].replace(']', '');
                crypto_array[i] = crypto_array[i].replace(' ', '');
            }
            for (let i = 0; i < crypto_array.length; i++) {
                crypto_array[i] = crypto_array[i].split(',');
            }
            for (let i = 0; i < crypto_array.length; i++) {
                for (let j = 0; j < 2; j++) {
                    crypto_array[i][j] = crypto_array[i][j].replace('"', '');
                    crypto_array[i][j] = crypto_array[i][j].replace('"', '');
                }
            }

            for (let i = 0; i < crypto_array.length; i++) {
                // Create a DOM Option and pre-select by default
                var newOption = new Option(crypto_array[i][1] + "(" + crypto_array[i][0] + ")", crypto_array[i][0], false, false);
                // Append it to the select
                //$('#user_cryptocurr').append(newOption).trigger('change');
                $('#cryptocurr').append(newOption).trigger('change');

            }

            crypto_array_temp = crypto_array;

            $.ajax({
                url: 'http://127.0.0.1:8000/getUserCrypto',
                data: document.cookie,
                type: 'POST',
                success: function (response) {
                    user_crypto_array = response['json_c'];

                    console.log(crypto_array)
                    for (let i = 0; i < crypto_array_temp.length; i++) {
                        // Create a DOM Option and pre-select by default
                        if (user_crypto_array[crypto_array_temp[i][0]] != "NULL") {
                            var newOption = new Option(crypto_array_temp[i][1] + "(" + crypto_array_temp[i][0] + ")", crypto_array_temp[i][0], false, false);
                            // Append it to the select
                            $('#user_cryptocurr').append(newOption).trigger('change');
                        }

                    }
                },
                error: function (error) {
                    console.log(error)
                    window.location.href = error.responseJSON["redirect"]
                }
            });

        },
        error: function (error) {
            console.log(error);
            //window.location.href = error.responseJSON["redirect"];
        }
    });



});


function changeMessage() {
    let id = "";
    let amount = 0;
    console.log(document.getElementById('user_cryptocurr').value)
    if (document.getElementById('user_cryptocurr').selectedIndex != 0 && document.getElementById('amount').value != "" && document.getElementById('reciever_email').value != "") {
        amount = parseFloat(document.getElementById('amount').value);
        let gas = 0.05 * amount;
        let usr = document.cookie.substring(9);
        if(document.getElementById('reciever_email').value != usr)
        {
            if (parseFloat(user_crypto_array[document.getElementById('user_cryptocurr').value]) >= amount + gas) {
                for (let i = 0; i < crypto_array.length; i++) {
                    if (crypto_array[i][0] == document.getElementById('user_cryptocurr').value) {
                        currentValue = parseFloat(crypto_array[i][2]);
                        id = crypto_array[i][0];
                        break;
                    }
                }
                document.getElementById('message').innerHTML = "By proceeding with this you will send your " + amount + " " + id + "'s " +
                    " to user " + document.getElementById('reciever_email').value + ". " + "\n" + "Gas costs will be included: " + gas + ". " + "\nTotal: " + amount + gas;
                approveTransaction = true;
            }
            else {
                document.getElementById('message').innerHTML = "WARNING: You dont have enought funds, u have " + parseFloat(user_crypto_array[crypto_array[userSelected][0]]) + crypto_array[userSelected][1];
                approveTransaction = false;
            }
        }
        else{
            document.getElementById('message').innerHTML = "WARNING: You cannot make transactions to yourself";
                approveTransaction = false;
        }
        
    }
    else {
        document.getElementById('message').innerHTML = "";
        approveTransaction = false;
    }
    $('#message').show();
}


$(document).ready(function () {
    $('#start_transaction').click(function () {
        event.preventDefault();
        if (approveTransaction) {
            $.ajax({
                url: 'http://127.0.0.1:8000/makeTransaction',
                data: $('#transaction_form').serialize() + '&' + document.cookie + '&currentValue=' + currentValue,
                type: 'POST',
                success: function (response) {
                    console.log(response);
                    if (response != "")
                        window.location.href = response["redirect"];
                },
                error: function (error) {
                    console.log(error);
                    document.getElementById('message').innerHTML = "There is no user with specified Email";
                }
            });
        }
    });
});

function load_transactions() {
    let optType = document.getElementById('transactionType').value;
    var table = document.getElementById("transaction_table");
    console.log(optType);
    if (optType == "All transactions") {
        $.ajax({
            url: 'http://127.0.0.1:8000/getTransactions',
            data: $('#transaction_form').serialize() + '&' + document.cookie,
            type: 'POST',
            success: function (response) {
                if (response['data'] == "[]") {
                    $('#table_empty').show();
                    $('#transaction_table').hide();
                }
                else {
                    $('#table_empty').hide();
                    console.log(response);
                    transaction_array = response['data'].split("],");
                    for (let i = 0; i < transaction_array.length; i++) {
                        transaction_array[i] = transaction_array[i].replace('[', '');
                        transaction_array[i] = transaction_array[i].replace('[', '');
                        transaction_array[i] = transaction_array[i].replace(']', '');
                        transaction_array[i] = transaction_array[i].replace(']', '');
                        transaction_array[i] = transaction_array[i].replace(' ', '');
                    }
                    for (let i = 0; i < transaction_array.length; i++) {
                        transaction_array[i] = transaction_array[i].split(',');
                    }
                    for (let i = 0; i < transaction_array.length; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 1) {
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                            }
                            if (transaction_array[i][j].includes(' "')) {
                                transaction_array[i][j] = transaction_array[i][j].replace(' "', '');
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                            }
                            else if (transaction_array[i][j].includes(' ')) {
                                transaction_array[i][j] = transaction_array[i][j].replace(' ', '');
                                transaction_array[i][j] = transaction_array[i][j].replace(' ', '');
                            }
                        }
                    }
                    $('#transaction_table tr:not(:first)').remove();
                    
                    for (var i = 1; i <= transaction_array.length; i++) {
                        var newRow = table.insertRow(i);
                        for (var j = 1; j < 7; j++) {
                            var cell = newRow.insertCell(j - 1);

                            cell.innerHTML = transaction_array[i - 1][j];
                        }
                    }

                    $('#transaction_table').show();
                }

                //console.log(response);
                //window.location.href = "/transactions";
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    else if (optType == "Sent") {
        $.ajax({
            url: 'http://127.0.0.1:8000/getTransactionsAsSender',
            data: $('#transaction_form').serialize() + '&' + document.cookie,
            type: 'POST',
            success: function (response) {
                if (response['data'] == "[]") {
                    $('#table_empty').show();
                    $('#transaction_table').hide();
                }
                else {
                    $('#table_empty').hide();
                    console.log(response);
                    transaction_array = response['data'].split("],");
                    for (let i = 0; i < transaction_array.length; i++) {
                        transaction_array[i] = transaction_array[i].replace('[', '');
                        transaction_array[i] = transaction_array[i].replace('[', '');
                        transaction_array[i] = transaction_array[i].replace(']', '');
                        transaction_array[i] = transaction_array[i].replace(']', '');
                        transaction_array[i] = transaction_array[i].replace(' ', '');
                    }
                    for (let i = 0; i < transaction_array.length; i++) {
                        transaction_array[i] = transaction_array[i].split(',');
                    }
                    for (let i = 0; i < transaction_array.length; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 1) {
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                            }
                            if (transaction_array[i][j].includes(' "')) {
                                transaction_array[i][j] = transaction_array[i][j].replace(' "', '');
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                            }
                            else if (transaction_array[i][j].includes(' ')) {
                                transaction_array[i][j] = transaction_array[i][j].replace(' ', '');
                                transaction_array[i][j] = transaction_array[i][j].replace(' ', '');
                            }
                        }
                    }
                    $('#transaction_table tr:not(:first)').remove();

                    for (var i = 1; i <= transaction_array.length; i++) {
                        var newRow = table.insertRow(i);
                        for (var j = 1; j < 7; j++) {
                            var cell = newRow.insertCell(j - 1);

                            cell.innerHTML = transaction_array[i - 1][j];
                        }
                    }

                    $('#transaction_table').show();
                }

            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    else {
        $.ajax({
            url: 'http://127.0.0.1:8000/getTransactionsAsReciever',
            data: $('#transaction_form').serialize() + '&' + document.cookie,
            type: 'POST',
            success: function (response) {
                if (response['data'] == "[]") {
                    $('#table_empty').show();
                    $('#transaction_table').hide();
                }
                else {
                    $('#table_empty').hide();
                    console.log(response);
                    transaction_array = response['data'].split("],");
                    for (let i = 0; i < transaction_array.length; i++) {
                        transaction_array[i] = transaction_array[i].replace('[', '');
                        transaction_array[i] = transaction_array[i].replace('[', '');
                        transaction_array[i] = transaction_array[i].replace(']', '');
                        transaction_array[i] = transaction_array[i].replace(']', '');
                        transaction_array[i] = transaction_array[i].replace(' ', '');
                    }
                    for (let i = 0; i < transaction_array.length; i++) {
                        transaction_array[i] = transaction_array[i].split(',');
                    }
                    for (let i = 0; i < transaction_array.length; i++) {
                        for (let j = 0; j < 7; j++) {
                            if (j == 1) {
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                            }
                            if (transaction_array[i][j].includes(' "')) {
                                transaction_array[i][j] = transaction_array[i][j].replace(' "', '');
                                transaction_array[i][j] = transaction_array[i][j].replace('"', '');
                            }
                            else if (transaction_array[i][j].includes(' ')) {
                                transaction_array[i][j] = transaction_array[i][j].replace(' ', '');
                                transaction_array[i][j] = transaction_array[i][j].replace(' ', '');
                            }
                        }
                    }
                    $('#transaction_table tr:not(:first)').remove();

                    for (var i = 1; i <= transaction_array.length; i++) {
                        var newRow = table.insertRow(i);
                        for (var j = 1; j < 7; j++) {
                            var cell = newRow.insertCell(j - 1);

                            cell.innerHTML = transaction_array[i - 1][j];
                        }
                    }

                    $('#transaction_table').show();
                }

            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}