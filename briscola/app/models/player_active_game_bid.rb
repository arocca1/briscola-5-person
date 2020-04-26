class PlayerActiveGameBid < ApplicationRecord
  belongs_to :active_game, inverse_of: :player_active_game_bids
  belongs_to :player, inverse_of: :player_active_game_bids
  # include the highest bid of a player
  validates_numericality_of :bid, in: 61..120
end
