import { apiSlice } from "../../Api/apiSlice";

export const refreshApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: '/auth/refresh',
				method: 'POST',
				body: { ...credentials }
			})
		}),
	})
})
