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

  def current_hand
    self.hands.where("hands.number = (#{self.hands.select('MAX(number)').to_sql})")
  end

  def cards_in_current_hand
    self.player_game_cards.includes(:card).joins(:hand).where("hands.number = (#{self.hands.select('MAX(number)').to_sql})")
  end

  def players_in_game
    Player.joins(:player_active_game_bids).where(player_active_game_bids: { active_game_id: self.id })
  end

  def brisola_suit
    self.player_game_cards.where(player_game_cards: { is_partner_card: true }).joins(:card).pluck('cards.id').first
  end

  def partner_card
    self.player_game_cards.find_by(player_game_cards: { is_partner_card: true })
  end
end
