class AddLockVersionToSyncTables < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :lock_version, :integer, null: false, default: 0
    add_column :categories, :lock_version, :integer, null: false, default: 0
    add_column :stores, :lock_version, :integer, null: false, default: 0
    add_column :store_items, :lock_version, :integer, null: false, default: 0
  end
end
