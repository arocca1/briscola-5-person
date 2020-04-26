class PlayController < ApplicationController
  def deal_cards
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid active game", status: 400 if active_game.nil?

    update_succeeded = false
    players = active_game.players_in_game.to_a
    player_idx = 0
    cards_in_deck = active_game.game.cards_in_deck.to_a
    PlayerGameCard.transaction do
      while cards_in_deck.any? do
        card = cards_in_deck.delete_at(rand(cards_in_deck.length))
        dealt_card = active_game.player_game_card.new(player_id: players[player_idx].id, card_id: card.id)
        raise ActiveRecord::Rollback if !dealt_card.save
        player_idx = (player_idx + 1) % players.length
      end

      # also create a hand
      raise ActiveRecord::Rollback if !active_game.hands.create(number: 1)

      update_succeeded = true
    end

    return render json: "Unable to deal cards", status: 500 if !update_succeeded
    render json: "Dealt cards", status: 200
  end

  def play_card
    # check that card wasn't already played
    player_game_card = PlayerGameCard.find_by(id: params[:player_game_card_id])
    return render json: "Invalid card", status: 400 if player_game_card.nil?

    player = Player.find_by(id: params[:player_id])
    return render json: "Player does not exist" if player.nil?
    return render json: "Player does not have this card" if player_game_card.player_id != player.id

    active_game = player_game_card.active_game
    # all of the cards have already been played
    if active_game.player_game_cards.where.not(hand_id: nil) == active_game.game.cards_in_deck.count
      return render json: "All of the cards have already been played"
    end

    curr_hand = active_game.current_hand
    num_cards_in_current_hand = curr_hand.player_game_cards.count
    # the current hand has the maximum number of cards played
    if num_cards_in_current_hand == active_game.game.num_players
      # TODO add in a transaction
      # need to create new hand
      hand = active_game.hands.create(number: active_games.hands.maximum(:number) + 1)
      return render json: "Unable to create next hand", status: 400 if hand.nil?
      # play the card in the hand
      return render json: "Unable to play card", status: 400 if !player_game_card.update(hand_id: hand.id)
    end

    # the current hand still have more cards to be played
    # TODO wrap in transaction
    return render json: "Unable to play card", status: 400 if !player_game_card.update(hand_id: curr_hand.id)
    # did playing this card finish the hand?
    # if it didn't finish the game, let's create the next hand
    if (num_cards_in_current_hand + 1) == active_game.game.num_players &&
      active_game.player_game_cards.where.not(hand_id: nil) != active_game.game.cards_in_deck.count
      hand = active_game.hands.create(number: curr_hand.number + 1)
      return render json: "Unable to create next hand", status: 400 if hand.nil?
    end

    render json: "Played card", status: 200
  end
end
