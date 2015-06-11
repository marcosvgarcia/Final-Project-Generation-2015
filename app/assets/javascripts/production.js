// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function() {

	initialize();

	var map;
	var input;
	var searchBox;
	var lat;
	var lng;

	function initialize() {
	    var mapOptions = {
			center: { lat: 0.0, lng: 0.0},
	  		zoom: 2,
	  		disableDoubleClickZoom: true
		};
		
		map = new google.maps.Map(document.getElementById("location"), mapOptions, {mapTypeId: google.maps.MapTypeId.ROADMAP});

		input = document.getElementById("pac-input");
  
  		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  		searchBox = new google.maps.places.SearchBox(input);
	}

	google.maps.event.addListener(map, "dblclick", function(event) {

    	lat = event.latLng.lat();
    	lng = event.latLng.lng();

    	coordinates = {latitude: lat,
    				   longitude: lng };

    	$.ajax({
			url: "http://localhost:3000/production",
			data: coordinates,
			success: function(response){console.log("OK"); productions_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"

		});


		function productions_ul(monthly) {

			$("ul").empty();
			
			$("ul").append("<li>MONTHLY AVERAGE TEMPERATURE (ºC): " + monthly.monthly_temp + 
						   "</li><li>MONTHLY AVERAGE HUMIDITY: " + monthly.monthly_humidity + 
						   "</li><li><h3>WATER PRODUCTION: " + (monthly_water_production(monthly)) + " L</h3></li>");
		}

		function monthly_water_production(monthly) {

			var k_humidity = (5 * Math.pow(10, -5) * Math.pow(monthly.monthly_humidity, 2)) + (0.013 * h) + 0.0277;

			var k_temperature = (-0.0002 * Math.pow(monthly.celsius, 2)) + (0.0458 * monthly.monthly_temp) - 0.1029;

			var water_litres = k_humidity * k_temperature * 1000 * 30;

			return Math.round(water_litres);
		}

	});

	google.maps.event.addListener(searchBox, 'places_changed', function() {
    	
    	var places = searchBox.getPlaces();

    	if (places.length == 0) {
      		return;
    	}

    	var bounds = new google.maps.LatLngBounds();

    	for (var i = 0, place; place = places[i]; i++) {

      		bounds.extend(place.geometry.location);
    	}

    	map.fitBounds(bounds);

    	latObj = bounds["za"];
    	lat = latObj["A"];

    	lngObj = bounds["qa"];
    	lng = lngObj["A"];

    	coordinates = {latitude: lat,
    				   longitude: lng };

    	$.ajax({
			url: "http://localhost:3000/production",
			data: coordinates,
			success: function(response){console.log("OK"); productions_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"

		});


		function productions_ul(monthly) {

			$("ul").empty();
			
			$("ul").append("<li>MONTHLY AVERAGE TEMPERATURE (ºC): " + monthly.monthly_temp + 
						   "</li><li>MONTHLY AVERAGE HUMIDITY: " + monthly.monthly_humidity + 
						   "</li><li>WATER PRODUCTION: " + (monthly_water_production(monthly)) + " L</li>");
		}

		function monthly_water_production(monthly) {

			var k_humidity = (5 * Math.pow(10, -5) * Math.pow(monthly.monthly_humidity, 2)) + (0.013 * h) + 0.0277;

			var k_temperature = (-0.0002 * Math.pow(monthly.celsius, 2)) + (0.0458 * monthly.monthly_temp) - 0.1029;

			var water_litres = k_humidity * k_temperature * 1000 * 30;

			return Math.round(water_litres);
		}
    });
});