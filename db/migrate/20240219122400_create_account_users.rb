class CreateAccountUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :account_users do |t|
      t.belongs_to :account, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.index [:account_id, :user_id], unique: true
      t.timestamps
    end
  end
end
