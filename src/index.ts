import { DataProcessType, Metadata, ArgsType, ImageSample, Sample } from '@pipcook/pipcook-core';
import * as path from 'path';

const boa = require('@pipcook/boa');

const sys = boa.import('sys');
sys.path.insert(0, path.join(__dirname, '..'));
const { getData, getY } = boa.import('processscript.index');

const tf = boa.import('tensorflow');
const config = tf.compat.v1.ConfigProto();
config.gpu_options.allow_growth = true;
tf.compat.v1.InteractiveSession(boa.kwargs({
  config:config
}));

/**
 * this is the data process plugin to process pasvoc format data. It supports resize the image and normalize the image
 * @param resize =[256, 256][optional] resize all images to same size
 * @param normalize =false[optional] if normalize all images to have values between [0, 1]
 */
const imageDataProcess: DataProcessType = async (data: ImageSample, metadata: Metadata, args: ArgsType): Promise<Sample> => {
  const {
    resize = [ 256, 256 ],
    normalize = false
  } = args;

  let image = getData(data.data, resize, normalize);

  let ys;
  if (data?.label?.categoryId !== undefined) {
    ys = getY(data.label.categoryId, Object.keys(metadata.labelMap).length)
  }
  
  metadata.feature = {
    shape: [ resize[0], resize[1], 3 ]
  };

  return {
    data: image,
    label: ys
  };
};

export default imageDataProcess;
