class HandWinnerComputer
  def self.get_winner(a, b, active_game)
    a
  end

  def self.calculate_winner(cards, active_game)
    return nil if cards.empty?
    return cards.first if cards.length == 1
    cards[1..].reduce(cards.first) { |winner, card| self.get_winner(winner, card, active_game) }
  end
end
