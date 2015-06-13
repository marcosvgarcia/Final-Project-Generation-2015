class WeatherController < ApplicationController

	skip_before_action :verify_authenticity_token

	def index

		@conditions = Condition.new	

    	if params[:latitude] && params[:longitude] 
    		coordinates = {
				'latitude' => params[:latitude],
				'longitude' => params[:longitude]
			}
    	else
      		coordinates = {
				'latitude' => 40.4378271,
         		'longitude'=> -3.6795366
      		}
		end

		@conditions.current_conditions(coordinates)

		@conditions.water_production

		respond_to do |format|
			format.html
	    	format.json { render json: @conditions }
		end
	end

	def show

		@conditions = Condition.new	

    	if params[:latitude] && params[:longitude]
    		coordinates = {
				'latitude' => params[:latitude],
				'longitude' => params[:longitude]
			}
    	else
      		coordinates = {
				'latitude' => 40.4378271,
         		'longitude'=> -3.6795366
      		}
		end

		if params[:month] && params[:year]
			date = {
				'month' => params[:month],
				'year' => params[:year]
			}
		else
			date = {
				'month' => (Date.today.month - 1),
				'year' => Date.today.year
			}
		end

		@conditions.monthly_conditions(coordinates, date)

		@conditions.monthly_temperature

		@conditions.monthly_humidity

		@conditions.monthly_water_production
		
		respond_to do |format|
			format.html
	    	format.json { render json: @conditions }
		end
	end
end

