# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_02_19_122421) do
  create_table "account_users", force: :cascade do |t|
    t.integer "account_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id", "user_id"], name: "index_account_users_on_account_id_and_user_id", unique: true
    t.index ["account_id"], name: "index_account_users_on_account_id"
    t.index ["user_id"], name: "index_account_users_on_user_id"
  end

  create_table "accounts", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_categories_on_account_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.boolean "needed", default: false
    t.integer "category_id"
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_items_on_account_id"
    t.index ["category_id"], name: "index_items_on_category_id"
  end

  create_table "store_items", force: :cascade do |t|
    t.integer "order"
    t.boolean "available", default: true
    t.integer "store_id"
    t.integer "item_id", null: false
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_store_items_on_account_id"
    t.index ["item_id"], name: "index_store_items_on_item_id"
    t.index ["store_id", "item_id"], name: "index_store_items_on_store_id_and_item_id", unique: true
    t.index ["store_id"], name: "index_store_items_on_store_id"
  end

  create_table "stores", force: :cascade do |t|
    t.string "name"
    t.integer "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_stores_on_account_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "account_users", "accounts"
  add_foreign_key "account_users", "users"
  add_foreign_key "categories", "accounts"
  add_foreign_key "items", "accounts"
  add_foreign_key "items", "categories"
  add_foreign_key "store_items", "accounts"
  add_foreign_key "store_items", "items"
  add_foreign_key "store_items", "stores"
  add_foreign_key "stores", "accounts"
end
