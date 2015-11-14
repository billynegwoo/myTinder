// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
app = angular.module('myTinder', ['ionic','ngRoute','ionic.contrib.ui.tinderCards'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })


    .controller('LoginController',function($scope, $http, $window, user){
        $scope.credentials = {
            identifier : '',
            password : ''
        };
        $scope.login = function(credentials){
            $http({
                method: 'POST',
                data: credentials,
                url: 'http://192.168.0.28:1337/auth/local'
            }).then(function(response) {
                if (!response.data.error){
                    user.setUser(response.data);
                    return $window.location  = '#/home';
                }
            })
        }

    })


    .controller('RegisterController', function($scope, $http, $window, user){
        $scope.credentials = {
            username:'',
            email : '',
            password : ''
        };
        $scope.register = function(credentials){
            $http({
                method: 'POST',
                data: credentials,
                url: 'http://192.168.0.28:1337/auth/local/register'
            }).then(function(response) {
                if (!response.data.error){
                    user.setUser(response.data);
                    return $window.location  = '#/home';
                }
            })
        }
    })

    .controller('HomeController', function($scope,$http,$ionicSideMenuDelegate,user){
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.user = user.getUser();

    var cardTypes = [];
    $scope.cards = [];

        $http({
            method:'GET',
            url: 'http://192.168.0.28:1337/user'
        }).then(function(response){
            for(var i = 0 ; i< response.data.length; i ++){
                if(user.getUser().id !== response.data[i].id ){
                    cardTypes.push({
                        path : response.data[i].path,
                        username : response.data[i].username,
                        id :  response.data[i].id
                    })
                }

            }
            $scope.addCard = function(i) {
                newCard = cardTypes[i];
                $scope.cards.push(angular.extend({},newCard));
            };
            for(var i = 0; i < cardTypes.length; i++) $scope.addCard(i);

        });
        $scope.cardSwipedLeft = function(index, id) {
            console.log('Left swipe',index, id);
        };

        $scope.cardSwipedRight = function(index, id) {
            console.log('Right swipe',index, id);
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        }
});

app.service('user', function(){
    var user = {};

    return {
        getUser: function () {
            return user;
        },
        setUser: function(value) {
            user = value;
        }
    };
});

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'partials/home.html',
                controller : 'HomeController'
            })
            .when('/', {
                templateUrl: 'partials/login.html',
                controller:'LoginController'
            })
            .when('/register',{
                templateUrl: 'partials/register.html',
                controller:'RegisterController'
            })
    }]);

app.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
})