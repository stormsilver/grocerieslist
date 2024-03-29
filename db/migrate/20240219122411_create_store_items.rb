class CreateStoreItems < ActiveRecord::Migration[7.1]
  def change
    create_table :store_items do |t|
      t.integer :order
      t.belongs_to :store, null: true, foreign_key: true, index: false
      t.belongs_to :item, null: false, foreign_key: true
      t.belongs_to :account, null: false, foreign_key: true
      t.timestamps

      t.index %i[store_id item_id], unique: true
    end
  end
end
