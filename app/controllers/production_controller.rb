class ProductionController < ApplicationController

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

		@conditions.monthly_conditions(coordinates)

		@conditions.monthly_temperature

		@conditions.monthly_humidity

		@conditions.monthly_water_production
		
		respond_to do |format|
			format.html
	    	format.json { render json: @conditions }
		end
	end
end
