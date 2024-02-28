class CreateStores < ActiveRecord::Migration[7.1]
  def change
    create_table :stores do |t|
      t.string :name
      t.belongs_to :account, null: false, foreign_key: true
      t.timestamps
    end
  end
end
