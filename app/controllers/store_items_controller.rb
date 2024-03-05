class StoreItemsController < ApplicationController
  before_action :set_store_item, only: %i[show]

  # GET /store_items
  # GET /store_items.json
  def index
    @store_items = StoreItem.all
  end

  # PATCH/PUT /store_items
  # PATCH/PUT /store_items.json
  def update_bulk
    Rails.logger.ap store_item_params_for_bulk_update
    # split out any that are new
    existing_items, new_items = store_item_params_for_bulk_update.partition { |item| item[:id] }

    # split out any that need to be destroyed
    items_to_destroy, items_to_update = existing_items.partition { |item| item[:_destroy] }

    # split out any that need to be updated
    items_to_update = items_to_update.index_by { |item| item[:id] }

    ActiveRecord::Base.transaction do
      StoreItem.create!(allow_create_values(new_items))
      StoreItem.destroy(items_to_destroy.map { |item| item[:id] })
      StoreItem.update!(items_to_update.keys, allow_update_values(items_to_update.values))
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_store_item
    @store_item = StoreItem.find(params[:id])
  end

  def store_item_params_for_bulk_update
    params.require(:store_items).collect do |item_params|
      item_params.permit(:id, :store_id, :order, :item_id, :_destroy)
    end
  end

  def allow_update_values(values)
    values.map do |value|
      value.slice(:order)
    end
  end

  def allow_create_values(new_items)
    new_items.collect do |item_data|
      {
        store_id: item_data[:store_id],
        order: item_data[:order],
        item_id: item_data[:item_id],
        account_id: Current.account.id
      }
    end
  end
end
