class AddNumberToHandsTable < ActiveRecord::Migration[6.0]
  def change
    add_column :hands, :number, :integer
  end
end
