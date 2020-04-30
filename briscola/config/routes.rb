Rails.application.routes.draw do
  resources :games, only: [:create, :index, :show] do
    collection do
      get 'show_json'
      post 'join'
      get 'get_supported_games'
    end
  end

  resources :bids do
    collection do
      post 'make_bid'
      post 'pass_bid'
      post 'set_partner_card'
    end
  end

  resources :play do
    collection do
      post 'play_card'
    end
  end
end
