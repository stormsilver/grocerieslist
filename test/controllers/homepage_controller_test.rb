require "test_helper"

class HomepageControllerTest < ActionDispatch::IntegrationTest
  test "serves app shell for root" do
    get root_url
    assert_response :success
  end

  test "serves app shell for unknown routes" do
    get "/some/unknown/path"
    assert_response :success
  end
end
