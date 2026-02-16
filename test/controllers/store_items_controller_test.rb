require 'test_helper'

class StoreItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @account = accounts(:one)
    @store_item = store_items(:one)
    @store_item_to_remove = store_items(:two)
    @store = stores(:two)
    @item = items(:two)
  end

  test 'updates, creates, and removes store items' do
    payload = {
      store_items: [
        {
          id: @store_item.id,
          order: 3,
          lock_version: @store_item.lock_version
        },
        {
          store_id: @store.id,
          item_id: @item.id,
          order: 1
        },
        {
          id: @store_item_to_remove.id,
          _destroy: true,
          lock_version: @store_item_to_remove.lock_version
        }
      ]
    }

    assert_difference('StoreItem.count', 0) do
      patch store_items_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 3, @store_item.reload.order
    assert_nil StoreItem.find_by(id: @store_item_to_remove.id)

    created = StoreItem.find_by(store_id: @store.id, item_id: @item.id)
    assert_not_nil created
    assert_equal @account.id, created.account_id
  end

  test 'accepts camel case store item creation' do
    payload = {
      storeItems: [
        {
          storeId: @store.id,
          itemId: @item.id,
          order: 4
        }
      ]
    }

    assert_difference('StoreItem.count', 1) do
      patch store_items_url, params: payload, as: :json
    end

    assert_response :no_content
    created = StoreItem.find_by(store_id: @store.id, item_id: @item.id)
    assert_not_nil created
    assert_equal 4, created.order
  end

  test 'rejects invalid store items' do
    payload = {
      store_items: [
        {
          store_id: @store.id,
          item_id: nil
        }
      ]
    }

    assert_no_difference('StoreItem.count') do
      patch store_items_url, params: payload, as: :json
    end

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_includes body.fetch('errors'), 'Item must exist'
  end

  test 'rejects stale lock versions' do
    stale_version = @store_item.lock_version
    @store_item.update!(order: 9)

    payload = {
      store_items: [
        {
          id: @store_item.id,
          order: 3,
          lock_version: stale_version
        }
      ]
    }

    assert_no_difference('StoreItem.count') do
      patch store_items_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    assert_equal @store_item.id, body.fetch('conflicts').first.fetch('id')
  end
end
