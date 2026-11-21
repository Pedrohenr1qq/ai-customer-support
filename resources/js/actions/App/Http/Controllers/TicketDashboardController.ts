import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::index
* @see app/Http/Controllers/TicketDashboardController.php:16
* @route '/dashboard'
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
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
export const show = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/tickets/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
show.url = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { ticket: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            ticket: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        ticket: typeof args.ticket === 'object'
        ? args.ticket.id
        : args.ticket,
    }

    return show.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
show.get = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
show.head = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
const showForm = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
showForm.get = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TicketDashboardController::show
* @see app/Http/Controllers/TicketDashboardController.php:56
* @route '/tickets/{ticket}'
*/
showForm.head = (args: { ticket: string | number | { id: string | number } } | [ticket: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const TicketDashboardController = { index, show }

export default TicketDashboardController