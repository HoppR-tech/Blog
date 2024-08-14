export interface OctokitInterface {
  rest: {
    repos: {
      createOrUpdateFileContents: (params: any) => Promise<any>
      getContent: (params: any) => Promise<any>
      listBranches: (params: any) => Promise<any>
    }
    git: {
      createRef: (params: any) => Promise<any>
      deleteRef: (params: any) => Promise<any>
    }
    pulls: {
      create: (params: any) => Promise<any>
      merge: (params: any) => Promise<any>
    }
  }
}
