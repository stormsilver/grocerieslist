class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
  rescue_from ActiveRecord::StaleObjectError, with: :render_conflict_response

  def authenticate_user!
    Current.user = User.first
    Current.account = Account.first
  end

  private

  def render_conflict_response(exception)
    render json: { errors: [exception.message] }, status: :conflict
  end

  def render_conflicts(conflicts)
    render json: { conflicts: }, status: :conflict
  end

  def serialize_records(records, fields:)
    records.map do |record|
      record.attributes.slice(*fields).merge('lock_version' => record.lock_version).deep_transform_keys do |key|
        key.to_s.camelize(:lower)
      end
    end
  end

  def broadcast_changes(type:, updates:, deletes: [])
    return if updates.empty? && deletes.empty?

    GroceriesChannel.broadcast_to(
      Current.account,
      {
        type:,
        updates:,
        deletes:
      }
    )
  end

  def render_unprocessable_entity_response(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
  end
end
