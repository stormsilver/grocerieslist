require 'test_helper'

class CategoriesControllerTest < ActionDispatch::IntegrationTest
  include ActionCable::TestHelper

  setup do
    @account = accounts(:one)
    @category = categories(:one)
    @category_to_remove = categories(:two)
  end

  test 'updates, creates, and removes categories' do
    payload = {
      categories: [
        {
          id: @category.id,
          name: 'Pantry Goods',
          lock_version: @category.lock_version
        },
        {
          name: 'Frozen'
        },
        {
          id: @category_to_remove.id,
          _destroy: true,
          lock_version: @category_to_remove.lock_version
        }
      ]
    }

    assert_difference('Category.count', 0) do
      patch categories_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 'Pantry Goods', @category.reload.name
    assert_nil Category.find_by(id: @category_to_remove.id)

    created = Category.find_by(name: 'Frozen')
    assert_not_nil created
    assert_equal @account.id, created.account_id
  end

  test 'updates existing categories without creating' do
    payload = {
      categories: [
        {
          id: @category.id,
          name: 'Dry Goods',
          lock_version: @category.lock_version
        }
      ]
    }

    assert_no_difference('Category.count') do
      patch categories_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 'Dry Goods', @category.reload.name
  end

  test 'rejects missing lock versions' do
    original_name = @category.name

    payload = {
      categories: [
        {
          id: @category.id,
          name: 'Fresh'
        },
        {
          name: 'Frozen'
        }
      ]
    }

    assert_no_difference('Category.count') do
      patch categories_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    conflict = body.fetch('conflicts').first
    assert_equal @category.id, conflict.fetch('id')
    assert_equal 'missing_lock_version', conflict.fetch('reason')
    assert_equal @category.lock_version, conflict.fetch('current').fetch('lockVersion')
    assert_equal original_name, @category.reload.name
    assert_nil Category.find_by(name: 'Frozen')
  end

  test 'rejects stale lock versions' do
    stale_version = @category.lock_version
    @category.update!(name: 'Latest')

    payload = {
      categories: [
        {
          id: @category.id,
          name: 'Dry Goods',
          lock_version: stale_version
        }
      ]
    }

    assert_no_difference('Category.count') do
      patch categories_url, params: payload, as: :json
    end

    assert_response :conflict
    body = JSON.parse(response.body)
    assert_equal @category.id, body.fetch('conflicts').first.fetch('id')
  end

  test 'broadcasts category updates and deletions' do
    payload = {
      categories: [
        {
          id: @category.id,
          name: 'Pantry Goods',
          lock_version: @category.lock_version
        },
        {
          id: @category_to_remove.id,
          _destroy: true,
          lock_version: @category_to_remove.lock_version
        }
      ]
    }

    stream = GroceriesChannel.broadcasting_for(@account)
    messages = capture_broadcasts(stream) do
      patch categories_url, params: payload, as: :json
    end

    assert_response :no_content
    assert_equal 1, messages.length

    message = messages.first
    assert_equal 'categories', message.fetch('type')
    assert_equal [@category_to_remove.id], message.fetch('deletes')

    updated = message.fetch('updates').find { |update| update['id'] == @category.id }
    assert_not_nil updated
    assert_equal 'Pantry Goods', updated.fetch('name')
    assert_includes updated.keys, 'lockVersion'
  end
end
