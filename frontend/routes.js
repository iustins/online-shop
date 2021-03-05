const routes = require('next-routes')

module.exports = routes()
    .add({ name: 'online-shop', pattern: '/online-shop/shop', page: 'online-shop' })
    .add({ name: 'online-shop-login', pattern: '/online-shop/login', page: 'online-shop/auth/login' })
    .add({ name: 'online-shop-register', pattern: '/online-shop/register', page: 'online-shop/auth/register' })
    .add({ name: 'online-product', pattern: '/online-shop/shop/:category/:slug', page: 'online-shop/product-page' })
    .add({ name: 'online-checkout', pattern: '/online-shop/checkout/form', page: 'online-shop/checkout' })
    .add({ name: 'online-verify', pattern: '/online-shop/checkout/verify', page: 'online-shop/verify' })
    .add({ name: 'online-payment', pattern: '/online-shop/checkout/payment/:txn', page: 'online-shop/payment' })
    .add({ name: 'online-success', pattern: '/online-shop/checkout/success/:txn', page: 'online-shop/success' })
    .add({ name: 'transaction-view', pattern: '/admin/transaction/view', page: 'admin/transactionView' })
    .add({ name: 'login', pattern: '/admin/login', page: 'admin/login'})
    .add({ name: 'dashboard', pattern: '/admin', page: 'admin/dashboard'})
    .add({ name: 'dashboard2', pattern: '/admin/dashboard', page: 'admin/dashboard'})

    .add({ name: 'brands', pattern: '/admin/brands', page: 'admin/brands/index'})
    .add({ name: 'brand-create', pattern: '/admin/brands/create', page: 'admin/brands/create'})
    .add({ name: 'brand-edit', pattern: '/admin/brands/edit/:id', page: 'admin/brands/edit'})

    .add({ name: 'vehicles', pattern: '/admin/vehicles', page: 'admin/vehicles/index'})
    .add({ name: 'vehicle-create', pattern: '/admin/vehicles/create', page: 'admin/vehicles/create'})
    .add({ name: 'vehicle-edit', pattern: '/admin/vehicles/edit/:id', page: 'admin/vehicles/edit'})

    .add({ name: 'variations', pattern: '/admin/variations', page: 'admin/variations/index'})
    .add({ name: 'variation-create', pattern: '/admin/variations/create', page: 'admin/variations/create'})

    .add({ name: 'optionals', pattern: '/admin/optionals', page: 'admin/optionals/index'})
    .add({ name: 'optional-create', pattern: '/admin/optionals/create', page: 'admin/optionals/create'})
    .add({ name: 'optional-edit', pattern: '/admin/optionals/edit/:id', page: 'admin/optionals/edit'})

    .add({ name: 'tabs', pattern: '/admin/tabs', page: 'admin/tabs/index'})
    .add({ name: 'tab-create', pattern: '/admin/tabs/create', page: 'admin/tabs/create'})
    .add({ name: 'tab-edit', pattern: '/admin/tabs/edit/:id', page: 'admin/tabs/edit'})

    .add({ name: 'tags', pattern: '/admin/tags', page: 'admin/tags/index'})
    .add({ name: 'tag-create', pattern: '/admin/tags/create', page: 'admin/tags/create'})
    .add({ name: 'tag-edit', pattern: '/admin/tags/edit/:id', page: 'admin/tags/edit'})

    .add({ name: 'offers', pattern: '/admin/offers', page: 'admin/offers/index'})
    .add({ name: 'offer-create', pattern: '/admin/offers/create', page: 'admin/offers/create'})
    .add({ name: 'offer-edit', pattern: '/admin/offers/edit/:id', page: 'admin/offers/edit'})

    .add({ name: 'homepage-slider', pattern: '/admin/homepage/slider', page: 'admin/homepage/slider'})
    .add({ name: 'test', pattern: '/test', page: 'test'});
