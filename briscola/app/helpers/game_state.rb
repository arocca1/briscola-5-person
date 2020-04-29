module GameState
  def self.get_player_state(player:, active_game:, show_score: false)
    state = { id: player.id.to_s, game_id: active_game.id.to_s }

    # if the game requires bidding and we haven't done it yet, then we shouldn't
    # return any card state
    in_active_play = true

    if active_game.game.requires_bidding
      state[:requires_bidding] = active_game.game.requires_bidding
      state[:bidding_done] = in_active_play = active_game.bidding_done
      player_bid = player.player_active_game_bids.find_by(active_game_id: active_game.id)
      state[:my_bid] = player_bid.bid
      state[:did_i_pass] = player_bid.passed
      player_max_bid = active_game.player_active_game_bids.select(:player_id, :bid).find_by("bid = (#{active_game.player_active_game_bids.select('MAX(bid)').to_sql})")
      if !player_max_bid.nil?
        state[:highest_bid] = player_max_bid.bid
        state[:highest_bidder] = player_max_bid.player_id.to_s # JavaScript is a butt
      end
    end

    # so we can draw them around the table
    state[:players] = active_game.ordered_players_in_game.map do |pl|
      {
        id: pl.id.to_s,
        name: pl.name,
      }
    end

    if in_active_play
      state[:my_cards] = player.unplayed_cards(active_game.id).map do |pl_card|
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
        id: partner_card.id.to_s,
        name: partner_card.card.name,
        raw_value: partner_card.card.raw_value,
      } if partner_card

      winning_card, score = BriscolaHandWinnerComputer.calculate_winner(active_game.cards_in_current_hand.order(:updated_at), active_game.brisola_suit)
      if !winning_card.nil?
        state[:current_leader] = winning_card.player_id.to_s
        state[:current_hand_score] = score
      end

      state[:current_player_turn] = active_game.current_player_turn

      if show_score
        state[:my_team_score] = active_game.hands.where(winner_id: player.partners.pluck(:partner_id) + [player.id]).sum(:score)
      end
    end

    state
  end
end
