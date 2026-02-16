require 'test_helper'

class GroceriesChannelTest < ActionCable::Channel::TestCase
  test 'streams for current account' do
    account = accounts(:one)
    other_account = Account.create!(name: 'Other')

    stub_connection current_account: account

    subscribe

    assert subscription.confirmed?
    assert_has_stream_for account
    assert_not_includes subscription.streams, GroceriesChannel.broadcasting_for(other_account)
  end
end
