module GameState
  def self.get_player_state(player:, active_game:, show_score: false)
    =begin
    Want to return something like:
    {
      id: player_id,
      my_partners: [player_ids],
      my_cards: [
        { value, raw_value, suit }
      ],
      cards_played_in_hand: [
        { value, raw_value, suit, by_who }
      ],
      highest_bid: ,
      highest_bidder ,
      my_team_score: , # only show if allowed to
    }
    =end
    state = { id: player.id }
    my_partners = player.partners.pluck(:partner_id)
    state[:my_partners] = my_partners.map(&:to_s) # JavaScript is a butt
    state[:my_cards] = player.unplayed_cards.map do |pl_card|
      {
        name: pl_card.card.name,
        raw_value: pl_card.card.raw_value,
      }
    end

    # TODO figure out how to identify active hand

    if active_game.requires_bidding
      player_bid = active_game.player_active_game_bids.select(:player_id, :bid).where("bid = (#{active_game.player_active_game_bids.select('MAX(bid)').to_sql})")
      state[:highest_bid] = player_bid.bid
      state[:highest_bidder] = player_bid.player_id.to_s # JavaScript is a butt
    end

    if show_score
      state[:my_team_score] = active_game.hands.where(winner_id: my_partners + [player.id]).sum(:score)
    end

    state
  end
end
