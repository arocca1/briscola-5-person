# == Schema Information
#
# Table name: active_game_partners
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  active_game_id :bigint
#  player_id      :bigint
#  partner_id     :bigint
#
class ActiveGamePartner < ApplicationRecord
  belongs_to :partner, class_name: "Player"
  belongs_to :player, inverse_of: :active_game_partners
  belongs_to :active_game, inverse_of: :active_game_partners
end
