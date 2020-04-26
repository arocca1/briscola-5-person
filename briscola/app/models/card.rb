class Card < ApplicationRecord
  belongs_to :suit, inverse_of: :cards
  has_many :game_value_points, inverse_of: :card

  # assume they have the same suit
  def self.get_winner(a, b, brisola_suit)
    return (a.game_value > b.game_value) ? a : b if a.suit == b.suit
    return a if a.suit == brisola_suit
    return b if b.suit == brisola_suit
    a
  end
end
