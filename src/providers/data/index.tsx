import graphqlDataProvider, { GraphQLClient, liveProvider as graphqlLiveProvider } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const baseUrl = process.env.BASE_URL_API
export const wsUrl = process.env.WS_URL

export const client = new GraphQLClient(baseUrl!, {
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options)
        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})

export const wsClient = typeof window !== "undefined" ? createClient({
    url: wsUrl as string,
    connectionParams: () => {
        const accessToken = localStorage.getItem("access-token")

        return {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    }
}) : undefined

export const dataProvider = graphqlDataProvider(client)
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined