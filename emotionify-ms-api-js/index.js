'use strict'

const
    conf = require('./conf'),
    path = require('path'),

    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),

    request = require('request'),
    bodyParser = require('body-parser')

let jsonParser = bodyParser.json()
let rawParser = bodyParser.raw({
    type: 'application/octet-stream',
    limit: '4mb'
})

// API request params if any
let params = {
}

let allowCrossDomain = function (req, res, next) {
    res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.append('Access-Control-Allow-Headers', 'Ocp-Apim-Subscription-Key', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next()
}

app.use(allowCrossDomain)


app.use(express.static(path.join(__dirname, conf.CLIENT_PATH)));

console.log(__dirname)

app.post('/emotionify_url', jsonParser, function (req, res) {
    let t0 = Date.now()
    request({
        url: conf.MS_API_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': conf.MS_API_KEY
        },
        json: {
            url: req.body.url
        }
    }, function(error, response, body){
        if(error) {
            // console.log(error)
            return res.send({'status_code': response.statusCode, 'error': error.toString(), 'time': timeDiff(t0)})
        } else {
            // console.log(response.statusCode, body)
            return res.send({'status_code': response.statusCode, 'body': body, 'time': timeDiff(t0)})
        }
    })
})

app.post('/emotionify_blob', rawParser, function (req, res) {
    let t0 = Date.now()
    request({
        url: conf.MS_API_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': conf.MS_API_KEY
        },
        body: req.body
    }, function(error, response, body) {
        if(error) {
            // console.log(error)
            return res.send({'status_code': response.statusCode, 'error': error.toString(), 'time': timeDiff(t0)})
        } else {
            // console.log(response.statusCode, body)
            return res.send({'status_code': response.statusCode, 'body': JSON.parse(body), 'time': timeDiff(t0)})
        }
    })
})

io.on('connection', function (socket) {
    socket.on('frame', function (data) {
        // console.log(data.split(',')[1])
        console.log(new Buffer(data.split(',')[1], 'base64'))

        let t0 = Date.now()
        // request({
        //     url: conf.MS_API_URL,
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/octet-stream',
        //         'Ocp-Apim-Subscription-Key': conf.MS_API_KEY
        //     },
        //     body: new Buffer(data.split(',')[1], 'base64')
        // }, function(error, response, body) {
        //     if(error) {
        //          console.log(error)
        //     } else {
        //          console.log(response.statusCode, body)
        //     }
        // })
    })
})
    
function timeDiff(t0) {
    return (Date.now() - t0) / 1000.0
}

server.listen(conf.WEB_PORT)
console.log('Listening on port : ' + conf.WEB_PORT)