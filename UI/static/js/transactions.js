var crypto_array, user_crypto_array, currentValue, approveTransaction = false;

var transaction_array

$(document).ready(function () {
    $('.js-select2').select2();
    $('#id_error').hide();
    $('#message').hide();
    $('#table_empty').hide();
    $('#transaction_table').hide();
    $('#clear_filter').hide();
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
        let price = amount + gas;
        let usr = document.cookie.substring(9);
        if (document.getElementById('reciever_email').value != usr) {
            if (parseFloat(user_crypto_array[document.getElementById('user_cryptocurr').value]) >= amount) {
                for (let i = 0; i < crypto_array.length; i++) {
                    if (crypto_array[i][0] == document.getElementById('user_cryptocurr').value) {
                        currentValue = parseFloat(crypto_array[i][2]);
                        id = crypto_array[i][0];
                        break;
                    }
                }
                document.getElementById('message').innerHTML = "By proceeding with this you will send your " + amount + " " + id + "'s " +
                    " to user " + document.getElementById('reciever_email').value + ". " + "\n" + "Gas costs will be included: " + gas + ". " + "\nTotal: " + price;
                approveTransaction = true;
            }
            else {
                document.getElementById('message').innerHTML = "WARNING: You dont have enought funds, u have " + parseFloat(user_crypto_array[crypto_array[userSelected][0]]) + crypto_array[userSelected][1];
                approveTransaction = false;
            }
        }
        else {
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

    $('#filter_table').click(function(){
        event.preventDefault();
        let senderMail = document.getElementById('sen').value;
        let recieverMail = document.getElementById('rec').value;
        let currency = document.getElementById('cryptocurr').value;
        let status = document.getElementById('stat').value;
        let amoMin = document.getElementById('amoMin').value;
        let amoMax = document.getElementById('amoMax').value;
        let minAmount = 0;
        let maxAmount = 0;
        if(amoMin != "")
            minAmount = parseFloat(amoMin);
        else
            minAMount = Number.MIN_VALUE;
        if(amoMax != "")
            maxAmount = parseFloat(amoMax);
        else
            maxAmount = Number.MAX_VALUE;
        var res_array = new Array();
        // zapamti niz transakcija
        var temp_array = transaction_array;

        res_array = transaction_array.filter(transaction => transaction[2].includes(senderMail) && transaction[3].includes(recieverMail) &&
                                                transaction[5].includes(currency) && transaction[10].includes(status) && parseFloat(transaction[4]) > minAMount && parseFloat(transaction[4]) < maxAmount);

        // ubaci niz filtriranih u niz transakcija za ispis
        transaction_array = res_array;

        print_table();
        // vrati niz transakcija u prvobitno stanje
        transaction_array = temp_array;

        
        $('#clear_filter').show();

    });

    $('#clear_filter').click(function(){
        event.preventDefault();
        print_table();
        document.getElementById('sen').value = "";
        document.getElementById('rec').value = "";
        document.getElementById('cryptocurr').value = "";
        document.getElementById('stat').value = "";
        document.getElementById('amoMin').value = "";
        document.getElementById('amoMax').value = "";
        $('#clear_filter').hide();
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

                    print_table();

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

                    print_table();

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

                    print_table();

                }

            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}

function sort_transactions() {
    let sort_type = document.getElementById("select_sort").value;
    let order = document.getElementById("sort_order").value;


    if (sort_type == "By Time") {
        j = 9;
    }
    else if (sort_type == "By Sender Email") {
        j = 2;
    }
    else if (sort_type == "By Reciever Email") {
        j = 3;
    }
    else if (sort_type == "By Amount") {
        j = 4;
    }
    else if (sort_type == "By Crypto Currency") {
        j = 5;
    }
    else if (sort_type == "By Gas") {
        j = 7;
    }
    else if (sort_type == "By Total Cost") {
        j = 8;
    }
    else if (sort_type == "By Status") {
        j = 10;
    }

    let n = transaction_array.length;

    if (order == "Ascending") {
        for (let i = 0; i < n; i++) {
            let min = i;
            for (let k = i + 1; k < n; k++) {
                if (j == 4 || j == 7 || j == 8)
                {
                    if (parseFloat(transaction_array[k][j]) < parseFloat(transaction_array[min][j])) {
                        min = k;
                    }
                }
                else{
                    if (transaction_array[k][j] < transaction_array[min][j]) {
                        min = k;
                    }
                }
            }
            if (min != i) {
                let tmp = transaction_array[i];
                transaction_array[i] = transaction_array[min];
                transaction_array[min] = tmp;
            }
        }
    }
    else{
        for (let i = 0; i < n; i++) {
            let min = i;
            for (let k = i + 1; k < n; k++) {
                if (j == 4 || j == 7 || j == 8)
                {
                    if (parseFloat(transaction_array[k][j]) > parseFloat(transaction_array[min][j])) {
                        min = k;
                    }
                }
                else{
                    if (transaction_array[k][j] > transaction_array[min][j]) {
                        min = k;
                    }
                }
            }
            if (min != i) {
                let tmp = transaction_array[i];
                transaction_array[i] = transaction_array[min];
                transaction_array[min] = tmp;
            }
        }
    }


    print_table();

}

function print_table() {
    var table = document.getElementById("transaction_table");

    $('#transaction_table tr:not(:first)').remove();

    for (var i = 1; i <= transaction_array.length; i++) {
        var newRow = table.insertRow(i);
        let id_str = "row";
        let id = id_str.concat(i.toString());
        newRow.id = id;
        document.getElementById(id).style.height = "15px";
        for (var j = 2; j < 11; j++) {
            var cell = newRow.insertCell(j - 2);
            let id_str = "cell";
            let id = id_str.concat(i.toString());
            id = id.concat((j - 2).toString());
            cell.id = id;
            console.log(cell.id);
            document.getElementById(id).style.padding = "5px";
            if (j == 9) {
                transaction_array[i - 1][j] = transaction_array[i - 1][j].replace(' "', '');
                transaction_array[i - 1][j] = transaction_array[i - 1][j].replace('"', '');
            }
            if (j == 10) {
                id_str = "status_cell";
                id = id_str.concat(i.toString());
                id = id.concat((j - 2).toString());
                cell.id = id;
                transaction_array[i - 1][j] = transaction_array[i - 1][j].replace(' "', '');
                transaction_array[i - 1][j] = transaction_array[i - 1][j].replace('"', '');
                if (transaction_array[i - 1][j] == "COMPLETE") {
                    document.getElementById(id).style.color = "green";
                }
                else if (transaction_array[i - 1][j] == "PROCESSING") {
                    document.getElementById(id).style.color = "blue";
                }
                else {
                    document.getElementById(id).style.color = "red";
                }
            }
            cell.innerHTML = transaction_array[i - 1][j];
        }
    }

    if(transaction_array.length == 0){
        $('#transaction_table').hide();
        $('#table_empty').show();
    }
    else{
        $('#table_empty').hide();
        $('#transaction_table').show();
    }

}