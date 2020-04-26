# == Schema Information
#
# Table name: cards
#
#  id        :bigint           not null, primary key
#  name      :string           not null
#  raw_value :integer          not null
#  suit_id   :bigint
#
class Card < ApplicationRecord
  belongs_to :suit, inverse_of: :cards
  has_many :game_value_points, inverse_of: :card
  has_many :player_game_cards, inverse_of: :card
end
