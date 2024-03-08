class CategoriesController < ApplicationController
  before_action :set_category, only: %i[show]

  # GET /categories
  # GET /categories.json
  def index
    @categories = Category.all
  end

  # PATCH/PUT /categories
  # PATCH/PUT /categories.json
  def update_bulk
    Rails.logger.ap category_params_for_bulk_update

    # split out any that are new
    existing_categories, new_categories = category_params_for_bulk_update.partition { |category| category[:id] }

    # split out any that need to be destroyed
    categories_to_destroy, categories_to_update = existing_categories.partition { |category| category[:_destroy] }

    # split out any that need to be updated
    categories_to_update = categories_to_update.index_by { |category| category[:id] }

    ActiveRecord::Base.transaction do
      Category.create!(allow_create_values(new_categories))
      Category.destroy(categories_to_destroy.map { |category| category[:id] })
      Category.update!(categories_to_update.keys, allow_update_values(categories_to_update.values))
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_category
    @category = Category.find(params[:id])
  end

  def category_params_for_bulk_update
    params.require(:categories).collect do |category_params|
      category_params.permit(:id, :name, :_destroy)
    end
  end

  def allow_update_values(values)
    values.map do |value|
      value.slice(:name)
    end
  end

  def allow_create_values(new_categories)
    new_categories.map do |new_category|
      {
        name: new_category[:name],
        account_id: Current.account.id
      }
    end
  end
end
