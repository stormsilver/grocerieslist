class StoreItemsController < ApplicationController
  before_action :set_store_item, only: %i[ show update destroy ]

  # GET /store_items
  # GET /store_items.json
  def index
    @store_items = StoreItem.all
  end

  # GET /store_items/1
  # GET /store_items/1.json
  def show
  end

  # POST /store_items
  # POST /store_items.json
  def create
    @store_item = StoreItem.new(store_item_params)

    if @store_item.save
      render :show, status: :created, location: @store_item
    else
      render json: @store_item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /store_items/1
  # PATCH/PUT /store_items/1.json
  def update
    if @store_item.update(store_item_params)
      render :show, status: :ok, location: @store_item
    else
      render json: @store_item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /store_items/1
  # DELETE /store_items/1.json
  def destroy
    @store_item.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_store_item
      @store_item = StoreItem.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def store_item_params
      params.fetch(:store_item, {})
    end
end
