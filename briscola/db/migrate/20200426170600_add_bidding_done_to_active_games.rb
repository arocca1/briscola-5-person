class AddBiddingDoneToActiveGames < ActiveRecord::Migration[6.0]
  def change
    add_column :active_games, :bidding_done, :boolean
  end
end
