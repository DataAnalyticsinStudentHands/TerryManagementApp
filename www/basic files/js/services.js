//to store a json file in a variable:
var cjson = (function () {
    var cjson = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "json/events.json",
        'dataType': "json",
        'success': function (data) {
            cjson = data;
        }
    });
    return cjson;
})(); 

//loads the generic full calendar
$(document).ready(function() {
	
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			defaultDate: '2014-06-12',
            editable: true,
            //allows the events to be draggable (true) or not(false). 
			events: cjson //events are in json file
		
	       });
});