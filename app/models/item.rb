class Item < ApplicationRecord
  belongs_to :account
  belongs_to :category, optional: true
  has_many :store_items, dependent: :destroy

  validates :name, presence: true
  validates_uniqueness_of :name, scope: :account_id, case_sensitive: false, on: :create
end
