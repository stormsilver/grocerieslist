class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.string :name
      t.boolean :needed, default: false
      t.belongs_to :category, null: true, foreign_key: true
      t.belongs_to :account, null: false, foreign_key: true
      t.timestamps
    end
  end
end
