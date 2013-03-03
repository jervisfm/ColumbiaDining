/* Javascript equivalent of Printf: Based on this web resource
 * http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

d = new Date();
day = d.getDate() + ''; // coerce to string
month = d.getMonth() + 1 + ''; // coerce to string

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

function build_menu_at_location(location) {
    var template = '<h3> John Jay </h3> \
        <hr/> \
        <div class="large-6 columns"> \
            <div> \
                <h4>Morning (Brunch / Lunch)</h4> \
                <div id="morning">%s </div> \
            </div> \
        </div> \
        <div class="large-6 columns"> \
        <div> \
            <h4>Dinner</h4> \
            <div id="dinner"> %s</div> \
        </div> \
        </div>';


    morning_menu = get_morning_menu(location);
    dinner_menu = get_dinner_menu(location);

    return template.format(morning_menu, dinner_menu);
}

function get_morning_menu(location) {
    location = location.length > 0 ? location : "";
    var api_url = "menu/" + CURRENT_TIME + "/morning/" + location;
    $.ajax({
        url: api_url,
        beforeSend: function ( xhr ) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function ( data ) {
            var json = JSON.parse(data);
            $.each(json.data, function (i, result) {

                var html = build_menu_list(result.menu);
                // Render it
                //$('#morning').html(html);
                return html;
            });

        });
}

function get_dinner_menu(location) {
    location = location.length > 0 ? location : "";
    var api_url = "menu/" + CURRENT_TIME + "/dinner/" + location;
    $.ajax({
        url: api_url,
        beforeSend: function ( xhr ) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function ( data ) {
            var json = JSON.parse(data);
            $.each(json.data, function (i, result) {

                var html = build_menu_list(result.menu);

                return html;
            });
    });
}

$(document).ready(function() {
    alert('done wewe2');
});