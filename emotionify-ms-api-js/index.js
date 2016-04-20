'use strict'

const
    conf = require('./conf'),
    express = require('express'),
    app = express(),
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
            console.log(error)
            return res.send({'status_code': response.statusCode, 'error': error.toString(), 'time': timeDiff(t0)})
        } else {
            console.log(response.statusCode, body)
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
            console.log(error)
            return res.send({'status_code': response.statusCode, 'error': error.toString(), 'time': timeDiff(t0)})
        } else {
            console.log(response.statusCode, body)
            return res.send({'status_code': response.statusCode, 'body': JSON.parse(body), 'time': timeDiff(t0)})
        }
    })
})

function timeDiff(t0) {
    return (Date.now() - t0) / 1000.0
}

app.listen(conf.WEB_PORT)
console.log('Listening on port : ' + conf.WEB_PORT)