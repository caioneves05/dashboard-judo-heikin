import { GraphQLFormattedError } from 'graphql'

type Error = {
    message: string;
    statusCode: string;
}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access-token');

    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorizaton || `Bearer ${accessToken}`,
            "Contet-type": "application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

const getGraphQLErros = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    if(!body) {
        return {
            message: "Unknow error",
            statusCode: "INTERNAL_SERVER_ERROR",
        }
    }

    if("errors" in body) {
        const errors = body?.errors

        const messages = errors?.map((error) => error?.message)?.join("")
        const code = errors?.[0]?.extensions?.code as string

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || "500"
        }
    }

    return null
}

export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options)
    const responseClone = response.clone()

    const body = await responseClone.json()

    const error = getGraphQLErros(body)

    if(error) {
        throw error
    }

    return response
}