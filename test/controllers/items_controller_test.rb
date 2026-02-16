require 'test_helper'

class ItemsControllerTest < ActionDispatch::IntegrationTest
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
end
