class ItemsController < ApplicationController
  before_action :set_item, only: %i[show update destroy]

  # GET /items
  # GET /items.json
  def index
    @items = Item.all
  end

  # GET /items/1
  # GET /items/1.json
  def show; end

  # POST /items
  # POST /items.json
  def create
    @item = Item.new(item_params)

    if @item.save
      render :show, status: :created, location: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items/1
  # PATCH/PUT /items/1.json
  def update
    if @item.update(item_params)
      render :show, status: :ok, location: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items
  # PATCH/PUT /items.json
  def update_bulk
    # split out any that are new
    existing_items, new_items = item_params_for_bulk_update.partition { |item| item[:id] }

    # split out any that need to be destroyed
    items_to_destroy = existing_items.select { |item| item[:_destroy] }

    # split out any that need to be updated
    items_to_update = existing_items.index_by { |item| item[:id] }

    ActiveRecord::Base.transaction do
      Item.create!(new_items)
      Item.destroy(items_to_destroy.map { |item| item[:id] })
      Item.update!(items_to_update.keys, allow_update_values(items_to_update.values))
    end
  end

  # DELETE /items/1
  # DELETE /items/1.json
  def destroy
    @item.destroy!
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = Item.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def item_params
    params.require(:item).permit(:name, :needed, :category_id)
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
end
