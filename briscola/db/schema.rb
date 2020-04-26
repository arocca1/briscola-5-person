# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_26_000010) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "card_types", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "cards", force: :cascade do |t|
    t.string "name", null: false
    t.integer "raw_value", null: false
    t.bigint "suit_id"
    t.index ["suit_id"], name: "index_cards_on_suit_id"
  end

  create_table "game_value_points", force: :cascade do |t|
    t.integer "points", null: false
    t.integer "game_value", null: false
    t.bigint "game_id"
    t.bigint "card_id"
    t.index ["card_id"], name: "index_game_value_points_on_card_id"
    t.index ["game_id"], name: "index_game_value_points_on_game_id"
  end

  create_table "games", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "card_type_id"
    t.index ["card_type_id"], name: "index_games_on_card_type_id"
  end

  create_table "suits", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "card_type_id"
    t.index ["card_type_id"], name: "index_suits_on_card_type_id"
  end

  add_foreign_key "cards", "suits"
  add_foreign_key "game_value_points", "cards"
  add_foreign_key "game_value_points", "games"
  add_foreign_key "games", "card_types"
  add_foreign_key "suits", "card_types"
end
