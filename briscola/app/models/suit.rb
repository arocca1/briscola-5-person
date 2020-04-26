# == Schema Information
#
# Table name: suits
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  card_type_id :bigint
#
class Suit < ApplicationRecord
  belongs_to :card_type, inverse_of: :suits
  has_many :cards, inverse_of: :suit
end
