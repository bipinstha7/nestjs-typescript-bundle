export interface IPostSearchBody {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

// export interface IPostSearchResult {
//   hits: {
//     total: number;
//     hits: Array<{ _sourse: IPostSearchBody }>;
//   };
// }
