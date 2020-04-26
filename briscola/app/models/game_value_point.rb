class GameValuePoint < ApplicationRecord
  belongs_to :game, inverse_of: :game_value_points
  belongs_to :card, inverse_of: :game_value_points
end
