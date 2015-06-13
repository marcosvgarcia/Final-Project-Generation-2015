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
	  		zoom: 0,
	  		minZoom: 3,
	  		maxZoom: 9,
	  		disableDoubleClickZoom: true,
	  		panControl: false,
	  		zoomControl: false,
	  		streetViewControl: false
		};
		
		map = new google.maps.Map(document.getElementById("location"), mapOptions, {mapTypeId: google.maps.MapTypeId.ROADMAP});

		input = document.getElementById("pac-input");
  
  		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  		searchBox = new google.maps.places.SearchBox(input);
	}


	google.maps.event.addListener(map, "dblclick", function(event) {

    	lat = event.latLng.lat();
    	lng = event.latLng.lng();

    	coordinates = {latitude: lat, longitude: lng };

		if ($("#location").attr("name") === "index")
			IndexDblClickWeather(coordinates);
		else
			ShowDblClickWeather(coordinates);
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

    	coordinates = {latitude: lat, longitude: lng };

    	if ($("#location").attr("name") === "index")
			IndexSearchBoxWeather(coordinates);
		else
			ShowSearchBoxWeather(coordinates);
    });

	//for index path

	function IndexDblClickWeather(coordinates) {
		$.ajax({
			url: "http://localhost:3000/weather",
			data: coordinates,
			success: function(response){console.log("OK"); current_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"

		});
	}

	function IndexSearchBoxWeather(coordinates) {
    	$.ajax({
			url: "http://localhost:3000/weather",
			data: coordinates,
			success: function(response){console.log("OK"); current_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"
		});
	}

	function current_ul(current) {

		$("ul").empty();
		
		$("ul").append("<li>LOCATION: " + current.country + ", " + current.city + 
					   "</li><li>TEMPERATURE (ºF): " + current.fahrenheit + 
					   "</li><li>TEMPERATURE (ºC): " + current.celsius + 
					   "</li><li>HUMIDITY: " + current.humidity + 
					   "</li><li>WIND: " + current.wind + 
					   "</li><li>WATER PRODUCTION: " + current_water_production(current) + " L</li>");
	}

	function current_water_production(current) {

		var h = parseFloat(current.humidity);

		var k_humidity = (5 * Math.pow(10, -5) * Math.pow(h, 2)) + (0.013 * h) + 0.0277;

		var k_temperature = (-0.0002 * Math.pow(current.celsius, 2)) + (0.0458 * current.celsius) - 0.1029;

		var water_litres = k_humidity * k_temperature * 1000;

		return Math.round(water_litres);
	}

	//for show path

	function ShowDblClickWeather(coordinates) {

    	$.ajax({
			url: "http://localhost:3000/production",
			data: coordinates,
			success: function(response){console.log("OK"); monthly_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"
		});
	}

    function ShowSearchBoxWeather(coordinates) {

    	$.ajax({
			url: "http://localhost:3000/production",
			data: coordinates,
			success: function(response){console.log("OK"); monthly_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"
		});
    }

	function monthly_ul(history) {

		$("ul").empty();
		
		$("ul").append("<li>LOCATION: " + history.zone +
					   "</li><li>MONTHLY AVERAGE TEMPERATURE (ºC): " + history.monthly_temp + 
					   "</li><li>MONTHLY AVERAGE HUMIDITY (%): " + history.monthly_humidity + 
					   "</li><li>WATER PRODUCTION: " + (monthly_water_production(history)) + " L</li>");
	}

	function monthly_water_production(history) {

		var k_humidity = (5 * Math.pow(10, -5) * Math.pow(history.monthly_humidity, 2)) + (0.013 * history.monthly_humidity) + 0.0277;

		var k_temperature = (-0.0002 * Math.pow(history.monthly_temp, 2)) + (0.0458 * history.monthly_temp) - 0.1029;

		var water_litres = k_humidity * k_temperature * 1000 * 30;

		return Math.round(water_litres);
	}
});

