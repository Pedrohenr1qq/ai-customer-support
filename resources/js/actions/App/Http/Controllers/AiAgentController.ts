import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ai-agents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AiAgentController::index
* @see app/Http/Controllers/AiAgentController.php:18
* @route '/ai-agents'
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
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:35
* @route '/ai-agents'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ai-agents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:35
* @route '/ai-agents'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:35
* @route '/ai-agents'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:35
* @route '/ai-agents'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::store
* @see app/Http/Controllers/AiAgentController.php:35
* @route '/ai-agents'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AiAgentController::update
* @see app/Http/Controllers/AiAgentController.php:64
* @route '/ai-agents/{aiAgent}'
*/
export const update = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/ai-agents/{aiAgent}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AiAgentController::update
* @see app/Http/Controllers/AiAgentController.php:64
* @route '/ai-agents/{aiAgent}'
*/
update.url = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{aiAgent}', parsedArgs.aiAgent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::update
* @see app/Http/Controllers/AiAgentController.php:64
* @route '/ai-agents/{aiAgent}'
*/
update.patch = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AiAgentController::update
* @see app/Http/Controllers/AiAgentController.php:64
* @route '/ai-agents/{aiAgent}'
*/
const updateForm = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::update
* @see app/Http/Controllers/AiAgentController.php:64
* @route '/ai-agents/{aiAgent}'
*/
updateForm.patch = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\AiAgentController::storePrompt
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
export const storePrompt = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePrompt.url(args, options),
    method: 'post',
})

storePrompt.definition = {
    methods: ["post"],
    url: '/ai-agents/{aiAgent}/prompts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiAgentController::storePrompt
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
storePrompt.url = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return storePrompt.definition.url
            .replace('{aiAgent}', parsedArgs.aiAgent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::storePrompt
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
storePrompt.post = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePrompt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::storePrompt
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
const storePromptForm = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePrompt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::storePrompt
* @see app/Http/Controllers/AiAgentController.php:85
* @route '/ai-agents/{aiAgent}/prompts'
*/
storePromptForm.post = (args: { aiAgent: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePrompt.url(args, options),
    method: 'post',
})

storePrompt.form = storePromptForm

/**
* @see \App\Http\Controllers\AiAgentController::activatePrompt
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
export const activatePrompt = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activatePrompt.url(args, options),
    method: 'post',
})

activatePrompt.definition = {
    methods: ["post"],
    url: '/ai-agents/{aiAgent}/prompts/{prompt}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiAgentController::activatePrompt
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
activatePrompt.url = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return activatePrompt.definition.url
            .replace('{aiAgent}', parsedArgs.aiAgent.toString())
            .replace('{prompt}', parsedArgs.prompt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAgentController::activatePrompt
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
activatePrompt.post = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activatePrompt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::activatePrompt
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
const activatePromptForm = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activatePrompt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAgentController::activatePrompt
* @see app/Http/Controllers/AiAgentController.php:105
* @route '/ai-agents/{aiAgent}/prompts/{prompt}/activate'
*/
activatePromptForm.post = (args: { aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } } | [aiAgent: string | number | { id: string | number }, prompt: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: activatePrompt.url(args, options),
    method: 'post',
})

activatePrompt.form = activatePromptForm

const AiAgentController = { index, store, update, storePrompt, activatePrompt }

export default AiAgentController