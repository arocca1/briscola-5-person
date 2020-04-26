Rails.application.routes.draw do
  resources :games, only: [:create, :index, :show] do
  end
  resources :bids do
    collection do
      post 'make_bid'
      post 'pass_bid'
    end
  end
end
