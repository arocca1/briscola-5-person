class CreateCardsTables < ActiveRecord::Migration[6.0]
  def change
    create_table :card_types do |t|
      t.string :name, null: false
    end
    create_table :games do |t|
      t.string :name, null: false
    end
    add_reference :games, :card_type, foreign_key: true
    create_table :suits do |t|
      t.string :name, null: false
    end
    add_reference :suits, :card_type, foreign_key: true
    create_table :cards do |t|
      t.string :name, null: false
      t.integer :raw_value, null: false
    end
    add_reference :cards, :suit, foreign_key: true
    create_table :game_value_points do |t|
      t.integer :points, null: false
      t.integer :game_value, null: false
    end
    add_reference :game_value_points, :game, foreign_key: true
    add_reference :game_value_points, :card, foreign_key: true
  end
end
