class Item < ApplicationRecord
  belongs_to :account
  belongs_to :category, optional: true
  has_many :store_items, dependent: :destroy

  validates :name, presence: true
end
