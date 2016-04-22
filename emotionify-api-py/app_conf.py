"""
 Define all constants and config for the app
"""

# app config
DEBUG = True
PORT = 5000
HOST = '0.0.0.0'

# tmp folder to store uploaded images in
UPLOAD_FOLDER = './tmp'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


# caffe model
MODEL_FILE = './api/resources/deploy.prototxt'
# caffe pre trained model
PRE_TRAINED_FILE = './api/resources/snapshot_iter_600.caffemodel'
# mean images
MEAN_FILE = './api/resources/mean.binaryproto'

# emotion dict mapper
EMOTION_LABELS = {0: 'Anger', 1: 'Disgust', 2: 'Fear', 3: 'Happiness', 4: 'Sadness', 5: 'Surprise', 6: 'Neutral'}

# max uploaded file size
MAX_CONTENT_LENGTH = 4 * 1024 * 1024