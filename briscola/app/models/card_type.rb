# == Schema Information
#
# Table name: card_types
#
#  id   :bigint           not null, primary key
#  name :string           not null
#
class CardType < ApplicationRecord
  has_many :games, inverse_of: :card_type
  has_many :suits, inverse_of: :card_type
  has_many :cards, through: :suits
end
