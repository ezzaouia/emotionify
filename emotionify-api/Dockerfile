FROM kaixhin/caffe

RUN apt-get update && apt-get install -y \
  python \
  python-dev \
  python-pip \
  python-opencv


COPY . /emotionify-api
WORKDIR /emotionify-api

ADD requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

ENTRYPOINT ["python"]
CMD ["app.py"]
