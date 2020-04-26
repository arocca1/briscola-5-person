# == Schema Information
#
# Table name: game_value_points
#
#  id         :bigint           not null, primary key
#  points     :integer          not null
#  game_value :integer          not null
#  game_id    :bigint
#  card_id    :bigint
#
class GameValuePoint < ApplicationRecord
  belongs_to :game, inverse_of: :game_value_points
  belongs_to :card, inverse_of: :game_value_points
end
