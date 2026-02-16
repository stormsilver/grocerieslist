require 'test_helper'

class StoresControllerTest < ActionDispatch::IntegrationTest
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
end
