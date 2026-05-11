<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    // Force Laravel to load the api.php routes
    \Illuminate\Support\Facades\Route::prefix('api')
        ->middleware('api')
        ->group(base_path('routes/api.php'));
}
}
