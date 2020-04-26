class PlayerGameCard < ApplicationRecord
  belongs_to :active_game, inverse_of: :player_game_cards
  belongs_to :player, inverse_of: :player_game_cards
  belongs_to :card, inverse_of: :player_game_cards
  # store if it's been played or not
end
