import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:17
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
* @see app/Http/Controllers/EvalController.php:17
* @route '/evals'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:17
* @route '/evals'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:17
* @route '/evals'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:17
* @route '/evals'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:17
* @route '/evals'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::index
* @see app/Http/Controllers/EvalController.php:17
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
* @see app/Http/Controllers/EvalController.php:35
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
* @see app/Http/Controllers/EvalController.php:35
* @route '/evals/run'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:35
* @route '/evals/run'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:35
* @route '/evals/run'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalController::store
* @see app/Http/Controllers/EvalController.php:35
* @route '/evals/run'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
export const show = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/evals/{evalRun}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
show.url = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evalRun: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { evalRun: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            evalRun: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        evalRun: typeof args.evalRun === 'object'
        ? args.evalRun.id
        : args.evalRun,
    }

    return show.definition.url
            .replace('{evalRun}', parsedArgs.evalRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
show.get = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
show.head = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
const showForm = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
showForm.get = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EvalController::show
* @see app/Http/Controllers/EvalController.php:28
* @route '/evals/{evalRun}'
*/
showForm.head = (args: { evalRun: string | number | { id: string | number } } | [evalRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const EvalController = { index, store, show }

export default EvalController