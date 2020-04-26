def BidsController < ApplicationController
  def make_bid
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid active game", status: 400 if active_game.nil?
    return render json: "This game does not require bidding", status: 400 if !active_game.game.requires_bidding
    return render json: "Bidding is already done", status: 400 if active_game.bidding_done
    player = Player.find_by(id: params[:player_id])
    return render json: "Player does not exist" if player.nil?
    player_in_game = active_game.player_active_game_bids.where(player_id: player.id)
    return render json: "Player not in game", status: 400 if player_in_game.nil?
    player_in_game.bid = params[:bid].to_i
    return render json: "Unable to make bid", status: 400 if !player_in_game.save
    render json: "Bid made", status: 200
  end

  def pass_bid
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid active game", status: 400 if active_game.nil?
    return render json: "This game does not require bidding", status: 400 if !active_game.game.requires_bidding
    return render json: "Bidding is already done", status: 400 if active_game.bidding_done
    player = Player.find_by(id: params[:player_id])
    return render json: "Player does not exist" if player.nil?
    player_in_game = active_game.player_active_game_bids.where(player_id: player.id)
    return render json: "Player not in game", status: 400 if player_in_game.nil?
    player_in_game.passed = true
    return render json: "Unable to pass", status: 400 if !player_in_game.save

    # if all of the required players - 1 passed, bidding is done and the non-passed bidder
    # has won; should have the highest as well
    if active_game.player_active_game_bids.where(passed: true).count == (active_game.game.num_players - 1)
      return render json: "Unable to complete bidding", status: 400 if !active_game.update(bidding_done: true)
    end

    render json: "Pass complete", status: 200
  end

  def set_partner_card
    suit_id = params[:suit_id]
    raw_value = params[:raw_value]



    # TODO need to find a place to record the desired card and the partners
  end
end
