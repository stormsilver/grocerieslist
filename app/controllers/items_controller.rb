class ItemsController < ApplicationController
  before_action :set_item, only: %i[show]

  # GET /items
  # GET /items.json
  def index
    @items = Item.all
  end

  # PATCH/PUT /items
  # PATCH/PUT /items.json
  def update_bulk
    Rails.logger.ap item_params_for_bulk_update

    # split out any that are new
    existing_items, new_items = item_params_for_bulk_update.partition { |item| item[:id] }

    # split out any that need to be destroyed
    items_to_destroy, items_to_update = existing_items.partition { |item| item[:_destroy] }

    # split out any that need to be updated
    items_to_update = items_to_update.index_by { |item| item[:id] }

    ActiveRecord::Base.transaction do
      Item.create!(allow_create_values(new_items))
      Item.destroy(items_to_destroy.map { |item| item[:id] })
      Item.update!(items_to_update.keys, allow_update_values(items_to_update.values))
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = Item.find(params[:id])
  end

  def item_params_for_bulk_update
    params.require(:items).collect do |item_params|
      item_params.permit(:id, :name, :needed, :category_id, :_destroy)
    end
  end

  def allow_update_values(values)
    values.map do |value|
      value.slice(:name, :needed, :category_id)
    end
  end

  def allow_create_values(new_items)
    new_items.map do |new_item|
      {
        name: new_item[:name],
        needed: new_item[:needed],
        category_id: new_item[:category_id],
        account_id: Current.account.id
      }
    end
  end
end
