require_relative 'boot'

# require "rails/all"

require 'rails'
# Pick the frameworks you want:
# require "active_job/railtie"
# require "active_storage/engine"
# require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
# require "action_cable/engine"
# require "rails/test_unit/railtie"
# require "action_view/railtie"

require 'active_model/railtie'
require 'action_controller/railtie'
require 'active_record/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Groceries
  class Application < Rails::Application
    config.active_record.sqlite3_production_warning = false
    config.api_only = true
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    require_relative '../app/middleware/snake_case_parameters'
    config.middleware.use SnakeCaseParameters
  end
end
