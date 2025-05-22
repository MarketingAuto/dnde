import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ListTemplateResponse {
  response: ListTemplateInfo[];
}

export interface ListTemplateInfo {
  preview: string;
  docRef: string;
  id: number;
}

export interface getTemplateRequest {
  id: string;
}

export interface getTemplateResponse {
  response: Response;
}
export interface Response {
  date: string;
  docRef: string;
  data: string;
}

export interface sendMailRequest {
  to: string;
  html: string;
}

interface SuccessResponse {
  success: string;
}

interface FailureResponse {
  error: string;
}

export const ConeApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getTemplates: builder.query<ListTemplateResponse, void>({
      query: () => `templates/`,
    }),
    getTemplate: builder.query<getTemplateResponse, getTemplateRequest>({
      query: ({ id }) => `templates/${id}`,
    }),
    sendMail: builder.mutation<SuccessResponse | FailureResponse, sendMailRequest>({
      query: (data) => {
        return {
          url: 'mail/demomail/',
          method: 'POST',
          body: data,
        };
      },
    }),
  }),
});

export const { useGetTemplatesQuery, useLazyGetTemplateQuery, useSendMailMutation } = ConeApi;
