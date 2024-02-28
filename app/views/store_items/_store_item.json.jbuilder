json.extract! store_item, :id, :created_at, :updated_at, :store_id, :item_id, :order
json.url store_item_url(store_item, format: :json)
