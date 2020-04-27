Rails.application.routes.draw do
  resources :games, only: [:create, :index, :show] do
    collection do
      post 'join'
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
      post 'deal_cards'
      post 'play_card'
    end
  end
end
