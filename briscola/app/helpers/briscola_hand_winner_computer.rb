class BriscolaHandWinnerComputer < HandWinnerComputer
  def self.get_winner(a, b, briscola_suit_id)
    if a.card.suit_id == b.card.suit_id
      # this is an N + 1 query. I need to fix this
      return (a.card.game_value_points.find_by(game_id: a.active_game.game_id).game_value > b.card.game_value_points.find_by(game_id: b.active_game.game_id).game_value) ? a : b
    end
    return a if a.card.suit_id == briscola_suit_id
    return b if b.card.suit_id == briscola_suit_id
    a
  end

  def self.calculate_winner(cards, briscola_suit_id)
    return [nil, 0] if cards.empty?
    return [cards.first, 0] if cards.length == 1
    winning_card = cards[1..].reduce(cards.first) { |winner, card| self.get_winner(winner, card, briscola_suit_id) }
    score = cards.reduce(0) { |sum, card| sum + card.card.game_value_points.find_by(game_id: card.active_game.game_id).points }
    [winning_card, score]
  end
end
