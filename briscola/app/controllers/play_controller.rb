require 'briscola_hand_winner_computer'
require 'game_state'

class PlayController < ApplicationController
  def play_card
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid active game", status: 400 if active_game.nil?
    player_game_card = active_game.player_game_cards.joins(:card).find_by(cards: { suit_id: params[:suit_id], raw_value: params[:raw_value] })
    return render json: "Invalid card", status: 400 if player_game_card.nil?

    player = Player.find_by(id: params[:player_id])
    return render json: "Player does not exist" if player.nil?
    return render json: "Player does not have this card" if player_game_card.player_id != player.id
    # check that card wasn't already played
    return render json: "Card was already played" if !player_game_card.hand_id.nil?

    # all of the cards have already been played
    if active_game.player_game_cards.where.not(hand_id: nil) == active_game.game.cards_in_deck.count
      return render json: "All of the cards have already been played"
    end

    return render json: "You can't play yet. It's not your turn" if active_game.current_player_turn != player.id

    # this was designed this way so that the old hand still shows until the next card is played
    curr_hand = active_game.current_hand
    num_cards_in_current_hand = curr_hand.player_game_cards.count
    # the current hand has the maximum number of cards played
    if num_cards_in_current_hand == active_game.game.num_players
      # TODO add in a transaction
      # need to create new hand
      hand = active_game.hands.create(number: active_game.hands.maximum(:number) + 1)
      return render json: "Unable to create next hand", status: 400 if hand.nil?
      # play the card in the hand
      return render json: "Unable to play card", status: 400 if !player_game_card.update(hand_id: hand.id)
    end

    # the current hand still have more cards to be played
    # TODO wrap in transaction
    return render json: "Unable to play card", status: 400 if !player_game_card.update(hand_id: curr_hand.id)

    # did playing this card finish the hand? we need to compute the score
    if (num_cards_in_current_hand + 1) == active_game.game.num_players
      winning_card, score = BriscolaHandWinnerComputer.calculate_winner(active_game.cards_in_current_hand.order(:updated_at), active_game.briscola_suit)
      # update the hand with the score and winner
      return render json: "Unable to calculate score" if !curr_hand.update(winner_id: winning_card.player_id, score: score)

      # if it didn't finish the game, let's create the next hand
      if active_game.player_game_cards.where.not(hand_id: nil) != active_game.game.cards_in_deck.count
        hand = active_game.hands.create(number: curr_hand.number + 1)
        return render json: "Unable to create next hand", status: 400 if hand.nil?
      end
    end

    return render json: { game_state: GameState.get_player_state(player: player, active_game: active_game) }
  end
end
