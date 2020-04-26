class Hand < ApplicationRecord
  belongs_to :active_game, inverse_of: :hands
  has_many :player_game_cards, inverse_of: :hand
end
