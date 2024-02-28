class CreateStoreItems < ActiveRecord::Migration[7.1]
  def change
    create_table :store_items do |t|
      t.integer :order
      t.boolean :available, default: true
      t.belongs_to :store, null: true, foreign_key: true
      t.belongs_to :item, null: false, foreign_key: true
      t.belongs_to :account, null: false, foreign_key: true
      t.timestamps
    end
  end
end
