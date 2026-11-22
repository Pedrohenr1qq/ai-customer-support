import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EvalCaseController::store
* @see app/Http/Controllers/EvalCaseController.php:12
* @route '/eval-cases'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/eval-cases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvalCaseController::store
* @see app/Http/Controllers/EvalCaseController.php:12
* @route '/eval-cases'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalCaseController::store
* @see app/Http/Controllers/EvalCaseController.php:12
* @route '/eval-cases'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalCaseController::store
* @see app/Http/Controllers/EvalCaseController.php:12
* @route '/eval-cases'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalCaseController::store
* @see app/Http/Controllers/EvalCaseController.php:12
* @route '/eval-cases'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const evalCases = {
    store: Object.assign(store, store),
}

export default evalCases