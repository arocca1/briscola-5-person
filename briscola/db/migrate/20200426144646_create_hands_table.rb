class CreateHandsTable < ActiveRecord::Migration[6.0]
  def change
    create_table :hands do |t|
      t.integer :score
      t.timestamps
    end
    add_reference :hands, :active_game, foreign_key: true
    add_reference :hands, :winner, foreign_key: { to_table: :players }

    remove_column :player_game_cards, :played, :boolean
    add_reference :player_game_cards, :hand, foreign_key: true
  end
end
