class Game < ApplicationRecord
  belongs_to :card_type, inverse_of: :games
  has_many :game_value_points, inverse_of: :game
  has_many :active_games, inverse_of: :game
end
