class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  def authenticate_user!
    Current.user = User.first
    Current.account = Account.first
  end
end
