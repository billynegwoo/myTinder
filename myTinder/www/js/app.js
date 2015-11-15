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

    .controller('HomeController', function($scope, $http, $ionicSideMenuDelegate, $window, user, viewed, saved, trashed){
        viewed.setViewed();
        saved.setSaved();
        trashed.setTrashed();

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.logout = function(){
            return $window.location  = '#/';
        };
        var cardTypes = [];

        $scope.cards = [];
        $scope.trashedUsers = [];

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
            $http({
                method:'GET',
                url:'http://192.168.0.28:1337/user_trash?user_id='+ user.getUser().id
            }).then(function(response){
                for(var j = 0 ;j< response.data.length; j++){
                    viewed.addViewed(response.data[j].user_id_trashed);
                };
                $http({
                    method:'GET',
                    url:'http://192.168.0.28:1337/user_save?user_id='+ user.getUser().id
                }).then(function(response){
                    for(var k = 0 ;k< response.data.length; k++){
                        viewed.addViewed(response.data[k].user_id_saved);
                    };
                    for(var i = 0; i < cardTypes.length; i++) $scope.addCard(i);
                });
            });

            $scope.addCard = function(i) {
                var newCard = cardTypes[i];
                if(viewed.getViewed().length === 0){
                    $scope.cards.push(angular.extend({},newCard))
                }
                if (viewed.getViewed().length > 0){
                    for(var l = 0 ; l< viewed.getViewed().length; l++){
                        if(newCard.id === viewed.getViewed()[l]){
                            break
                        }else if(l === viewed.getViewed().length -1){
                            $scope.cards.push(angular.extend({},newCard))
                        };

                    }
                }
            };
        });

        $scope.trashed = function(){
            return $window.location  = '#/trashed';
        };

        $scope.saved = function(){
            return $window.location  = '#/saved';
        };
        $scope.home = function(){
            return $window.location  = '#/home';
        };

        $scope.cardSwipedLeft = function(index, id) {
            console.log('Left swipe',index, id);
            $http({
                method:'POST',
                data:{
                    user_id:user.getUser().id,
                    user_id_trashed:id
                },
                url:'http://192.168.0.28:1337/user_trash'
            });
        };

        $scope.cardSwipedRight = function(index, id) {

            console.log('Right swipe',index, id);
            $http({
                method:'POST',
                data:{
                    user_id:user.getUser().id,
                    user_id_saved:id
                },
                url:'http://192.168.0.28:1337/user_save'
            });
        };

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
        }
    })

    .controller('TrashController', function($scope, $http, $window, saved, trashed , user){
        trashed.setTrashed();

        $scope.trashed = function(){
            return $window.location  = '#/trashed';
        };

        $scope.saved = function(){
            return $window.location  = '#/saved';
        };

        $scope.logout = function(){
            return $window.location  = '#/';
        };
        $scope.home = function(){
            return $window.location  = '#/home';
        };
        $http({
            method:'GET',
            url:'http://192.168.0.28:1337/user_trash?user_id='+ user.getUser().id
        }).then(function(response){
            for(var m = 0; m < response.data.length; m++ ) {
                $http({
                    method: 'GET',
                    url: 'http://192.168.0.28:1337/user?id=' + response.data[m].user_id_trashed
                }).then(function (response) {
                    trashed.addTrashed(response.data.username);
                    $scope.trashedUsers = trashed.getTrashed();
                    console.log($scope.trashedUsers);
                });
            }
        });
    })

    .controller('SaveController', function($scope, $http, $window, saved, trashed , user){
        saved.setSaved();

        $scope.trashed = function(){
            return $window.location  = '#/trashed';
        };

        $scope.saved = function(){
            return $window.location  = '#/saved';
        };
        $scope.logout = function(){
            return $window.location  = '#/';
        };
        $scope.home = function(){
            return $window.location  = '#/home';
        };
        $http({
            method:'GET',
            url:'http://192.168.0.28:1337/user_save?user_id='+ user.getUser().id
        }).then(function(response){
            for(var n = 0; n < response.data.length; n++ ) {
                $http({
                    method: 'GET',
                    url: 'http://192.168.0.28:1337/user?id=' + response.data[n].user_id_saved
                }).then(function (response) {
                    saved.addSaved(response.data.username);
                    $scope.savedUsers = saved.getSaved();
                });
            }
        });
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

app.service('viewed', function(){
    var viewed = [];
    return {
        addViewed: function(value){
            viewed.push(value);
        },
        getViewed: function(){
            return viewed;
        },
        setViewed: function(){
            viewed = [];
        }
    }
});

app.service('trashed', function(){
    var trashed = [];
    return {
        addTrashed: function(value){
            trashed.push(value);
        },
        getTrashed: function(){
            return trashed;
        },
        setTrashed: function(){
            trashed = [];
        }
    }
});

app.service('saved', function(){
    var saved = [];
    return {
        addSaved: function(value){
            saved.push(value);
        },
        getSaved: function(){
            return saved;
        },
        setSaved: function(){
            saved = [];
        }
    }
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
            .when('/trashed',{
                templateUrl: 'partials/trashed.html',
                controller: 'TrashController'
            })
            .when('/saved',{
                templateUrl: 'partials/saved.html',
                controller: 'SaveController'
            })
            .when('/profile',{
                templateUrl: 'partials/profile.html',
                controller: 'ProfileController'
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