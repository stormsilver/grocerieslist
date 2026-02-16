require 'test_helper'

class CategoriesControllerTest < ActionDispatch::IntegrationTest
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
end
