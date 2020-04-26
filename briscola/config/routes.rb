Rails.application.routes.draw do
  resources :games, only: [:create, :index, :show] do
  end
end
