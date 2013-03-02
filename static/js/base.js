alert('wewe2');

d = new Date();
day = d.getDate() + ''; // coarse to string
month = d.getMonth() + 1 + ''; // coarse to string

day = day.length == 1 ? '0' + day : day;
month = month.length == 1 ? '0' + month: month;
var CURRENT_TIME = month + day;


function build_menu_list(menu) {
    result = "<ul>";
    for(var i = 0; i < menu.length; ++i) {
        result = result.concat('<li>');
        result = result.concat(menu[i]);
        result = result.concat('</li>');
    }
    return result;
}

$.ajax({
    url: "menu/" + CURRENT_TIME + "/morning",
    beforeSend: function ( xhr ) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
}).done(function ( data ) {
        var json = JSON.parse(data);
        $.each(json.data, function (i, result) {

            var html = build_menu_list(result.menu);
            // Render it
            $('#morning').html(html);
        });

    });


//////////////////////////////////////////
// Dinner ///////////////////////////////
$.ajax({
    url: "menu/" + CURRENT_TIME + "/dinner",
    beforeSend: function ( xhr ) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
}).done(function ( data ) {
        var json = JSON.parse(data);
        $.each(json.data, function (i, result) {

            var html = build_menu_list(result.menu);
            // Render it
            $('#dinner').html(html);
        });

    });