// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function() {

	initialize();
	var map;
	var lat;
	var lng;

	function initialize() {
	    var mapOptions = {
			center: { lat: 0.0, lng: 0.0},
	  		zoom: 2
		};
		
		map = new google.maps.Map(document.getElementById("location"), mapOptions);
	}

	google.maps.event.addListener(map, "dblclick", function(event) {

    	lat = event.latLng.lat();
    	lng = event.latLng.lng();

    	coordinates = {'latitude': lat,
    				   'longitude': lng };
    
    	$.ajax({
			type: "POST",
			url: "http://localhost:3000/weather",
			data: coordinates,
			success: function(){console.log("OK")},
			error: function(){console.log("WRONG")},
			dataType: "json"
		}); 

		alert(coordinates['latitude'] + ',' + coordinates['longitude']);
	});
});

