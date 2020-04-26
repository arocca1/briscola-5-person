# == Schema Information
#
# Table name: games
#
#  id               :bigint           not null, primary key
#  name             :string           not null
#  num_players      :integer          not null
#  card_type_id     :bigint
#  requires_bidding :boolean
#
class Game < ApplicationRecord
  belongs_to :card_type, inverse_of: :games
  has_many :game_value_points, inverse_of: :game
  has_many :active_games, inverse_of: :game

  def cards_in_deck
    Card.joins(:suit).joins(suit: [:card_type]).where(card_types: { id: self.card_type_id })
  end
end
