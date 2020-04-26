class CreateActiveGameTables < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name, null: false
      t.timestamps
    end

    create_table :active_games do |t|
      t.string :name, null: false
      t.timestamps
    end
    add_reference :active_games, :game, foreign_key: true

    create_table :player_game_cards do |t|
      t.boolean :played, default: false
      t.timestamps
    end
    add_reference :player_game_cards, :active_game, foreign_key: true
    add_reference :player_game_cards, :player, foreign_key: true
    add_reference :player_game_cards, :card, foreign_key: true

    create_table :player_active_game_bids do |t|
      t.integer :bid, null: false
      t.boolean :passed, default: false
      t.timestamps
    end
    add_reference :player_active_game_bids, :active_game, foreign_key: true
    add_reference :player_active_game_bids, :player, foreign_key: true
  end
end
