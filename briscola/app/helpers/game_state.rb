module GameState
  def self.get_player_state(player:, active_game:, show_score: false)
    state = { id: player.id.to_s, game_id: active_game.id.to_s }

    # so we can draw them around the table
    players_in_game = active_game.ordered_players_in_game
    state[:players] = players_in_game.map do |pl|
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

    state[:suits] = Suit.joins(card_type: { games: :active_games })
                        .where(active_games: { id: active_game.id })
                        .pluck(:id, :name)
                        .uniq
                        .map { |s| { id: s[0].to_s, name: s[1] } }
    state[:raw_values] = Card.joins({ suit: { card_type: { games: :active_games }}})
                             .where(active_games: { id: active_game.id })
                             .pluck(:raw_value, :name)
                             .uniq
                             .map { |r| { raw_value: r[0], name: r[1] } }

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
              suit_name: partner_card.card.suit.name.downcase,
              suit_id: partner_card.card.suit_id,
              card_name: partner_card.card.name.downcase,
              raw_value: partner_card.card.raw_value,
            }
            # we are in active play. bidding is done and there is a partner card
            in_active_play = true
          end
        end
      end
    end

    if in_active_play
      current_hand = active_game.current_hand
      cards_in_current_hand = active_game.cards_in_current_hand.order(:updated_at)
      cards_to_render = cards_in_current_hand
      # if no cards are yet to be played in the current hand, let's show the previous
      # hand. This is also a really nice way to show the results of the previous
      # hand. Otherwise, they would just disappear on the last card play
      if current_hand.number != 1 && cards_in_current_hand.count == 0
        cards_to_render = active_game.cards_by_hand(current_hand.number - 1).order(:updated_at)
      end

      # ordering of card playing matters
      # updated_at will be set when we set the hand_id
      state[:cards_in_current_hand] = cards_to_render.map do |pl_card|
        {
          player_id: pl_card.player_id.to_s,
          suit_name: pl_card.card.suit.name.downcase,
          suit_id: pl_card.card.suit_id,
          card_name: pl_card.card.name.downcase,
          raw_value: pl_card.card.raw_value,
        }
      end

      winning_card, score = BriscolaHandWinnerComputer.calculate_winner(cards_to_render, active_game.briscola_suit)
      if !winning_card.nil?
        state[:current_leader] = winning_card.player_id.to_s
        state[:current_leader_name] = winning_card.player.name
        state[:current_hand_score] = score
      end

      state[:current_player_turn] = active_game.current_player_turn.to_s

      # if all of the hands have been played, let's show the scores
      if active_game.player_game_cards.where.not(hand_id: nil) == active_game.game.cards_in_deck.count
        my_partners = player.active_game_partners.where(active_game_id: active_game.id).pluck(:partner_id)
        # i am not the max bidder or partner
        if my_partners.empty?
          my_partners = players_in_game.map(&:id) - active_game.active_game_partners.pluck(:player_id)
        end
        state[:my_partners] = my_partners.map(&:to_s)
        state[:my_team_score] = active_game.hands.where(winner_id: my_partners + [player.id]).sum(:score)
        state[:other_team_score] = active_game.hands.where.not(winner_id: my_partners + [player.id]).sum(:score)
      end
    end

    state
  end
end
