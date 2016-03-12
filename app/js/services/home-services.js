(function () {

    angular.module('nightOwl').factory('nightOwlFactory',function ($http) {

        var factoryObject = {};

        factoryObject.getCategories = getCategories;
        factoryObject.signup = signup;

        return factoryObject;

        function getCategories() {
            return $http.get('assets/json/categories.json');
//            return $http.get('http://192.168.2.109:3000/api/categories');
        }

        function signup(data) {
            return $http.post('http://192.168.2.109:3000/api/signup', data);
        }

    });
})();