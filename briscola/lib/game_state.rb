module GameState
  def self.get_player_state(player:, active_game:, show_score: false)
    state = { id: player.id }
    state[:my_cards] = player.unplayed_cards.map do |pl_card|
      {
        id: pl_card.id.to_s,
        player_id: player.id.to_s,
        name: pl_card.card.name,
        raw_value: pl_card.card.raw_value,
      }
    end

    cards_in_current_hand = active_game.cards_in_current_hand.order(:updated_at)
    # ordering of card playing matters
    # updated_at will be set when we set the hand_id
    state[:cards_in_current_hand] = cards_in_current_hand.map do |pl_card|
      {
        id: pl_card.id.to_s,
        player_id: pl_card.player_id.to_s,
        name: pl_card.card.name,
        raw_value: pl_card.card.raw_value,
      }
    end

    partner_card = active_game.partner_card
    state[:partner_card] = {
      id: pl_card.id.to_s,
      name: pl_card.card.name,
      raw_value: pl_card.card.raw_value,
    }

# TODO calculate player currently winning hand




# TODO define ordering of play and the dealer
# dealer is the first to join
# winner of hand must go first
# can define ordering by who joined the game first (player_game_cards have timestamps)


    if active_game.game.requires_bidding
      state[:requires_bidding] = active_game.game.requires_bidding
      state[:bidding_done] = active_game.bidding_done
      player_bid = player.player_active_game_bids.where(active_game_id: active_game.id)
      state[:my_bid] = player_bid.bid
      state[:did_i_pass] = player_bid.passed
      player_max_bid = active_game.player_active_game_bids.select(:player_id, :bid).where("bid = (#{active_game.player_active_game_bids.select('MAX(bid)').to_sql})")
      state[:highest_bid] = player_max_bid.bid
      state[:highest_bidder] = player_max_bid.player_id.to_s # JavaScript is a butt
    end

    if show_score
      state[:my_team_score] = active_game.hands.where(winner_id: player.partners.pluck(:partner_id) + [player.id]).sum(:score)
    end

    state
  end
end
