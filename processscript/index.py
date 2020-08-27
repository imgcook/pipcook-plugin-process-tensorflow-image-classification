import tensorflow as tf
import sys

def getData(xs, resize, normalize):
  with tf.device('/device:CPU:0'):
    content = tf.io.read_file(xs)
    image = tf.image.decode_jpeg(content, channels=3)
    if (resize is not None):
      image = tf.image.resize(image, resize)
    if normalize:
      image = tf.divide(image, 255)
    return image

def getY(categoryId, length):
  with tf.device('/device:CPU:0'):
    ys = tf.one_hot(categoryId, length)
    return ys

