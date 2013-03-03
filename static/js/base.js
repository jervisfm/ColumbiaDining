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

function build_menu(morning_menu, dinner_menu, title) {
    var template = '<h3> {2} </h3> \
        <hr/> \
        <div class="large-6 columns"> \
            <div> \
                <h4>Morning (Brunch / Lunch)</h4> \
                <div id="morning">{0} </div> \
            </div> \
        </div> \
        <div class="large-6 columns"> \
        <div> \
            <h4>Dinner</h4> \
            <div id="dinner">{1}</div> \
        </div> \
        </div>';


    return template.format(morning_menu, dinner_menu, title);
}

function get_menu_ajax(location, timeofday, callback) {
    var location = location.length > 0 ? location : "";
    var api_url = "menu/" + CURRENT_TIME + "/" + timeofday +"/" + location;
    $.ajax({
        url: api_url,
        beforeSend: function ( xhr ) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    }).done(function ( data ) {
            var json = JSON.parse(data);
            console.log('get menu async completed. doing callback ...' + data + ' | ' + api_url);
            var html;
            $.each(json.data, function (i, result) {
                html = build_menu_list(result.menu);
                // Render it
                //$('#morning').html(html);
                //return html;
            });
            callback(html);
        });
    console.log('get menu async in progress');
}



function get_dinner_menu(location) {
    var location = location.length > 0 ? location : "";
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

function load_page_ajax() {
    // Load John Jay menu
    console.log('start');
    get_menu_ajax('johnjay', 'morning', function(html) {
        var jj_morn = html;
        get_menu_ajax('johnjay', 'dinner', function(html) {
            var jj_dinner = html;
            console.log('jj-morn is ' + jj_morn);
            console.log('jj-dinner is ' + jj_dinner);
            var jj_menu;
            if (jj_dinner === undefined && jj_morn === undefined)  {
                jj_dinner = jj_morn = 'Not Offered';
            } else if (jj_dinner === undefined) {
                jj_dinner = 'Not Offered';
            } else if (jj_morn === undefined) {
                jj_morn = 'Not Offered';
            }
            jj_menu = build_menu(jj_morn, jj_dinner, 'John Jay');

            console.log('jjmnenu  is ' + jj_menu);
            $('#johnjay').html(jj_menu);
        });
    });

    console.log('done');

    // Load Feris Menu
    get_menu_ajax('ferris', 'morning', function(html) {
       var fer_morn = html;
        get_menu_ajax('ferris', 'dinner', function(html) {
            var fer_dinner = html;
            var fer_menu = build_menu(fer_morn, fer_dinner, 'Ferris Booth');
            $('#ferris').html(fer_menu);
        });
    });
}

$(document).ready(function() {
    load_page_ajax();
    alert('done wewe5');
});