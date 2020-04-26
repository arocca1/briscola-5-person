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
    bid = params[:bid].to_i
    return render json: "Bid must be between 61 and 120", status: 400 if bid < 61 || bid > 120
    return render json: "Unable to make bid", status: 400 if !player_in_game.update(bid: bid)
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
    return render json: "Unable to pass", status: 400 if !player_in_game.update(passed: true)

    # if all of the required players - 1 passed, bidding is done and the non-passed bidder
    # has won; should have the highest as well
    if active_game.player_active_game_bids.where(passed: true).count == (active_game.game.num_players - 1)
      return render json: "Unable to complete bidding", status: 400 if !active_game.update(bidding_done: true)
    end

    render json: "Pass complete", status: 200
  end

  def set_partner_card
    active_game = ActiveGame.find_by(id: params[:game_id])
    return render json: "Invalid active game", status: 400 if active_game.nil?
    player = Player.find_by(id: params[:player_id])
    return render json: "Player does not exist" if player.nil?
    player_in_game = active_game.player_active_game_bids.where(player_id: player.id)
    return render json: "Player not in game", status: 400 if player_in_game.nil?
    return render json: "You did not have the highest bid", status: 400 if player_in_game.bid != active_game.player_active_game_bids.maximum(:bid)

    suit_id = params[:suit_id]
    raw_value = params[:raw_value]
    # TODO wrap this in a transaction
    player_game_card = active_game.player_game_cards.joins(:card).where(cards: { raw_value: raw_value, suit_id: suit_id })
    return render json: "You have this card. It cannot be the partner card" if player_game_card.player_id == player.id

    return render json: "Could not set this card to be the partner card" if !player_game_card.update(is_partner_card: true)

    bidder_team = [player_game_card.player_id, player.id]
    active_game.active_game_partners.create!(player_id: player_game_card.player_id, partner_id: player.id)
    active_game.active_game_partners.create!(player_id: player.id, partner_id: player_game_card.player_id)
    other_team = active_game.players_in_game.pluck(:player_id) - bidder_team
    other_team.each do |p|
      (other_team - [p]).each do |other_p|
        active_game.active_game_partners.create!(player_id: p.id, partner_id: other_p.id)
      end
    end
    render json: "Created partners", status: 200
  end
end
