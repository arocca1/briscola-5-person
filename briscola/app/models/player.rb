class Player < ApplicationRecord
  has_many :player_game_cards, inverse_of: :player
  has_many :player_active_game_bids, inverse_of: :player
end
