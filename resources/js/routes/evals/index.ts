import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
* @see \App\Http\Controllers\EvalController::run
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/evals/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EvalController::run
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EvalController::run
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalController::run
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EvalController::run
* @see app/Http/Controllers/EvalController.php:22
* @route '/evals/run'
*/
runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(options),
    method: 'post',
})

run.form = runForm

const evals = {
    index: Object.assign(index, index),
    run: Object.assign(run, run),
}

export default evals