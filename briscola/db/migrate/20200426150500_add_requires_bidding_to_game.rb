class AddRequiresBiddingToGame < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :requires_bidding, :boolean
  end
end
