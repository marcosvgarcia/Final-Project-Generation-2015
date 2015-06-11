Rails.application.routes.draw do

  	get '/weather' => 'weather#index'

  	get '/production' => 'weather#show'
end
