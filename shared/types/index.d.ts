




// https://github.com/unjs/nitro/issues/470
// types/index.d.ts

type FetchSchemaApi<DefaultApiResponse = unknown> = {
    statusCode: number
    data: DefaultApiResponse
  }
  
  declare module 'nitropack' {
    interface $Fetch<DefaultT = unknown, DefaultR extends NitroFetchRequest = NitroFetchRequest> {
      <T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(request: R, opts?: O): Promise<TypedInternalResponse<R, FetchSchemaApi<T>, ExtractedRouteMethod<R, O>>>;
      raw<T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(request: R, opts?: O): Promise<FetchResponse<TypedInternalResponse<R, FetchSchemaApi<T>, ExtractedRouteMethod<R, O>>>>;
      create<T = DefaultT, R extends NitroFetchRequest = DefaultR>(defaults: FetchOptions): $Fetch<FetchSchemaApi<T>, R>;
    }
  }