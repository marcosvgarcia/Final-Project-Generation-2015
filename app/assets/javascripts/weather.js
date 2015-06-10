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
	  		zoom: 2,
	  		disableDoubleClickZoom: true
		};
		
		map = new google.maps.Map(document.getElementById("location"), mapOptions);
	}

	google.maps.event.addListener(map, "dblclick", function(event) {

    	lat = event.latLng.lat();
    	lng = event.latLng.lng();

    	coordinates = {latitude: lat,
    				   longitude: lng };

    	$.ajax({
			url: "http://localhost:3000/weather",
			data: coordinates,
			success: function(response){console.log("OK"); conditions_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"

		});


		function conditions_ul(current) {

			$("ul").empty();
			
			$("ul").append("<li>LOCATION: " + current.country + ", " + current.city + 
						   "</li><li>TEMPERATURE (ºF): " + current.fahrenheit + 
						   "</li><li>TEMPERATURE (ºC): " + current.celsius + 
						   "</li><li>HUMIDITY: " + current.humidity + 
						   "</li><li>WIND: " + current.wind + 
						   "</li><li>RADIATION: " + current.sun + "</li>" +
						   "</li><li>WATER PRODUCTION: " + current.water_production + "</li>");
		}

	});
});

