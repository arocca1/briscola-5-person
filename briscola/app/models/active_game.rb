# == Schema Information
#
# Table name: active_games
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  game_id      :bigint
#  bidding_done :boolean
#
class ActiveGame < ApplicationRecord
  belongs_to :game, inverse_of: :active_games
  has_many :player_game_cards, inverse_of: :active_game
  has_many :player_active_game_bids, inverse_of: :active_game
  has_many :active_game_partners, inverse_of: :active_game
  has_many :hands, inverse_of: :active_game

  def previous_hand
    self.hands.find_by("hands.number = (#{self.hands.select('MAX(number)').to_sql}) - 1")
  end

  def current_hand
    self.hands.find_by("hands.number = (#{self.hands.select('MAX(number)').to_sql})")
  end

  def cards_in_current_hand
    self.player_game_cards.includes(:card).joins(:hand).where("hands.number = (#{self.hands.select('MAX(number)').to_sql})")
  end

  def cards_by_hand(hand_number)
    self.player_game_cards.includes(:card).joins(:hand).where(Hand.arel_table[:number].eq(hand_number))
  end

  def players_in_game
    Player.joins(:player_active_game_bids).where(player_active_game_bids: { active_game_id: self.id })
  end

  def ordered_players_in_game
    Player.joins(:player_active_game_bids).where(player_active_game_bids: { active_game_id: self.id }).order(PlayerActiveGameBid.arel_table[:created_at])
  end

  def briscola_suit
    self.player_game_cards.where(player_game_cards: { is_partner_card: true }).joins(:card).pluck(:suit_id).first
  end

  def partner_card
    self.player_game_cards.find_by(player_game_cards: { is_partner_card: true })
  end

  def max_bidder
    self.player_active_game_bids.find_by("bid = (#{self.player_active_game_bids.select('MAX(bid)').to_sql})")
  end

  def current_bidder
    bids = self.player_active_game_bids.order(PlayerActiveGameBid.arel_table[:created_at])
    # if no one has bid or passed, we are at the beginning. The player after the dealer
    # goes first since the dealer bids last
    if bids.where(passed: nil, bid: nil).count == bids.count
      return bids[1]
    else
      # the dealer goes last in the order
      bids = bids[1..] + [bids[0]]
      last_bidder = bids.max_by { |b| b.updated_at }
      last_bidder_idx = bids.index { |b| b.id == last_bidder.id }
      (bids.length - 1).times do |i|
        next_bidder = bids[(last_bidder_idx + i + 1) % bids.length]
        return next_bidder if !next_bidder.passed
      end
    end
    nil # could not find a bidder
  end

  def deal_cards
    dealt_cards = false
    players = self.players_in_game.to_a
    player_idx = 0
    cards_in_deck = self.game.cards_in_deck.to_a
    PlayerGameCard.transaction do
      while cards_in_deck.any? do
        card = cards_in_deck.delete_at(rand(cards_in_deck.length))
        dealt_card = self.player_game_cards.new(player_id: players[player_idx].id, card_id: card.id)
        raise ActiveRecord::Rollback if !dealt_card.save
        player_idx = (player_idx + 1) % players.length
      end

      # also create a hand
      raise ActiveRecord::Rollback if !self.hands.create(number: 1)

      dealt_cards = true
    end
    dealt_cards
  end

  def current_player_turn
    player_ids = self.ordered_players_in_game.pluck(:id)

    curr_hand = self.current_hand
    cards_played_in_current_hand = self.cards_in_current_hand.count
    # if this is the very first hand, the max bidder goes first
    # if some number of cards have been played, we are displaced from that
    # many positions from the second person to join
    prev_winner_id = curr_hand.number == 1 ? self.max_bidder.player_id : self.previous_hand.winner_id
    prev_winner_idx = player_ids.index(prev_winner_id)
    #debugger
    player_ids[(prev_winner_idx + cards_played_in_current_hand) % self.game.num_players]
  end
end
