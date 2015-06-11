require 'open-uri'

class Condition 
	attr_accessor :country, :city, :humidity, :fahrenheit, :celsius, :wind, :sun, :mintemp, :maxtemp, :avehumidity, :monthly_temp, :monthly_humidity

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
			@country = country_name
			@city = city
			@fahrenheit = temp_f
			@celsius = temp_c
			@humidity = relative_humidity
			@wind = wind_string
		end
	end

	def water_production

		h = @humidity.split('%')

		k_humidity = ((5 * 10**-5 * (h[0].to_i**2)) + (0.013 * h[0].to_i) + 0.0277)
		k_temperature = ((-0.0002 * (@celsius**2)) + (0.0458 * @celsius) - 0.1029)

		water_litres = k_humidity * k_temperature * 1000

		water_litres.round
	end

	def monthly_conditions(coordinates)

    	lat = coordinates['latitude'].to_s
    	lng = coordinates['longitude'].to_s

    	@mintemp = []
    	@maxtemp = []
    	@avehumidity = []

  		for day in 1..9

			open('http://api.wunderground.com/api/10e35db57db73b9a/history_2015050'"#{day}"'/q/'+ lat +','+ lng +'.json') do |f|
				json_string = f.read
				parsed_json = JSON.parse(json_string)
				mintempm = parsed_json['history']['dailysummary'][0]['mintempm']
				maxtempm = parsed_json['history']['dailysummary'][0]['maxtempm']
				humidity = parsed_json['history']['dailysummary'][0]['humidity']
				@mintemp << mintempm
				@maxtemp << maxtempm
				@avehumidity << humidity
			end
		end

		for day in 10..30

			open('http://api.wunderground.com/api/10e35db57db73b9a/history_201505'"#{day}"'/q/'+ lat +','+ lng +'.json') do |f|
				json_string = f.read
				parsed_json = JSON.parse(json_string)
				mintempm = parsed_json['history']['dailysummary'][0]['mintempm']
				maxtempm = parsed_json['history']['dailysummary'][0]['maxtempm']
				humidity = parsed_json['history']['dailysummary'][0]['humidity']
				@mintemp << mintempm
				@maxtemp << maxtempm
				@avehumidity << humidity
			end
		end
	end

	def monthly_temperature

		minimum = 0

		maximum = 0

		@mintemp.each do |number|
			n = number.to_i
  			minimum += n
		end

		@maxtemp.each do |number|
			n = number.to_i
  			maximum += n
		end

		@monthly_temp = ((minimum + maximum)/60)
	end

	def monthly_humidity

		h = @avehumidity.map(&:to_i)

		average = 0

		h.each do |number|
  			average += number
		end

		@monthly_humidity = (average/30)
	end

	def monthly_water_production

		k_humidity = ((5 * 10**-5 * (@monthly_humidity**2)) + (0.013 * @monthly_humidity) + 0.0277)
		k_temperature = ((-0.0002 * (@monthly_temp**2)) + (0.0458 * @monthly_temp) - 0.1029)

		water_litres = k_humidity * k_temperature * 1000 * 30

		water_litres.round
	end


end
