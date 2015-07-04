Rails.application.routes.draw do

  	get '/current_weather' => 'weather#daily', as: "daily"

  	get '/history_weather' => 'weather#monthly', as: "monthly"
end
