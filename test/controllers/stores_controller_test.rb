require 'test_helper'

class StoresControllerTest < ActionDispatch::IntegrationTest
  include ActionCable::TestHelper

  setup do
    @account = accounts(:one)
    @store = stores(:one)
    @store_to_remove = stores(:two)
  end

  test 'updates, creates, and removes stores' do
    payload = {
      stores: [
        {
          id: @store.id,
          name: 'Downtown West',
          lock_version: @store.lock_version
        },
        {
          name: 'Suburban'
        },
        {
          id: @store_to_remove.id,
          _destroy: true,
          lock_version: @store_to_remove.lock_version
        }
      ]
    }

    assert_difference('Store.count', 0) do
      patch stores_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 'Downtown West', @store.reload.name
    assert_nil Store.find_by(id: @store_to_remove.id)

    created = Store.find_by(name: 'Suburban')
    assert_not_nil created
    assert_equal @account.id, created.account_id
  end

  test 'rejects invalid stores' do
    payload = {
      stores: [
        {
          name: nil
        }
      ]
    }

    assert_no_difference('Store.count') do
      patch stores_url, params: payload, as: :json
    end

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_includes body.fetch('errors'), "Name can't be blank"
  end

  test 'rejects missing lock versions' do
    original_name = @store.name

    payload = {
      stores: [
        {
          id: @store.id,
          name: 'Downtown East'
        },
        {
          name: 'Neighborhood'
        }
      ]
    }

    assert_no_difference('Store.count') do
      patch stores_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    conflict = body.fetch('conflicts').first
    assert_equal @store.id, conflict.fetch('id')
    assert_equal 'missing_lock_version', conflict.fetch('reason')
    assert_equal @store.lock_version, conflict.fetch('current').fetch('lockVersion')
    assert_equal original_name, @store.reload.name
    assert_nil Store.find_by(name: 'Neighborhood')
  end

  test 'rejects stale lock versions' do
    stale_version = @store.lock_version
    @store.update!(name: 'Latest')

    payload = {
      stores: [
        {
          id: @store.id,
          name: 'Downtown',
          lock_version: stale_version
        }
      ]
    }

    assert_no_difference('Store.count') do
      patch stores_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    assert_equal @store.id, body.fetch('conflicts').first.fetch('id')
  end

  test 'broadcasts store updates and deletions' do
    payload = {
      stores: [
        {
          id: @store.id,
          name: 'Downtown East',
          lock_version: @store.lock_version
        },
        {
          id: @store_to_remove.id,
          _destroy: true,
          lock_version: @store_to_remove.lock_version
        }
      ]
    }

    stream = GroceriesChannel.broadcasting_for(@account)
    messages = capture_broadcasts(stream) do
      patch stores_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 1, messages.length

    message = messages.first
    assert_equal 'stores', message.fetch('type')
    assert_equal [@store_to_remove.id], message.fetch('deletes')

    updated = message.fetch('updates').find { |update| update['id'] == @store.id }
    assert_not_nil updated
    assert_equal 'Downtown East', updated.fetch('name')
    assert_includes updated.keys, 'lockVersion'
  end
end
