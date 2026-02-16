class StoresController < ApplicationController
  before_action :set_store, only: %i[show]

  # GET /stores
  # GET /stores.json
  def index
    @stores = Store.all
  end

  # PATCH/PUT /stores
  # PATCH/PUT /stores.json
  def update_bulk
    Rails.logger.ap store_params_for_bulk_update
    payload = store_params_for_bulk_update

    if payload.empty?
      head :no_content
      return
    end

    # split out any that are new
    existing_stores, new_stores = payload.partition { |store| store[:id] }

    # split out any that need to be destroyed
    stores_to_destroy, stores_to_update = existing_stores.partition { |store| store[:_destroy] }

    # split out any that need to be updated
    stores_to_update = stores_to_update.index_by { |store| store[:id] }

    conflicts = store_conflicts(stores_to_update.values + stores_to_destroy)
    if conflicts.any?
      render_conflicts(conflicts)
      return
    end

    created_stores = []
    updated_stores = []
    destroyed_ids = []

    ActiveRecord::Base.transaction do
      created_stores = Store.create!(allow_create_values(new_stores))

      destroyed_ids = stores_to_destroy.map do |store|
        record = Store.find_by!(account_id: Current.account.id, id: store[:id])
        record.destroy!
        record.id
      end

      stores_by_id = Store.where(account_id: Current.account.id, id: stores_to_update.keys).index_by(&:id)
      updated_stores = stores_to_update.values.map do |store|
        record = stores_by_id.fetch(store[:id])
        record.assign_attributes(allow_update_value(store))
        record.save!
        record
      end
    end

    broadcast_changes(
      type: 'stores',
      updates: serialize_records(
        created_stores + updated_stores,
        fields: %w[id created_at updated_at name]
      ),
      deletes: destroyed_ids
    )

    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_store
    @store = Store.find(params[:id])
  end

  def store_params_for_bulk_update
    params.require(:stores).collect do |store_params|
      store_params.permit(:id, :name, :_destroy, :lock_version)
    end
  end

  def allow_update_value(value)
    value.slice(:name)
  end

  def allow_create_values(new_stores)
    new_stores.map do |new_store|
      {
        name: new_store[:name],
        account_id: Current.account.id
      }
    end
  end

  def store_conflicts(payloads)
    return [] if payloads.empty?

    stores_by_id = Store.where(account_id: Current.account.id, id: payloads.map { |store| store[:id] })
                        .index_by(&:id)

    payloads.filter_map do |store|
      record = stores_by_id[store[:id]]
      if record.nil?
        { id: store[:id], reason: 'missing' }
      elsif store[:lock_version].nil?
        {
          id: record.id,
          reason: 'missing_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at name]).first
        }
      elsif record.lock_version != store[:lock_version].to_i
        {
          id: record.id,
          reason: 'stale_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at name]).first
        }
      end
    end
  end
end
