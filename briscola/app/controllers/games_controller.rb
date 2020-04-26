require 'game_state'

class GamesController < ApplicationController
  def index
  end

  def join
    # param game ID and player name
    # or error if there are already 5 players
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Unable to join game", status: 400 if active_game.nil?
    num_players_in_game = active_game.player_active_game_bids.count
    if active_game.player_active_game_bids.count >= active_game.game.num_players
      return render json: "Unable to join game because it's already full", status: 400
    end
    player = Player.find_or_create_by(name: params[:player_name])
    player_in_game = active_game.player_active_game_bids.new(player_id: player.id)
    return render json: "Unable to join active game", status: 400 if !player_in_game.save
    render json: "Joining game", status: 200
  end

  # create a game for others to play
  def create
    # param should be the game type (Briscola Chiamata will be the only one supported for now)
    # should return an ID and URL for the game
    game = Game.find_by(id: params[:game_id])
    return render json: 'Please specify a valid game type', status: 400 if  game.nil?
    player = Player.find_or_create_by(name: params[:player_name])
    active_game = game.active_games.new(name: params[:active_game_name])
    return render json: "Unable to start game", status: 400 if !active_game.save
    player_in_game = active_game.player_active_game_bids.new(player_id: player.id)
    return render json: "Unable to join game", status: 400 if !player_in_game.save
    render json: url_for(controller: 'games', action: 'show', id: active_game.id).html_safe, status: 200
  end

  # show the game status
  # this should be hit every few seconds to update the state seen by each player
  def show
    player = Player.find_by(id: params[:player_id])
    return render json: "Invalid player", status: 400 if player.nil?
    active_game = ActiveGame.find_by(id: params[:game_id])
    if active_game.nil? || !active_game.player_active_game_bids.where(player_id: player.id).exists?
      return render json: "Invalid game", status: 400
    end
    show_score = params[:show_score] == "true" || params[:show_score] == true
    return render json: GameState.get_player_state(player: player, active_game: active_game, show_score: show_score), status: 200
  end
end
