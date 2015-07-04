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
	  		streetViewControl: false,
	  		mapTypeControl:false
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

    	if ($("#location").attr("name") === "monthly") {
    		
	    	MM = $("#month").val();
	    	YYYY = $("#year").val();

	    	date = { month: MM, year: YYYY };
	    }

		if ($("#location").attr("name") === "daily")
			DailyWeather(coordinates);
		else
			MonthlyWeather(coordinates, date);
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

    	lngObj = bounds["ra"];
    	lng = lngObj["A"];

    	coordinates = {latitude: lat, longitude: lng };

    	if ($("#location").attr("name") === "monthly") {

	    	MM = $("#month").val()
	    	YYYY = $("#year").val()

	    	date = { month: MM, year: YYYY }
	    }

    	if ($("#location").attr("name") === "daily")
			DailyWeather(coordinates);
		else
			MonthlyWeather(coordinates, date);
    });

	//for daily path

	function DailyWeather(coordinates) {
		$.ajax({
			url: "http://localhost:3000/current_weather",
			data: coordinates,
			success: function(response){console.log("OK"); current_ul(response) },
			error: function(){console.log("WRONG")},
			dataType: "json"
		});
	}

	function current_ul(current) {
		
		$("#zone").empty().append("LOCATION:<br>" + current.country + ", " + current.city);
		$("#fahrenheit").empty().append("TEMPERATURE (ºF): " + current.fahrenheit);
		$("#celsius").empty().append("TEMPERATURE (ºC): " + current.celsius);
		$("#humidity").empty().append("HUMIDITY: " + current.humidity);
		$("#wind").empty().append("WIND: " + current.wind); 
		$("#water").empty().append("WATER PRODUCTION: " + current_water_production(current) +" L");
	}

	function current_water_production(current) {

		var h = parseFloat(current.humidity);

		var k_humidity = (5 * Math.pow(10, -5) * Math.pow(h, 2)) + (0.013 * h) + 0.0277;

		var k_temperature = (-0.0002 * Math.pow(current.celsius, 2)) + (0.0458 * current.celsius) - 0.1029;

		var water_litres = k_humidity * k_temperature * 1000;

		return Math.round(water_litres);
	}

	//for monthly path

	function MonthlyWeather(coordinates, date) {

    	$.ajax({
			url: "http://localhost:3000/history_weather",
			data: {coordinates: coordinates, date: date},
			success: function(response){console.log("OK"); monthly_ul(response)},
			error: function(){console.log("WRONG")},
			dataType: "json"
		});
	}

	function monthly_ul(history) {
		
		$("#zone").empty().append("RADAR LOCATION: " + history.zone);
		$("#celsius").empty().append("MONTHLY AVERAGE TEMPERATURE (ºC): " + history.monthly_temp);
		$("#humidity").empty().append("MONTHLY AVERAGE HUMIDITY (%): " + history.monthly_humidity);
		$("#water").empty().append("WATER PRODUCTION: " + (monthly_water_production(history)) + " L");
		$("#date").empty().append(history.MM +"/"+ history.YYYY);
	}

	function monthly_water_production(history) {

		var k_humidity = (5 * Math.pow(10, -5) * Math.pow(history.monthly_humidity, 2)) + (0.013 * history.monthly_humidity) + 0.0277;

		var k_temperature = (-0.0002 * Math.pow(history.monthly_temp, 2)) + (0.0458 * history.monthly_temp) - 0.1029;

		var water_litres = k_humidity * k_temperature * 1000 * 30;

		return Math.round(water_litres);
	}
});

