require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
  include ActionCable::TestHelper

  setup do
    @account = accounts(:one)
    @category = categories(:one)
    @item = items(:one)
    @item_to_remove = items(:two)
  end

  test 'updates, creates, and removes items' do
    payload = {
      items: [
        {
          id: @item.id,
          name: 'Milk 2',
          needed: true,
          category_id: @category.id,
          lock_version: @item.lock_version
        },
        {
          name: 'Bread',
          needed: false,
          category_id: @category.id
        },
        {
          id: @item_to_remove.id,
          _destroy: true,
          lock_version: @item_to_remove.lock_version
        }
      ]
    }

    assert_difference('Item.count', 0) do
      patch items_url, params: payload, as: :json
    end

    assert_response :no_content
    @item.reload

    assert_equal 'Milk 2', @item.name
    assert_equal true, @item.needed
    assert_equal @category.id, @item.category_id
    assert_nil Item.find_by(id: @item_to_remove.id)

    created = Item.find_by(name: 'Bread')
    assert_not_nil created
    assert_equal @account.id, created.account_id
    assert_equal @category.id, created.category_id
  end

  test 'accepts camel case item updates' do
    payload = {
      items: [
        {
          id: @item.id,
          name: 'Milk Deluxe',
          needed: true,
          categoryId: @category.id,
          lockVersion: @item.lock_version
        }
      ]
    }

    assert_no_difference('Item.count') do
      patch items_url, params: payload, as: :json
    end

    assert_response :no_content
    @item.reload
    assert_equal 'Milk Deluxe', @item.name
    assert_equal true, @item.needed
    assert_equal @category.id, @item.category_id
  end

  test 'rejects missing lock versions' do
    original_name = @item.name

    payload = {
      items: [
        {
          id: @item.id,
          name: 'Milk Deluxe'
        },
        {
          name: 'Bagels',
          needed: false,
          category_id: @category.id
        }
      ]
    }

    assert_no_difference('Item.count') do
      patch items_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    conflict = body.fetch('conflicts').first
    assert_equal @item.id, conflict.fetch('id')
    assert_equal 'missing_lock_version', conflict.fetch('reason')
    assert_equal @item.lock_version, conflict.fetch('current').fetch('lockVersion')
    assert_equal original_name, @item.reload.name
    assert_nil Item.find_by(name: 'Bagels')
  end

  test 'rejects stale lock versions' do
    stale_version = @item.lock_version
    @item.update!(name: 'Latest')

    payload = {
      items: [
        {
          id: @item.id,
          name: 'Milk Old',
          needed: true,
          category_id: @category.id,
          lock_version: stale_version
        }
      ]
    }

    assert_no_difference('Item.count') do
      patch items_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    assert_equal @item.id, body.fetch('conflicts').first.fetch('id')
  end

  test 'returns conflict for missing items' do
    missing_id = Item.maximum(:id) + 100

    payload = {
      items: [
        {
          id: missing_id,
          name: 'Missing Item',
          needed: false,
          category_id: @category.id,
          lock_version: 0
        },
        {
          name: 'New Item',
          needed: false,
          category_id: @category.id
        }
      ]
    }

    assert_no_difference('Item.count') do
      patch items_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    conflict = body.fetch('conflicts').first
    assert_equal missing_id, conflict.fetch('id')
    assert_equal 'missing', conflict.fetch('reason')
    assert_nil Item.find_by(name: 'New Item')
  end

  test 'rejects invalid items' do
    payload = {
      items: [
        {
          name: nil,
          needed: true,
          category_id: @category.id
        }
      ]
    }

    assert_no_difference('Item.count') do
      patch items_url, params: payload, as: :json
    end

    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_includes body.fetch('errors'), "Name can't be blank"
  end

  test 'broadcasts item updates and deletions' do
    payload = {
      items: [
        {
          id: @item.id,
          name: 'Milk Updated',
          needed: true,
          category_id: @category.id,
          lock_version: @item.lock_version
        },
        {
          id: @item_to_remove.id,
          _destroy: true,
          lock_version: @item_to_remove.lock_version
        }
      ]
    }

    stream = GroceriesChannel.broadcasting_for(@account)
    messages = capture_broadcasts(stream) do
      patch items_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 1, messages.length

    message = messages.first
    assert_equal 'items', message.fetch('type')
    assert_equal [@item_to_remove.id], message.fetch('deletes')

    updated = message.fetch('updates').find { |update| update['id'] == @item.id }
    assert_not_nil updated
    assert_equal 'Milk Updated', updated.fetch('name')
    assert_includes updated.keys, 'categoryId'
    assert_includes updated.keys, 'lockVersion'
  end
end
