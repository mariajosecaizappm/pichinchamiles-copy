export enum SearchEngineType{
    ALGOLIA
}

type SearchEngine = AlgoliaSearchEngine;

export interface AlgoliaSearchEngine{
    engine: SearchEngineType.ALGOLIA
    position: number
    index: string
    queryID: string
    objectID: string
}

export default SearchEngine;