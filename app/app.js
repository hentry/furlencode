(function (){

    angular.module('nightOwl', ["ui.bootstrap", 'ui.router', 'uiGmapgoogle-maps']).
    config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

        $stateProvider.state('login', {
            url : '/login',
            controller : 'LoginController',
            templateUrl : 'app/templates/login.html'
        }).state('signup', {
           url : '/signup',
           controller : 'SignUpController',
           templateUrl : 'app/templates/signup.html'
        }).state('home', {
           url : '/home',
           controller : 'HomeController',
           templateUrl : 'app/templates/home.html'
        }).state('create', {
             url : '/create',
             params : {
                categories : '',
                lat : '',
                lng : ''
             },
             controller : 'CreateTagController',
             templateUrl : 'app/templates/create.html'
          });

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyA3uwiUGsgEkzxZmpDRvBmsWKgcV0XuwRI',
            v: '3.22', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });

        $urlRouterProvider.otherwise('/login');
        console.log('calling');
    });
})();