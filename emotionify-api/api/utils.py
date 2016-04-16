import cv2
import numpy as np
import os
import logging
from app_conf import UPLOAD_FOLDER


class FaceDetector(object):
    """
      Face detector helper class handling face detection
      using opencv's Haar classifier.
    """
    def __init__(self, scale_factor=1.2, min_neighbors=4, min_size_scalar=0.25, max_size_scalar=0.75):
        haar_classifier_path = './api/resources/haarcascade_frontalface_default.xml'
        self.detector = cv2.CascadeClassifier(haar_classifier_path)

        if self.detector.empty():
            raise Exception('Haar Classifier xml [%s] file not found : ' % haar_classifier_path)

        self.scale_factor = scale_factor
        self.min_neighbors = min_neighbors
        self.min_size_scalar = min_size_scalar
        self.max_size_scalar = max_size_scalar

    def detect_faces(self, filename):
        image = cv2.imread(filename)
        image_gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

        # height, width = image_gray.shape
        # min_dim = np.min([height, width])
        # min_size = (int(min_dim * self.min_size_scalar),
        #             int(min_dim * self.min_size_scalar))
        # max_size = (int(min_dim * self.max_size_scalar),
        #            int(min_dim * self.max_size_scalar))

        faces = self.detector.detectMultiScale(image_gray, self.scale_factor, self.min_neighbors, minSize=(80, 80))
        return faces, image

    def detect_face(self, filename):
        return self.detect_faces(filename)[0]

    def save_faces(self, filename):
        result = []

        faces, image = self.detect_faces(filename)

        for i, (x, y, w, h) in enumerate(faces):
            roi_color = image[y:y+h, x:x+w]
            roi_color = cv2.resize(roi_color, (128, 128))
            face_filename = os.path.join(UPLOAD_FOLDER, '.'.join(os.path.split(filename)[1].split('.')[:-1]) +
                                          '_' + str(i) + '_face.' + os.path.split(filename)[1].split('.')[-1])

            # saving face image
            cv2.imwrite(face_filename, roi_color)
            logging.debug('Saving face %s' % face_filename)
            face = (x, y, w, h, face_filename)
            result.append(face)
        return result

    def get_faces(self, filename):
        return self.save_faces(filename)
