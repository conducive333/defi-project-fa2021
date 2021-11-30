import { useEffect, useState } from 'react';
import * as services from '../services';

interface SubmitDrawingPoolImage {
  drawingPoolId: string;
  address: string;
  name: string;
  description: string;
  file: File | null;
}

export const useDrawingPoolService = () => {
  const [drawingPools, setDrawingPools] = useState<services.drawingPool.DrawingPools>([]);

  const getDrawingPools = async () => {
    const drawingPools = await services.drawingPool.get({});
    setDrawingPools(drawingPools);
  }

  const submitDrawingPoolImage = async (submitDrawingPoolData: SubmitDrawingPoolImage) => {
    const wasSubmissionSuccessful = await services.drawingPool.submitImage(submitDrawingPoolData);
    return wasSubmissionSuccessful;
  }

  useEffect(() => {
    getDrawingPools()
  }, [])

  return { drawingPools, getDrawingPools, submitDrawingPoolImage };
}