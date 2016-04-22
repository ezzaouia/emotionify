'use strict'
export class EmotionifyImageController {
    constructor($scope, $http) {
        'ngInject'

        let canvas = document.querySelector('canvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()

        $scope.$watch('files.length', function () {
            // console.log($scope.files)
        })

        this.submit = this._submit($scope, $http, function (res) {
            $scope.result = JSON.stringify(res, null, ' ')
            
            img.onload = function () {

                let width = img.naturalWidth
                let height = img.naturalHeight
                canvas.width = this.width
                canvas.height = this.height

                ctx.drawImage(img, 0, 0) // canvas.width, canvas.height
                ctx.lineWidth = "3"
                ctx.strokeStyle = "#4cc9b4"
                ctx.fillStyle = "#00ABBF"
                ctx.font = "40px serif"
                for (let i = 0; i < res.result.length; i++) {
                    ctx.fillText(res.result[i].argmax_emotion, res.result[i].face_rectangle.top, res.result[i].face_rectangle.left)
                    ctx.rect(res.result[i].face_rectangle.top, res.result[i].face_rectangle.left, res.result[i].face_rectangle.width, res.result[i].face_rectangle.height)
                }
                ctx.stroke()
            };
            img.src = $scope.files[0].lfDataUrl
        })
    }

    _submit($scope, $http, cb) {
        return function () {
            let formData = new FormData()
            angular.forEach($scope.files, function (ob) {
                formData.append('image_file', ob.lfFile)
            })

            $http.post('http://192.168.99.100:5000/emotionify_upload', formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (res) {
                cb(res.data)
            }, function (err) {
                cb({
                    'message': err.toString()
                })
            })
        }
    }
}
