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

ActiveRecord::Schema.define(version: 2020_04_26_150500) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_game_partners", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "active_game_id"
    t.bigint "player_id"
    t.bigint "partner_id"
    t.index ["active_game_id"], name: "index_active_game_partners_on_active_game_id"
    t.index ["partner_id"], name: "index_active_game_partners_on_partner_id"
    t.index ["player_id"], name: "index_active_game_partners_on_player_id"
  end

  create_table "active_games", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "game_id"
    t.index ["game_id"], name: "index_active_games_on_game_id"
  end

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
    t.integer "num_players", null: false
    t.bigint "card_type_id"
    t.boolean "requires_bidding"
    t.index ["card_type_id"], name: "index_games_on_card_type_id"
  end

  create_table "hands", force: :cascade do |t|
    t.integer "score"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "active_game_id"
    t.bigint "winner_id"
    t.index ["active_game_id"], name: "index_hands_on_active_game_id"
    t.index ["winner_id"], name: "index_hands_on_winner_id"
  end

  create_table "player_active_game_bids", force: :cascade do |t|
    t.integer "bid"
    t.boolean "passed"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "active_game_id"
    t.bigint "player_id"
    t.index ["active_game_id"], name: "index_player_active_game_bids_on_active_game_id"
    t.index ["player_id"], name: "index_player_active_game_bids_on_player_id"
  end

  create_table "player_game_cards", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "active_game_id"
    t.bigint "player_id"
    t.bigint "card_id"
    t.bigint "hand_id"
    t.index ["active_game_id"], name: "index_player_game_cards_on_active_game_id"
    t.index ["card_id"], name: "index_player_game_cards_on_card_id"
    t.index ["hand_id"], name: "index_player_game_cards_on_hand_id"
    t.index ["player_id"], name: "index_player_game_cards_on_player_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "suits", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "card_type_id"
    t.index ["card_type_id"], name: "index_suits_on_card_type_id"
  end

  add_foreign_key "active_game_partners", "active_games"
  add_foreign_key "active_game_partners", "players"
  add_foreign_key "active_game_partners", "players", column: "partner_id"
  add_foreign_key "active_games", "games"
  add_foreign_key "cards", "suits"
  add_foreign_key "game_value_points", "cards"
  add_foreign_key "game_value_points", "games"
  add_foreign_key "games", "card_types"
  add_foreign_key "hands", "active_games"
  add_foreign_key "hands", "players", column: "winner_id"
  add_foreign_key "player_active_game_bids", "active_games"
  add_foreign_key "player_active_game_bids", "players"
  add_foreign_key "player_game_cards", "active_games"
  add_foreign_key "player_game_cards", "cards"
  add_foreign_key "player_game_cards", "hands"
  add_foreign_key "player_game_cards", "players"
  add_foreign_key "suits", "card_types"
end
