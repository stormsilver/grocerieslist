mode = ARGV.first || 'default'

StoreItem.delete_all
Item.delete_all
Store.delete_all
AccountUser.delete_all
Category.delete_all
User.delete_all
Account.delete_all

account = Account.create!(name: 'Playwright household')
User.create!
store = Store.create!(account:, name: 'Playwright store')
second_store = Store.create!(account:, name: 'Second Playwright store')

120.times do |index|
  name = format('Product %03d', index + 1)
  name = 'Z tie' if mode == 'duplicates' && index == 10
  name = 'A tie' if mode == 'duplicates' && index == 11
  item = Item.create!(account:, name:, needed: true)
  order = if mode == 'duplicates' && index == 11
    11
  elsif mode == 'invalid' && index == 0
    0
  elsif mode == 'invalid' && index == 1
    nil
  elsif mode == 'invalid' && index == 2
    -1
  else
    index + 1
  end
  StoreItem.create!(account:, store:, item:, order:)

  if index < 3
    StoreItem.create!(account:, store: second_store, item:, order: [3, 1, 2][index])
  end
end
