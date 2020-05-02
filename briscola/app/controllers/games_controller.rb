require 'game_state'

class GamesController < ApplicationController
  def index
  end

  def join
    # param game ID and player name
    # or error if there are already 5 players
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Unable to join game", status: 400 if active_game.nil?
    player = Player.find_or_create_by(name: params[:player_name])
    player_in_game = active_game.player_active_game_bids.find_by(player_id: player.id)
    num_players_in_game = active_game.player_active_game_bids.count
    if player_in_game.nil?
      if active_game.player_active_game_bids.count >= active_game.game.num_players
        return render json: "Unable to join game because it's already full", status: 400
      end
      player_in_game = active_game.player_active_game_bids.create(player_id: player.id)
      return render json: "Unable to join active game", status: 400 if player_in_game.nil?
    end
    # we must deal the cards if the last player joins
    if active_game.player_active_game_bids.count == active_game.game.num_players && !active_game.hands.exists?
      return render json: "Unable to deal cards", status: 500 if !active_game.deal_cards
    end
    render json: { game_state: GameState.get_player_state(player: player, active_game: active_game) }
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
    return render json: "Unable to enter game", status: 400 if !player_in_game.save
    render json: { game_id: active_game.id.to_s, player_id: player.id.to_s }, status: 200
  end

  def show
    @active_game_id = params[:id].to_s
  end

  # show the game status
  # this should be hit every few seconds to update the state seen by each player
  def show_json
    player = Player.find_by(id: params[:player_id])
    return render json: "Invalid player", status: 400 if player.nil?
    active_game = ActiveGame.find_by(id: params[:game_id])
    if active_game.nil? || !active_game.player_active_game_bids.where(player_id: player.id).exists?
      return render json: "Invalid game", status: 400
    end
    show_score = params[:show_score] == "true" || params[:show_score] == true
    render json: { game_state: GameState.get_player_state(player: player, active_game: active_game, show_score: show_score) }
  end

  def get_supported_games
    render json: Game.all.map { |g| { id: g.id.to_s, name: g.name } }
  end

  def create_new_and_join
    previous_active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid game", status: 400 if previous_active_game.nil?
    player = Player.find_by(id: params[:player_id])
    return render json: "Invalid player", status: 400 if player.nil?
    return render json: "Player was not in game", status: 400 if !previous_active_game.player_active_game_bids.where(player_id: player.id).exists?

    active_game = ActiveGame.new(game_id: previous_active_game.game_id, name: "#{previous_active_game}+")
    return render json: "Unable to start game", status: 400 if !active_game.save
    previous_active_game.player_active_game_bids.pluck(:player_id).each do |player_id|
      player_in_game = active_game.player_active_game_bids.new(player_id: player_id)
      return render json: "Unable to join active game", status: 400 if !player_in_game.save
    end
    return render json: "Unable to deal cards", status: 500 if !active_game.deal_cards

    render json: { game_id: active_game.id.to_s, player_id: player.id.to_s, game_state: GameState.get_player_state(player: player, active_game: active_game) }
  end
end
