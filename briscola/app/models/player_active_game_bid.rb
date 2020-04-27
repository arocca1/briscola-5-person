# == Schema Information
#
# Table name: player_active_game_bids
#
#  id             :bigint           not null, primary key
#  bid            :integer
#  passed         :boolean
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  active_game_id :bigint
#  player_id      :bigint
#
class PlayerActiveGameBid < ApplicationRecord
  belongs_to :active_game, inverse_of: :player_active_game_bids
  belongs_to :player, inverse_of: :player_active_game_bids
  # include the highest bid of a player
  validates_numericality_of :bid, in: 61..120, allow_nil: true
end
