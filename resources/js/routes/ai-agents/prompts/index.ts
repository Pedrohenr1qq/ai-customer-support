import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
export const store = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ai-agents/{aiAgent}/prompts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
store.url = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aiAgent: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { aiAgent: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            aiAgent: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        aiAgent: typeof args.aiAgent === 'object'
        ? args.aiAgent.id
        : args.aiAgent,
    }

    return store.definition.url
            .replace('{aiAgent}', parsedArgs.aiAgent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
store.post = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
const storeForm = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
storeForm.post = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AiAgentController::activate
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
export const activate = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/ai-agents/{aiAgent}/prompts/{prompt}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiAgentController::activate
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
activate.url = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            aiAgent: args[0],
            prompt: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        aiAgent: typeof args.aiAgent === 'object'
        ? args.aiAgent.id
        : args.aiAgent,
        prompt: typeof args.prompt === 'object'
        ? args.prompt.id
        : args.prompt,
    }

    return activate.definition.url
            .replace('{aiAgent}', parsedArgs.aiAgent.toString())
            .replace('{prompt}', parsedArgs.prompt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::activate
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
activate.post = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::activate
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
const activateForm = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::activate
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
activateForm.post = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activate.url(args, options),
    method: 'post',
})

activate.form = activateForm

const prompts = {
    store: Object.assign(store, store),
    activate: Object.assign(activate, activate),
}

export default prompts