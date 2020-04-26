class Suit < ApplicationRecord
  belongs_to :card_type, inverse_of: :suits
  has_many :cards, inverse_of: :suit
end
