import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/evals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:14
* @route '/evals'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/evals/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const EvalController = { index, store }

export default EvalController