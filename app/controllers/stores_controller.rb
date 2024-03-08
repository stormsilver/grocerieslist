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

    # split out any that are new
    existing_stores, new_stores = store_params_for_bulk_update.partition { |store| store[:id] }

    # split out any that need to be destroyed
    stores_to_destroy, stores_to_update = existing_stores.partition { |store| store[:_destroy] }

    # split out any that need to be updated
    stores_to_update = stores_to_update.index_by { |store| store[:id] }

    ActiveRecord::Base.transaction do
      Store.create!(allow_create_values(new_stores))
      Store.destroy(stores_to_destroy.map { |store| store[:id] })
      Store.update!(stores_to_update.keys, allow_update_values(stores_to_update.values))
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_store
    @store = Store.find(params[:id])
  end

  def store_params_for_bulk_update
    params.require(:stores).collect do |store_params|
      store_params.permit(:id, :name, :_destroy)
    end
  end

  def allow_update_values(values)
    values.map do |value|
      value.slice(:name)
    end
  end

  def allow_create_values(new_stores)
    new_stores.map do |new_store|
      {
        name: new_store[:name],
        account_id: Current.account.id
      }
    end
  end
end
