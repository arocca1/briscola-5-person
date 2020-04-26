class AddIsPartnerCardToPlayerGameCard < ActiveRecord::Migration[6.0]
  def change
    add_column :player_game_cards, :is_partner_card, :boolean
  end
end
