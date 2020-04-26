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
    state[:my_partners] = player.partners.pluck(:partner_id)
    state[:my_cards] = player.unplayed_cards.map do |pl_card|
      {
        name: pl_card.card.name,
        raw_value: pl_card.card.raw_value,
      }
    end

    state
  end
end
