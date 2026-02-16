require 'test_helper'

module ApplicationCable
  class ConnectionTest < ActionCable::Connection::TestCase
    test 'connects with current account' do
      account = accounts(:one)

      connect

      assert_equal account, connection.current_account
    end
  end
end
