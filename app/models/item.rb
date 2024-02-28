class Item < ApplicationRecord
  belongs_to :account
  belongs_to :category, optional: true
end
