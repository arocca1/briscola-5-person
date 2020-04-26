# == Schema Information
#
# Table name: active_games
#
#  id           :bigint           not null, primary key
#  name         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  game_id      :bigint
#  bidding_done :boolean
#
class ActiveGame < ApplicationRecord
  belongs_to :game, inverse_of: :active_games
  has_many :player_game_cards, inverse_of: :active_game
  has_many :player_active_game_bids, inverse_of: :active_game
  has_many :active_game_partners, inverse_of: :active_game
  has_many :hands, inverse_of: :active_game

  def previous_hand
    self.hands.where("hands.number = (#{self.hands.select('MAX(number)').to_sql}) - 1")
  end

  def current_hand
    self.hands.where("hands.number = (#{self.hands.select('MAX(number)').to_sql})")
  end

  def cards_in_current_hand
    self.player_game_cards.includes(:card).joins(:hand).where("hands.number = (#{self.hands.select('MAX(number)').to_sql})")
  end

  def players_in_game
    Player.joins(:player_active_game_bids).where(player_active_game_bids: { active_game_id: self.id })
  end

  def ordered_players_in_game
    Player.joins(:player_active_game_bids).where(player_active_game_bids: { active_game_id: self.id }).order(PlayerActiveGameBid.arel_table[:created_at])
  end

  def brisola_suit
    self.player_game_cards.where(player_game_cards: { is_partner_card: true }).joins(:card).pluck('cards.id').first
  end

  def partner_card
    self.player_game_cards.find_by(player_game_cards: { is_partner_card: true })
  end

  def current_player_turn
    player_ids = self.ordered_players_in_game.pluck(:id)

    curr_hand = self.current_hand
    cards_played_in_current_hand = self.cards_in_current_hand.count
    # if this is the very first hand, i.e. no cards have been played, let's
    # choose the second person to join as it being their turn, i.e. the person
    # who started the game goes last
    # if some number of cards have been played, we are displaced from that
    # many positions from the second person to join
    prev_winner_id = self.previous_hand.pluck(:winner_id).first
    prev_winner_idx = curr_hand.number == 1 ? 0 : player_ids.index(prev_winner_id)
    player_ids[(prev_winner_idx + 1 + cards_played_in_current_hand) % self.game.num_players]
  end
end
