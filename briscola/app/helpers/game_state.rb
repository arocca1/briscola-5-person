module GameState
  def self.get_player_state(player:, active_game:, show_score: false)
    state = { id: player.id.to_s, game_id: active_game.id.to_s }

    # so we can draw them around the table
    state[:players] = active_game.ordered_players_in_game.map do |pl|
      {
        id: pl.id.to_s,
        name: pl.name,
      }
    end
    state[:my_position] = state[:players].index { |p| p[:id] == player.id.to_s }
    state[:num_required_players] = active_game.game.num_players
    state[:all_players_joined] = state[:players].length == active_game.game.num_players

    state[:my_cards] = player.unplayed_cards(active_game.id).map do |pl_card|
      {
        id: pl_card.id.to_s,
        player_id: player.id.to_s,
        card_name: pl_card.card.name.downcase,
        raw_value: pl_card.card.raw_value,
        suit_name: pl_card.card.suit.name.downcase,
        suit_id: pl_card.card.suit_id.to_s,
      }
    end

    # if the game requires bidding and we haven't done it yet, then we shouldn't
    # return any card state
    in_active_play = true

    if active_game.game.requires_bidding
      # assume not in active play unless there is a partner card
      in_active_play = false
      state[:requires_bidding] = active_game.game.requires_bidding
      state[:bidding_done] = active_game.bidding_done
      if state[:all_players_joined]
        player_bid = player.player_active_game_bids.find_by(active_game_id: active_game.id)
        # ordered in the same way as the player infos
        state[:player_bids] = active_game.player_active_game_bids.select(:player_id, :bid, :passed)
                                        .order(PlayerActiveGameBid.arel_table[:created_at]).map do |p_bid|
          {
            player_id: p_bid.player_id,
            bid: p_bid.bid,
            passed: p_bid.passed,
          }
        end

        max_bidder = active_game.max_bidder
        if !max_bidder.nil?
          state[:max_bid] = max_bidder.bid
          state[:max_bidder_name] = max_bidder.player.name
        end
        if active_game.player_active_game_bids.where(passed: true).count == state[:num_required_players] - 1
          state[:bidding_winner_id] = max_bidder.player_id.to_s
        # there hasn't been any bidding yet
        else
          state[:current_bidder_id] = active_game.current_bidder.player_id.to_s
        end

        if state[:bidding_done]
          partner_card = active_game.partner_card
          if partner_card
            state[:partner_card] = {
              id: partner_card.id.to_s,
              name: partner_card.card.name,
              raw_value: partner_card.card.raw_value,
            }
            # we are in active play. bidding is done and there is a partner card
            in_active_play = true
          end
        end
      end
    end

    if in_active_play
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

      winning_card, score = BriscolaHandWinnerComputer.calculate_winner(active_game.cards_in_current_hand.order(:updated_at), active_game.brisola_suit)
      if !winning_card.nil?
        state[:current_leader] = winning_card.player_id.to_s
        state[:current_hand_score] = score
      end

      state[:current_player_turn] = active_game.current_player_turn.to_s

      if show_score
        state[:my_team_score] = active_game.hands.where(winner_id: player.partners.pluck(:partner_id) + [player.id]).sum(:score)
      end
    end

    state
  end
end
