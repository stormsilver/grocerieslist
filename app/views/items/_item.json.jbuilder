json.extract! item, :id, :created_at, :updated_at, :name, :needed, :category_id
json.url item_url(item, format: :json)
