account = Account.create! name: 'My Account'

# categories
Category.create! account:, name: 'Dairy'
Category.create! account:, name: 'Produce'
Category.create! account:, name: 'Bakery'
Category.create! account:, name: 'Pantry'

# stores
Store.create! account:, name: 'Amazon'
Store.create! account:, name: 'Walmart'
Store.create! account:, name: 'Target'

# items
Item.create! account:, name: 'Kindle', needed: true, category_id: 1
Item.create! account:, name: 'Echo Dot', needed: false, category_id: 2
Item.create! account:, name: 'Fire TV Stick', needed: true, category_id: 3
Item.create! account:, name: 'The Pragmatic Programmer', needed: true, category_id: 1
Item.create! account:, name: 'Clean Code', needed: false, category_id: 2
Item.create! account:, name: 'The Mythical', needed: true, category_id: 3
Item.create! account:, name: 'Great Value Milk', needed: true, category_id: 1
Item.create! account:, name: 'Great Value Cheese', needed: false, category_id: 2
Item.create! account:, name: 'Great Value Yogurt', needed: true, category_id: 3
Item.create! account:, name: 'Great Value Carrots', needed: true
Item.create! account:, name: 'Great Value Lettuce', needed: false
Item.create! account:, name: 'Great Value Kale', needed: true
Item.create! account:, name: 'Up & Up Bread', needed: true, category_id: 2
Item.create! account:, name: 'Up & Up Bagels', needed: false, category_id: 2
Item.create! account:, name: 'Up & Up Donuts', needed: true, category_id: 1
Item.create! account:, name: 'Up & Up Muffins', needed: true, category_id: 2
Item.create! account:, name: 'Up & Up Rice', needed: true, category_id: 2
Item.create! account:, name: 'Up & Up Pasta', needed: false, category_id: 2
Item.create! account:, name: 'Up & Up Cereal', needed: true
Item.create! account:, name: 'Up & Up Pop Tarts', needed: true, category_id: 3
Item.create! account:, name: 'Up & Up Popcorn', needed: true, category_id: 1
Item.create! account:, name: 'Up & Up Peanut Butter', needed: true


# store_items
StoreItem.create! account:,  id: 1, order: 1, item_id: 1
StoreItem.create! account:,  id: 2, order: 2, item_id: 2, store_id: 1
StoreItem.create! account:,  id: 3, item_id: 3, store_id: 1
StoreItem.create! account:,  id: 4, item_id: 4, store_id: 1
StoreItem.create! account:,  id: 5, order: 5, item_id: 5, store_id: 2
StoreItem.create! account:,  id: 6, order: 6, item_id: 6, store_id: 3
StoreItem.create! account:,  id: 7, order: 7, item_id: 7, store_id: 1
StoreItem.create! account:,  id: 8, order: 8, item_id: 8, store_id: 2
StoreItem.create! account:,  id: 9, order: 9, item_id: 9, store_id: 1
StoreItem.create! account:,  id: 10, order: 10, item_id: 10, store_id: 1
StoreItem.create! account:,  id: 11, order: 11, item_id: 11, store_id: 1
StoreItem.create! account:,  id: 12, order: 12, item_id: 12, store_id: 1
StoreItem.create! account:,  id: 13, order: 1, item_id: 13, store_id: 2
StoreItem.create! account:,  id: 14, order: 2, item_id: 14, store_id: 1
StoreItem.create! account:,  id: 15, order: 3, item_id: 15, store_id: 1
StoreItem.create! account:,  id: 16, order: 16, item_id: 16, store_id: 1
StoreItem.create! account:,  id: 17, order: 17, item_id: 17, store_id: 3
StoreItem.create! account:,  id: 18, order: 18, item_id: 18, store_id: 1
StoreItem.create! account:,  id: 19, order: 19, item_id: 19, store_id: 3
StoreItem.create! account:,  id: 20, order: 19, item_id: 19, store_id: 2
StoreItem.create! account:,  id: 21, order: 20, item_id: 20, store_id: 1
StoreItem.create! account:,  id: 22, order: 1, item_id: 20, store_id: 2
StoreItem.create! account:,  id: 23, order: 2, item_id: 20, store_id: 3
