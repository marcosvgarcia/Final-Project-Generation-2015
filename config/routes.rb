Rails.application.routes.draw do

	get '/weather', to: 'weather#index'
	post '/weather', to: 'weather#index'
  	resources :weather
end
