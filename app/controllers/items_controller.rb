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

    payload = item_params_for_bulk_update
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

    conflicts = item_conflicts(items_to_update.values + items_to_destroy)
    if conflicts.any?
      render_conflicts(conflicts)
      return
    end

    created_items = []
    updated_items = []
    destroyed_ids = []

    ActiveRecord::Base.transaction do
      created_items = Item.create!(allow_create_values(new_items))

      destroyed_ids = items_to_destroy.map do |item|
        record = Item.find_by!(account_id: Current.account.id, id: item[:id])
        record.destroy!
        record.id
      end

      items_by_id = Item.where(account_id: Current.account.id, id: items_to_update.keys).index_by(&:id)
      updated_items = items_to_update.values.map do |item|
        record = items_by_id.fetch(item[:id])
        record.assign_attributes(allow_update_value(item))
        record.save!
        record
      end
    end

    broadcast_changes(
      type: 'items',
      updates: serialize_records(
        created_items + updated_items,
        fields: %w[id created_at updated_at name needed category_id]
      ),
      deletes: destroyed_ids
    )

    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = Item.find(params[:id])
  end

  def item_params_for_bulk_update
    params.require(:items).collect do |item_params|
      item_params.permit(:id, :name, :needed, :category_id, :_destroy, :lock_version)
    end
  end

  def allow_update_value(value)
    value.slice(:name, :needed, :category_id)
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

  def item_conflicts(payloads)
    return [] if payloads.empty?

    items_by_id = Item.where(account_id: Current.account.id, id: payloads.map { |item| item[:id] }).index_by(&:id)

    payloads.filter_map do |item|
      record = items_by_id[item[:id]]
      if record.nil?
        { id: item[:id], reason: 'missing' }
      elsif item[:lock_version].nil?
        {
          id: record.id,
          reason: 'missing_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at name needed category_id]).first
        }
      elsif record.lock_version != item[:lock_version].to_i
        {
          id: record.id,
          reason: 'stale_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at name needed category_id]).first
        }
      end
    end
  end
end
