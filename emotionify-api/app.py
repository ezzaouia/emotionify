from flask import Flask, jsonify, request
from flask.ext.cors import CORS
import logging
from time import time
from datetime import datetime
from werkzeug import utils
import os


# local imports
from app_conf import *
from api.emotionify_api import EmotionifyApi
from api.utils import FaceDetector

# constants
UPLOAD_FOLDER = './tmp'
MODEL_FILE = './api/resources/deploy.prototxt'
PRE_TRAINED_FILE = './api/resources/snapshot_iter_600.caffemodel'
MEAN_FILE = './api/resources/mean.binaryproto'
EMOTION_LABELS = {0: 'Anger', 1: 'Disgust', 2: 'Fear', 3: 'Happiness', 4: 'Sadness', 5: 'Surprise', 6: 'Neutral'}


emotionifyApi = EmotionifyApi(MODEL_FILE, PRE_TRAINED_FILE, MEAN_FILE)
face_detector = FaceDetector()

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH


@app.route('/', methods=['GET'])
def sanity_check():
    return jsonify({"message": 'Server up & running'})


@app.route('/emotionify_upload_face', methods=['POST'])
def emotionify_upload_face():
    try:
        t0 = time()
        # get & save uploaded image
        filename = save_uploaded_file()

        if filename is 'fileNotAllowed':
            return jsonify({'error': 'only images are allowed.. ' + str(ALLOWED_EXTENSIONS)})

        output_prob = emotionifyApi.predict(filename)

        scores = jsonify_predected_prob(output_prob)

        return jsonify({'argmax_emotion': EMOTION_LABELS.get(output_prob.argmax()), 'scores': scores, 'time': time() - t0})

    except Exception as err:
        logging.error('\n\nError uploading/emotionifying image. \t code_error: [%s]\n', err)
        return jsonify({'error': str(err)})


@app.route('/emotionify_upload', methods=['POST'])
def emotionify_upload():
    try:
        t0 = time()
        # get & save uploaded image
        filename = save_uploaded_file()

        if filename is 'fileNotAllowed':
            return jsonify({'error': 'only images are allowed.. ' + str(ALLOWED_EXTENSIONS)})

        faces = face_detector.get_faces(filename)

        result = []
        for (x, y, w, h, face_filename) in faces:
            # predict
            output_prob = emotionifyApi.predict(face_filename)

            scores = jsonify_predected_prob(output_prob)

            scores = {"face_rectangle": {"left": str(y), "top": str(x), "width": str(w), "height": str(h)},
                      'argmax_emotion': EMOTION_LABELS.get(output_prob.argmax()), 'scores': scores}

            result.append(scores)

        return jsonify({"result": result, 'time':  time() - t0, "Nbr face detected": str(len(result))})
    except Exception as err:
        logging.error('\n\nError uploading/emotionifying image. \t code_error: [%s]\n' % err)
        return jsonify({'error': str(err)})


def save_uploaded_file():
    res = None
    image_file = request.files['image_file']

    if not image_file:
        return res
    if not allowed_file(utils.secure_filename(image_file.filename)):
        return 'fileNotAllowed'

    filename = str(datetime.now()).replace(' ', '_') + utils.secure_filename(image_file.filename)
    filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(filename)
    logging.debug('saving image %s' % filename)
    return filename


def jsonify_predected_prob(output_prob):
    _dict = dict((str(EMOTION_LABELS.get(a)), str(b)) for a, b in zip(range(len(output_prob)), output_prob))
    logging.debug(_dict)
    return _dict


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# fireup the app
if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    app.run(host=HOST, port=PORT, debug=DEBUG)