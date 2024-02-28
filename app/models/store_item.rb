class StoreItem < ApplicationRecord
  belongs_to :account
  belongs_to :store, optional: true
  belongs_to :item
end
