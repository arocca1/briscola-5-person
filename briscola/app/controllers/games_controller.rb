class GamesController < ApplicationController
  def index
  end

  def join
    # param game ID and player name
    # or error if there are already 5 players
  end

  # create a game for others to play
  def create
    # param should be the game type (Briscola Chiamata will be the only one supported for now)
    # should return an ID and URL for the game
    game = Game.find_by(id: params[:game_id])
    return render json: 'Please specify a valid game type', status: 400 if  game.nil?
    player = Player.find_or_create_by(name: params[:player_name])
    active_game = game.active_games.new(name: params[:active_game_name])
    return render json: "Unable to start game" if !active_game.save
    player_in_game = active_game.player_active_game_bids.new(player_id: player.id)
    return render json: "Unable to join game" if !player_in_game.save
    render json: url_for(controller: 'games', action: 'show', id: active_game.id).html_safe, status: 200
  end

  # show the create game button
  def show
  end
end
