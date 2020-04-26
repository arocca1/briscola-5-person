module HandWinnerComputer
  def self.calculate_winner(cards, briscola_suit)
    return nil if cards.empty?
    return cards.first if cards.length == 1
    cards[1..].reduce(cards.first) { |winner, card| Card.get_winner(winner, card) }
  end
end
