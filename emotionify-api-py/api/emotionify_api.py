import numpy as np
import sys

import caffe

caffe.set_mode_cpu()


class EmotionifyApi(object):

    def __init__(self, model_file, pre_trained_file, mean_file):
        self.model_file = model_file
        self.pre_trained_file = pre_trained_file
        self.net = caffe.Classifier(model_file, pre_trained_file)

        channels = 3
        s = int(128)

        a = caffe.io.caffe_pb2.BlobProto()
        with open(mean_file, 'rb') as f:
            a.ParseFromString(f.read())

        means = a.data
        means = np.asarray(means)
        mu = means.reshape(channels, s, s)

        # average over pixels to obtain the mean (BGR) pixel values
        mu = mu.mean(1).mean(1)

        # create transformer for the input called 'data'
        _transformer = caffe.io.Transformer({'data': self.net.blobs['data'].data.shape})
        _transformer.set_transpose('data', (2, 0, 1))  # move image channels to outermost dimension
        _transformer.set_mean('data', mu)            # subtract the dataset-mean value in each channel
        _transformer.set_raw_scale('data', 255)      # rescale from [0, 1] to [0, 255]
        _transformer.set_channel_swap('data', (2, 1, 0))  # swap channels from RGB to BGR
        self.transfomer = _transformer

    def predict(self, image_file):
        # image = utils.open_img(filename)
        image = caffe.io.load_image(image_file)
        # transformer = self.transfomer
        transformed_image = self.transfomer.preprocess('data', image)
        # copy the image data into the memory allocated for the net
        self.net.blobs['data'].data[...] = transformed_image
        # perform classification
        output = self.net.forward()
        output_proba = output['prob'][0]
        return output_proba