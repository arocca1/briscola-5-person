class CreateActiveGamePartnersTable < ActiveRecord::Migration[6.0]
  def change
    create_table :active_game_partners do |t|
      t.timestamps
    end
    add_reference :active_game_partners, :active_game, foreign_key: true
    add_reference :active_game_partners, :player, foreign_key: true
    add_reference :active_game_partners, :partner, foreign_key: { to_table: :players }
  end
end
