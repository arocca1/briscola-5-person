class PlayController < ApplicationController
  def deal_cards
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid active game", status: 400 if active_game.nil?

    update_succeeded = true
    players = Player.joins(:player_active_game_bids).where(player_active_game_bids: { active_game_id: active_game.id }).to_a
    player_idx = 0
    cards_in_deck = Card.joins(:suit).joins(suit: [:card_type]).where(card_types: { id: active_game.game.card_type_id }).to_a
    PlayerGameCard.transaction do
      while cards_in_deck.any? do
        card = cards_in_deck.delete_at(rand(cards_in_deck.length))
        dealt_card = active_game.player_game_card.new(player_id: players[player_idx].id, card_id: card.id)
        if !dealt_card.save
          update_succeeded = false
          raise ActiveRecord::Rollback
        end
        player_idx = (player_idx + 1) % players.length
      end

      # also create a hand
      raise ActiveRecord::Rollback if !active_game.hands.create(number: 1)
    end

    return render json: "Unable to deal cards", status: 500 if !update_succeeded
    render json: "Dealt cards", status: 200
  end

  def play_card
    # check that card wasn't already played

    # need to finish the hand if appropriate
    # and then need to decide if need to create another hand
    # should be easy enough to check, i.e. any cards that have no associated hand
  end
end
