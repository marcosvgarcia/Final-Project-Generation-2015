class WeatherController < ApplicationController

	def index

		@conditions = Condition.new
		@conditions.current_conditions
	end
end

