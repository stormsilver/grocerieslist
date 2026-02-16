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
    payload = category_params_for_bulk_update

    if payload.empty?
      head :no_content
      return
    end

    # split out any that are new
    existing_categories, new_categories = payload.partition { |category| category[:id] }

    # split out any that need to be destroyed
    categories_to_destroy, categories_to_update = existing_categories.partition { |category| category[:_destroy] }

    # split out any that need to be updated
    categories_to_update = categories_to_update.index_by { |category| category[:id] }

    conflicts = category_conflicts(categories_to_update.values + categories_to_destroy)
    if conflicts.any?
      render_conflicts(conflicts)
      return
    end

    created_categories = []
    updated_categories = []
    destroyed_ids = []

    ActiveRecord::Base.transaction do
      created_categories = Category.create!(allow_create_values(new_categories))

      destroyed_ids = categories_to_destroy.map do |category|
        record = Category.find_by!(account_id: Current.account.id, id: category[:id])
        record.destroy!
        record.id
      end

      categories_by_id = Category.where(account_id: Current.account.id, id: categories_to_update.keys).index_by(&:id)
      updated_categories = categories_to_update.values.map do |category|
        record = categories_by_id.fetch(category[:id])
        record.assign_attributes(allow_update_value(category))
        record.save!
        record
      end
    end

    broadcast_changes(
      type: 'categories',
      updates: serialize_records(
        created_categories + updated_categories,
        fields: %w[id created_at updated_at name]
      ),
      deletes: destroyed_ids
    )

    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_category
    @category = Category.find(params[:id])
  end

  def category_params_for_bulk_update
    params.require(:categories).collect do |category_params|
      category_params.permit(:id, :name, :_destroy, :lock_version)
    end
  end

  def allow_update_value(value)
    value.slice(:name)
  end

  def allow_create_values(new_categories)
    new_categories.map do |new_category|
      {
        name: new_category[:name],
        account_id: Current.account.id
      }
    end
  end

  def category_conflicts(payloads)
    return [] if payloads.empty?

    categories_by_id = Category.where(account_id: Current.account.id, id: payloads.map { |category| category[:id] })
                               .index_by(&:id)

    payloads.filter_map do |category|
      record = categories_by_id[category[:id]]
      if record.nil?
        { id: category[:id], reason: 'missing' }
      elsif category[:lock_version].nil?
        {
          id: record.id,
          reason: 'missing_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at name]).first
        }
      elsif record.lock_version != category[:lock_version].to_i
        {
          id: record.id,
          reason: 'stale_lock_version',
          current: serialize_records([record], fields: %w[id created_at updated_at name]).first
        }
      end
    end
  end
end
