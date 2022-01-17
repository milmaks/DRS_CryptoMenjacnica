var crypto_array;

$(document).ready(function() {

    event.preventDefault();
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        type: 'GET',
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
                for (let j = 0; j < 4; j++) {
                    crypto_array[i][j] = crypto_array[i][j].replace('"','');
                    crypto_array[i][j] = crypto_array[i][j].replace('"','');
                }
            }
            console.log(crypto_array);
            
            var table = document.getElementById("currencyTable");
            var img;
            var row, cell0, cell1, cell2, cell3;
            if(table.rows.length - 1 != crypto_array.length)
            {
                for (let i = 1; i < crypto_array.length + 1; i++){
                    row = table.insertRow(i);
                    cell0 = row.insertCell(0);
                    cell1 = row.insertCell(1);
                    cell2 = row.insertCell(2);
                    cell3 = row.insertCell(3);
                    row.insertCell(4);
                    
                    img = document.createElement('img');
                    img.style = "width: 55px;height: 55px;";
                    img.src = crypto_array[i][3];
                    cell0.appendChild(img);
                    cell1.innerHTML = crypto_array[i][1];
                    cell2.innerHTML = crypto_array[i][0];
                    cell3.innerHTML = crypto_array[i][2];
                    table.rows[i].cells[3].style = "font-weight:bold;";
                }
            }
            else
            {
                for (let i = 0; i < crypto_array.length; i++){
                    table.rows[i].cells[3].innerHTML = crypto_array[i][2];
                    table.rows[i].insertCell(4);
                    table.rows[i].cells[4].innerHTML = "↑";
                }
            }

        },
        error: function(error){
            console.log(error)
            window.location.href = error.responseJSON["redirect"]
        }
    });

});

function periodicMethod(){
    $.ajax({
        url: 'http://127.0.0.1:8000/currency/getall',
        type: 'GET',
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
            console.log(crypto_array);
            
            var table = document.getElementById("currencyTable");
            var row, cell1, cell2, cell3, img;
            if(table.rows.length - 1 != crypto_array.length)
            {
                for (let i = 1; i < crypto_array.length + 1; i++){
                    row = table.insertRow(i);
                    cell0 = row.insertCell(0);
                    cell1 = row.insertCell(1);
                    cell2 = row.insertCell(2);
                    cell3 = row.insertCell(3);
                    row.insertCell(4);
                    
                    img = document.createElement('img');
                    img.style = "width: 55px;height: 55px;";
                    img.src = crypto_array[i][3];
                    cell0.appendChild(img);
                    cell1.innerHTML = crypto_array[i][1];
                    cell2.innerHTML = crypto_array[i][0];
                    cell3.innerHTML = crypto_array[i][2];
                    table.rows[i].cells[3].style = "font-weight:bold;";
                }
            }
            else
            {
                for (let i = 1; i < crypto_array.length + 1; i++){
                    if(parseFloat(table.rows[i].cells[3].innerHTML) != parseFloat(crypto_array[i][2]))
                    {
                        if(parseFloat(table.rows[i].cells[3].innerHTML) < parseFloat(crypto_array[i][2]))
                        {
                            table.rows[i].cells[4].innerHTML = "↑" + table.rows[i].cells[3].innerHTML;
                            table.rows[i].cells[4].style = "font-color: green;color: green; font-weight: bold;";
                            table.rows[i].cells[3].innerHTML = crypto_array[i][2];
                        }
                        else
                        {
                            table.rows[i].cells[4].innerHTML = "↓" + table.rows[i].cells[3].innerHTML;
                            table.rows[i].cells[4].style = "font-color: red;color: red; font-weight: bold;";
                            table.rows[i].cells[3].innerHTML = crypto_array[i][2];
                        }
                    }
                    
                }
            }

        },
        error: function(error){
            console.log(error)
            window.location.href = error.responseJSON["redirect"]
        }
    });
}