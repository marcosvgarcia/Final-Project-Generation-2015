Rails.application.routes.draw do

  	get '/current_weather' => 'weather#index', as: "index"

  	get '/history_weather' => 'weather#show', as: "show"
end
