'use strict'

const
  utils = require('../utils'),
  _ = require('underscore'),
  controllers = require('./app/index.controllers'),
  services = require('./app/index.services'),
  directives = require('./app/index.directives')

/* jshint -W117 */
let components = angular.module(utils.constants.appnamecomp, ['ng'])

/* jshint -W098 */
_.each(controllers, function (compControllers, exportsKey) {
  _.each(compControllers, function (controller, name) {
    components.controller(name, controller)
  })
})

_.each(services, function (compServices, exportsKey) {
  _.each(compServices, function (service, name) {
    components.factory(name, service)
  })
})

_.each(directives, function (compDirectives, exportsKey) {
  _.each(compDirectives, function (directive, name) {
    components.directive(name, directive)
  })
})

//
let app = angular.module(utils.constants.appname, [utils.constants.appnamecomp, 'nvd3', 'ngRoute', 'ngMaterial', 'ngMdIcons', 'lfNgMdFileInput'])

/* @ngInject */
app.config(function ($routeProvider, $mdIconProvider, $mdThemingProvider) {
  $routeProvider
      .when('/image', {
        controller: 'EmotionifyImageController',
        templateUrl: './app/components/emotionifyImage/emotionify-image.html'
      })
      .when('/video', {
        controller: 'EmotionifyWebRTCController',
        templateUrl: './app/components/emotionifyWebRTC/emotionify-webrtc.html'
      })


    $mdIconProvider.icon("menu", "./app/assets/images/ic_menu_24px.svg", 24)
  $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('red')
})
