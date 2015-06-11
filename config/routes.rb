Rails.application.routes.draw do

  	get '/weather', to: 'weather#index'

  	get '/production', to: 'production#index'
end
