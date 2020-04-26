class Player < ApplicationRecord
  has_many :player_game_cards, inverse_of: :player
  has_many :player_active_game_bids, inverse_of: :player
  has_many :active_game_partners, inverse_of: :player

  def partners(active_game_id)
    self.active_game_partners.where(active_game_partners: { active_game_id: active_game_id })
  end
end
