require 'open-uri'

class Condition 
	attr_accessor :country, :city, :humidity, :fahrenheit, :celsius, :wind, :sun

	def current_conditions(coordinates)

    	lat = coordinates['latitude'].to_s
    	lng = coordinates['longitude'].to_s
  
		open('http://api.wunderground.com/api/10e35db57db73b9a/geolookup/conditions/q/'+ lat +','+ lng +'.json') do |f|
			json_string = f.read
			parsed_json = JSON.parse(json_string)
			country_name = parsed_json['location']['country_name']
			city = parsed_json['location']['city']
			temp_f = parsed_json['current_observation']['temp_f']
			temp_c = parsed_json['current_observation']['temp_c']
			relative_humidity = parsed_json['current_observation']['relative_humidity']
			wind_string = parsed_json['current_observation']['wind_string']
			solarradiation = parsed_json['current_observation']['solarradiation']
			@country = country_name
			@city = city
			@fahrenheit = temp_f
			@celsius = temp_c
			@humidity = relative_humidity
			@wind = wind_string
			@sun = solarradiation
		end
	end
end
