export interface SingleDrawingPoolDetails {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  fileId: string;
  releaseDate: string;
  endDate: string;
  file: {
    id: string;
    createdAt: string;
    key: string;
    name: string;
    url: string;
    mimetype: string;
    category: string;
    size: number
  }
}

export type DrawingPools = Array<SingleDrawingPoolDetails>