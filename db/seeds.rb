# frozen_string_literal: true

account = Account.create! name: 'My Account'

# categories
Category.create! account:, name: 'Dairy'
Category.create! account:, name: 'Produce'
Category.create! account:, name: 'Bakery'
Category.create! account:, name: 'Pantry'

# stores
aldi1 = Store.create! account:, name: 'Aldi 119th'
aldi2 = Store.create! account:, name: 'Aldi 95th'
walmart = Store.create! account:, name: 'Walmart 135th'
Store.create! account:, name: 'Target 119th'
Store.create! account:, name: 'Costco'

# items
Item.create! account:, name: 'Allergy pills', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Flonase', needed: true, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Prilosec (Omeprazole)', needed: true,
             store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Fiber gummies', needed: true, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Adult multivitamins', needed: true, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Deodorant', needed: true, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Flossers', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Floss', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Corn dogs', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Chili powder', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Lasagna Noodles', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Pull ups', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Salsa', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Rotel', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Velveeta', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Tabasco', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Crisco', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Diapers', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Spaghetti sauce', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Hand soap', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Prunes', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Face soap and lotion', needed: false,
             store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Lunchables', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Chips', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Pads', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'PB Powder', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Frozen rolls', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Egg roll', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Mascara', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Diaper cream', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Vanilla', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Cream of tartar', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Baking Powder', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Sponges', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Stamps', needed: true, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Valentines', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Tortillas', needed: false, store_items: [StoreItem.new(store: walmart, account:)]
Item.create! account:, name: 'Coffee filters', needed: true, store_items: [StoreItem.new(store: walmart, account:)]

Item.create! account:, name: 'Peanuts', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sausage Sticks', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Summer sausage', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Crackers', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Fruit', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Apples', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Mandarins', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Blueberries', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cherries', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cantaloupe', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Grapes', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Bananas', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Strawberries', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Watermelon', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Berries', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Lemon', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Carrots', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Celery', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cucumber', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Peppers', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Tomatoes', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Avocados', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Squash', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Lettuce', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cilantro', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Onion', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Spinach', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Potatoes', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sweet potatoes', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Bread', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Buns', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Bagels', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Tortilla Chips', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Potato chips', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Pretzels', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Milk', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Eggs', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cream cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Yogurt', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cottage cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sour cream', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Oatmeal', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Syrup', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cereal', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cheerios', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Juice', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Applesauce', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Honey', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Grape jelly', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Strawberry jam', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Italian Dressing', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Orange marmalade', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Peanut Butter', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'BBQ sauce', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Mayo', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Pickle Relish', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Mustard', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Ketchup', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Refried Beans', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Green chiles', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Taco seasoning', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sausage gravy mix', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Soy sauce', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sesame oil', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Tomato Sauce', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Diced Tomatoes', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Black beans', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Kidney beans', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Baked beans', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Tomato soup', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Crushed tomatoes', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Tomato Paste', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Chicken broth', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cream of chicken', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cream of mushroom', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Spaghetti Sauce', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Box Mac & Cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Stuffing', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Pasta', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Lasagna noodles', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Egg noodles', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Breadcrumbs', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Pepperoni', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Spaghetti', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Rice', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Flour', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cocoa Powder', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Brown Sugar', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Powdered Sugar', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Shredded Cheddar Cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sliced cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sliced American Cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Mozzarella Cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Block cheese', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Hummus', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Ham', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Turkey', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Beef', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Bacon', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Biscuit can', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Hot dogs', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Kielbasa', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Brats', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Italian sausage', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Chunk Ham', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Broccoli', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Frozen Veggies', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Frozen peas', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Corn', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Sausages', needed: false,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Ground sausage', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Corn Tortillas', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Paprika', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Garlic powder', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cream of Tartar', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cinnamon', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Baking powder', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Worcestershire sauce', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Raisins', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Goldfish/cheese its', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Stick Butter', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Spread Butter', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Vegetable oil', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Cough drops', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Clorox wipes', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]
Item.create! account:, name: 'Ice cream', needed: true,
             store_items: [StoreItem.new(store: aldi1, account:), StoreItem.new(store: aldi2, account:)]

# store_items
# StoreItem.create! account:,  id: 1, order: 1, item_id: 1
# StoreItem.create! account:,  id: 2, order: 2, item_id: 2, store_id: 1
# StoreItem.create! account:,  id: 3, item_id: 3, store_id: 1
# StoreItem.create! account:,  id: 4, item_id: 4, store_id: 1
# StoreItem.create! account:,  id: 5, order: 5, item_id: 5, store_id: 2
# StoreItem.create! account:,  id: 6, order: 6, item_id: 6, store_id: 3
# StoreItem.create! account:,  id: 7, order: 7, item_id: 7, store_id: 1
# StoreItem.create! account:,  id: 8, order: 8, item_id: 8, store_id: 2
# StoreItem.create! account:,  id: 9, order: 9, item_id: 9, store_id: 1
# StoreItem.create! account:,  id: 10, order: 10, item_id: 10, store_id: 1
# StoreItem.create! account:,  id: 11, order: 11, item_id: 11, store_id: 1
# StoreItem.create! account:,  id: 12, order: 12, item_id: 12, store_id: 1
# StoreItem.create! account:,  id: 13, order: 1, item_id: 13, store_id: 2
# StoreItem.create! account:,  id: 14, order: 2, item_id: 14, store_id: 1
# StoreItem.create! account:,  id: 15, order: 3, item_id: 15, store_id: 1
# StoreItem.create! account:,  id: 16, order: 16, item_id: 16, store_id: 1
# StoreItem.create! account:,  id: 17, order: 17, item_id: 17, store_id: 3
# StoreItem.create! account:,  id: 18, order: 18, item_id: 18, store_id: 1
# StoreItem.create! account:,  id: 19, order: 19, item_id: 19, store_id: 3
# StoreItem.create! account:,  id: 20, order: 19, item_id: 19, store_id: 2
# StoreItem.create! account:,  id: 21, order: 20, item_id: 20, store_id: 1
# StoreItem.create! account:,  id: 22, order: 1, item_id: 20, store_id: 2
# StoreItem.create! account:,  id: 23, order: 2, item_id: 20, store_id: 3
