# == Schema Information
#
# Table name: players
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Player < ApplicationRecord
  has_many :player_game_cards, inverse_of: :player
  has_many :player_active_game_bids, inverse_of: :player
  has_many :active_game_partners, inverse_of: :player

  def partners(active_game_id)
    self.active_game_partners.where(active_game_partners: { active_game_id: active_game_id })
  end

  def unplayed_cards(active_game_id)
    player_game_cards.includes(:card).where(active_game_id: active_game_id, hand_id: nil)
  end
end
