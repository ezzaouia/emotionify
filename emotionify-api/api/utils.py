import cv2
import numpy as np

class FaceDetector(object):
    """
      Face detector helper class handling face detection
      using opencv's Haar classifier.
    """
    def __init__(self, scale_factor=1.2, min_neighbors=3, min_size_scalar=0.25, max_size_scalar=0.75, min_size=(65, 65)):
        haar_classifier_path = './api/resources/haarcascade_frontalface_default.xml'
        self.detector = cv2.CascadeClassifier(haar_classifier_path)

        if self.detector.empty():
            raise Exception('Haar Classifier xml [%s] file not found : ' % haar_classifier_path)

        self.scale_factor = scale_factor
        self.min_neighbors = min_neighbors
        self.min_size_scalar = min_size_scalar
        self.max_size_scalar = max_size_scalar
        self.min_size = min_size

    def detect_faces(self, filename):
        image = cv2.imread(filename)
        image_gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

        height, width = image_gray.shape
        min_dim = np.min([height, width])
        min_size = (int(min_dim * self.min_size_scalar),
                    int(min_dim * self.min_size_scalar))
        max_size = (int(min_dim * self.max_size_scalar),
                    int(min_dim * self.max_size_scalar))

        faces = self.detector.detectMultiScale(image_gray, self.scale_factor, self.min_neighbors, 0, min_size, max_size)
        return faces

    def detect_face(self, filename):
        return self.detect_faces(filename)[0]