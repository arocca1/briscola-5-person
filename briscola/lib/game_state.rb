module GameState
  def self.get_player_state(player:, active_game:, show_score: false)
    =begin
    Want to return something like:
    {
      id: player_id,
      my_cards: [
        { value, raw_value, suit }
      ],
      cards_played: [
        { value, raw_value, suit, by_who }
      ],
      other_players maybe????
      highest_bid: ,
      highest_bidder ,
      my_partners: [player_ids],
      my_team_score: , # only show if allowed to
    }
    =end

  end
end
