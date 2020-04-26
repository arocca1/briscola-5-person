# == Schema Information
#
# Table name: active_games
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  game_id      :bigint
#  bidding_done :boolean
#
class ActiveGame < ApplicationRecord
  belongs_to :game, inverse_of: :active_games
  has_many :player_game_cards, inverse_of: :active_game
  has_many :player_active_game_bids, inverse_of: :active_game
  has_many :active_game_partners, inverse_of: :active_game
  has_many :hands, inverse_of: :active_game

  def cards_in_current_hand
    active_game.player_game_cards.includes(:card).joins(:hand).where("hands.number = (#{active_game.hands.select('MAX(number)').to_sql})")
  end
end
