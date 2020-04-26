class ActiveGamePartner < ApplicationRecord
  belongs_to :partner, class_name: "Player"
  belongs_to :player, inverse_of: :active_game_partners
  belongs_to :active_game, inverse_of: :active_game_partners
end
