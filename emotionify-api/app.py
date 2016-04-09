from flask import Flask, jsonify
import logging

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hi():
    return jsonify({"message": 'Hi! Server up and running'})

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    app.run(host='0.0.0.0', debug=True)

