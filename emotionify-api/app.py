from flask import Flask, jsonify, request
import logging
import cv2
import numpy as np
from time import time
from datetime import datetime
from werkzeug import utils
import os

# local imports
from api.emotionify_api import EmotionifyApi

# constants
UPLOAD_FOLDER = './tmp'
MODEL_FILE = './api/resources/deploy.prototxt'
PRE_TRAINED_FILE = './api/resources/snapshot_iter_600.caffemodel'
MEAN_FILE = './api/resources/mean.binaryproto'
EMOTION_LABELS = {0: 'Anger', 1: 'Disgust', 2: 'Fear', 3: 'Happiness', 4: 'Sadness', 5: 'Surprise', 6: 'Neutral'}

emotionifyApi = EmotionifyApi(MODEL_FILE, PRE_TRAINED_FILE, MEAN_FILE)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024


@app.route('/', methods=['GET'])
def sanity_check():
    return jsonify({"message": 'Server up & running'})


@app.route('/emotionify_upload_face', methods=['POST'])
def emotionify_upload_face():
    try:
        t0 = time()
        # catch & save uploaded file
        filename = save_uploaded_file()

        output_prob = emotionifyApi.predict(filename)

        jsonify_scores = jsonify_prediected_prob(output_prob)

        return jsonify({'argmax_emotion': EMOTION_LABELS.get(output_prob.argmax()), 'scores': jsonify_scores, 'time': time() - t0})

    except Exception as err:
        logging.error('\n\nError uploading/emotionifying image. \t code_error: [%s]\n', err)
        return jsonify({'error': str(err)})

@app.route('/emotionify_upload', methods=['POST'])
def emotionify_upload():
    try:
        return jsonify({})
    except Exception as err:
        logging.error('\n\nError uploading/emotionifying image. \t code_error: [%s]\n' % err)
        return jsonify({})


def save_uploaded_file():
    image_file = request.files['image_file']
    filename = str(datetime.now()).replace(' ', '_') + utils.secure_filename(image_file.filename)
    filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(filename)
    logging.debug('saving file %s' % filename)
    return filename

def jsonify_prediected_prob(output_prob):
    _dict = dict((str(EMOTION_LABELS.get(a)), str(b)) for a, b in zip(range(len(output_prob)), output_prob))
    logging.debug(_dict)
    return _dict

# fire up the application
if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    app.run(host='0.0.0.0', debug=True)
