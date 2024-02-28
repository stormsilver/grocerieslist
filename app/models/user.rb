class User < ApplicationRecord
  has_many :accounts, through: :account_users
end
