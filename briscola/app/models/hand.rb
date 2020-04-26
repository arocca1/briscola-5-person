# == Schema Information
#
# Table name: hands
#
#  id             :bigint           not null, primary key
#  score          :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  active_game_id :bigint
#  winner_id      :bigint
#  number         :integer
#
class Hand < ApplicationRecord
  belongs_to :active_game, inverse_of: :hands
  has_many :player_game_cards, inverse_of: :hand
end
