# == Schema Information
#
# Table name: player_game_cards
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  active_game_id  :bigint
#  player_id       :bigint
#  card_id         :bigint
#  hand_id         :bigint
#  is_partner_card :boolean
#
class PlayerGameCard < ApplicationRecord
  belongs_to :active_game, inverse_of: :player_game_cards
  belongs_to :player, inverse_of: :player_game_cards
  belongs_to :card, inverse_of: :player_game_cards
  belongs_to :hand, inverse_of: :player_game_cards
end
