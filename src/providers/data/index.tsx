import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

export const baseUrl = process.env.BASE_URL_API

export const client = new GraphQLClient(baseUrl!, {
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options)
        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})