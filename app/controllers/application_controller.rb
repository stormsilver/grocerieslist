class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response

  def authenticate_user!
    Current.user = User.first
    Current.account = Account.first
  end

  private

  def render_unprocessable_entity_response(exception)
    render json: { errors: exception.record.errors.full_messages }, status: :unprocessable_entity
  end
end
