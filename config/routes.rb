Rails.application.routes.draw do
  scope :api do
    resources :stores, only: [:index] do
      collection do
        patch '/', action: :update_bulk
      end
    end

    resources :categories, only: [:index] do
      collection do
        patch '/', action: :update_bulk
      end
    end

    resources :store_items, only: [:index] do
      collection do
        patch '/', action: :update_bulk
      end
    end

    resources :items, only: [:index] do
      collection do
        patch '/', action: :update_bulk
      end
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  root 'homepage#index'
  get '*path' => 'homepage#index'
end
