import { DataSourceApi, Sample } from '@pipcook/pipcook-core';
import { Image } from './datacook';

/**
 * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image
 * @param resize =[256, 256][optional] resize all images to same size
 * @param normalize =false[optional] if normalize all images to have values between [0, 1]
 */
const imageDataProcess = async (api: DataSourceApi<Image>, options: Record<string, any>, context: any) => {
  const [x, y] = options['size'];

  const resize = (sample: Sample<Image>) => {
    const {data, label} = sample
    return {
      data: data.resize(x, y),
      label
    }
  }

  const resizeBatch = (samples: Array<Sample<Image>> | null) => {
    if (!samples) return null;
    return samples.map(resize);
  }

  const oldDataSource = await api.getDataSourceMeta();

  return {
    train: {
      next: () => api.train.next().then(resize),
      nextBatch: (numOfBatch: number) => api.train.nextBatch(numOfBatch).then(resizeBatch)
    },
    test: {
      next: async () => resize(await api.test.next()),
      nextBatch: (numOfBatch: number) => api.test.nextBatch(numOfBatch).then(resizeBatch)
    },
    getDataSourceMeta: () => {
      return {
        ... oldDataSource,
        dimension: [x, y, 3]
      }
    }
  }
  
};

export default imageDataProcess;
