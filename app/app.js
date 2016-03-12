(function (){

    angular.module('nightOwl', ["ui.bootstrap", 'ui.router', 'uiGmapgoogle-maps', 'LocalStorageModule']).
    config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, localStorageServiceProvider) {

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
        }).state('review', {
             url : '/review/:id',
             controller : 'ReviewController',
             templateUrl : 'app/templates/view.html'
          });

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyA3uwiUGsgEkzxZmpDRvBmsWKgcV0XuwRI',
            v: '3.22', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });

        localStorageServiceProvider.setStorageType('sessionStorage');

        $urlRouterProvider.otherwise('/login');
        console.log('calling');
    });
})();