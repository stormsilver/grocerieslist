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
    payload = store_item_params_for_bulk_update

    if payload.empty?
      head :no_content
      return
    end

    # split out any that are new
    existing_items, new_items = payload.partition { |item| item[:id] }

    # split out any that need to be destroyed
    items_to_destroy, items_to_update = existing_items.partition { |item| item[:_destroy] }

    # split out any that need to be updated
    items_to_update = items_to_update.index_by { |item| item[:id] }

    conflicts = store_item_conflicts(items_to_update.values + items_to_destroy)
    if conflicts.any?
      render_conflicts(conflicts)
      return
    end

    created_items = []
    updated_items = []
    destroyed_ids = []

    ActiveRecord::Base.transaction do
      created_items = StoreItem.create!(allow_create_values(new_items))

      destroyed_ids = items_to_destroy.map do |item|
        record = StoreItem.find_by!(account_id: Current.account.id, id: item[:id])
        record.destroy!
        record.id
      end

      items_by_id = StoreItem.where(account_id: Current.account.id, id: items_to_update.keys).index_by(&:id)
      updated_items = items_to_update.values.map do |item|
        record = items_by_id.fetch(item[:id])
        record.assign_attributes(allow_update_value(item))
        record.save!
        record
      end
    end

    broadcast_changes(
      type: 'store_items',
      updates: serialize_records(
        created_items + updated_items,
        fields: %w[id created_at updated_at store_id item_id order]
      ),
      deletes: destroyed_ids
    )

    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_store_item
    @store_item = StoreItem.find(params[:id])
  end

  def store_item_params_for_bulk_update
    params.require(:store_items).collect do |item_params|
      item_params.permit(:id, :store_id, :order, :item_id, :_destroy, :lock_version)
    end
  end

  def allow_update_value(value)
    value.slice(:order)
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

  def store_item_conflicts(payloads)
    return [] if payloads.empty?

    items_by_id = StoreItem.where(account_id: Current.account.id, id: payloads.map { |item| item[:id] }).index_by(&:id)

    payloads.filter_map do |item|
      record = items_by_id[item[:id]]
      if record.nil?
        { id: item[:id], reason: 'missing' }
      elsif item[:lock_version].nil?
        {
          id: record.id,
          reason: 'missing_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at store_id item_id order]).first
        }
      elsif record.lock_version != item[:lock_version].to_i
        {
          id: record.id,
          reason: 'stale_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at store_id item_id order]).first
        }
      end
    end
  end
end
