/**
 * Created by mohamed on 21/04/2016.
 */

export class EmotionifyWebRTCController {


    constructor($log, $scope, $rootScope) {
        'ngInject'

        this.$scope = $scope

        /* jshint -W117 */
        this.socketio = io.connect('http://localhost:3003')
        this.sGoStream = 'Start stream'
        this.bIsGoStream = false

        this.goStream = function () {
            if (this.sGoStream === 'Start stream') {
                this.streamWebRTC($log, 'START')
                this.bIsGoStream = true
                this.sGoStream = 'Stop stream'
            } else {
                this.streamWebRTC($log, 'STOP')
                this.bIsGoStream = false
                this.sGoStream = 'Start stream'
            }
        }

        this.chart()

        // this.emotionifiedFrames($log)
    }

    chart() {

        this.options = {
            chart: {
                type: 'lineChart',
                height: 180,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                yDomain: [0, 100],
                x: function (d) {
                    return d.x
                },
                y: function (d) {
                    return d.y
                },
                useInteractiveGuideline: true,
                duration: 500,
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format('.01f')(d)
                    }
                }
            }
        }

        // data
        this.aData = [{values: [], key: 'anger'}, {values: [], key: 'disgust'}, {values: [], key: 'fear'},
            {values: [], key: 'happiness'}, {values: [], key: 'sadness'}, {values: [], key: 'surprise'}, {
                values: [],
                key: 'neutral'
            }]

        // pause / run chart update
        this.rrun = true

        let t = 0 // time x axis
        let socket = this.socketio
        this._ioData
        socket.on('oEmotionifiedFrame', (ioData) => {
            this._ioData = ioData
            for (let i in this.aData) {
                this.aData[i].values.push({x: t, y: this._ioData[this.aData[i].key] * 100})
            }
            this.$scope.$apply() // update both chart
            t += 4
        })
    }

    streamWebRTC($log, opts) {

        let video = document.querySelector('video')
        let canvas = document.querySelector('canvas')
        let ctx = canvas.getContext('2d')
        let timer = null
        let socket = this.socketio

        // let img = new Image()

        if (opts === 'STOP') {
            if (window.stream) {
                video.src = null
                canvas.src = null
                window.stream.getVideoTracks()[0].stop()
            }
            if (this.socketio) {
                this.socketio.disconnect()
                socket = null
            }
            return
        }

        /* jshint -W117 */
        //this.socketio = io.connect('http://localhost:3003')

        function hasUserMedia() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
        }

        let constraints = {
            audio: false,
            video: true
        }

        function successCallback(stream) {
            window.stream = stream
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream)
            } else {
                video.src = stream
            }
        }

        function errorCallback(error) {
            console.log('navigator.getUserMedia error: ', error)
        }

        if (hasUserMedia()) {
            $log.debug('start streaming webrtc')

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

            navigator.getUserMedia(constraints, successCallback, errorCallback)

            timer = setInterval(function () {
                ctx.drawImage(video, 0, 0, 320, 240)
                // console.log(canvas.toDataURL("image/jpeg"))
                socket.emit('frame', canvas.toDataURL("image/jpeg"))
            }, 4000)
        } else {
            alert("Sorry, your browser does not support getUserMedia.")
            return
        }
    }

    emotionifiedFrames($log) {
        let socket = this.socketio
        socket.on('oEmotionifiedFrame', function (data) {
            $log.debug(data)
        })
    }

}

export class Nvd3StackedAreaChartController {

    constructor($scope) {
        'ngInject'

        this.$scope = $scope

        this.options = {
            chart: {
                type: 'stackedAreaChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                x: function (d) {
                    return d[0]
                },
                y: function (d) {
                    return d[1]
                },
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.time.format('%x')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d)
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        }

        this.data = [
            {
                "key": "anger",
                "values": []
            },

            {
                "key": "contempt",
                "values": []
            },

            {
                "key": "disgust",
                "values": []
            },

            {
                "key": "fear",
                "values": []
            },

            {
                "key": "happiness",
                "values": []
            },

            {
                "key": "neutral",
                "values": []
            },

            {
                "key": "sadness",
                "values": []
            },
            {
                "key": "surprise",
                "values": []
            }
        ]

        // push
    }
}