(function () {

    angular.module('nightOwl').factory('nightOwlFactory',function ($http) {

        var factoryObject = {};

        factoryObject.getCategories = getCategories;
        factoryObject.signup = signup;
        factoryObject.login = login;
        factoryObject.getStores = getStores;
        factoryObject.createStore = createStore;
        factoryObject.createCategory = createCategory;
        factoryObject.getStoreById = getStoreById;
        factoryObject.postReview = postReview;

        return factoryObject;

        function getCategories() {
//            return $http.get('assets/json/categories.json');
            return $http.get('http://192.168.2.109:3000/api/categories');
        }

        function signup(data) {
            return $http.post('http://192.168.2.109:3000/api/signup', data);
        }

        function login(data) {
            return $http.post('http://192.168.2.109:3000/api/login', data);
        }

        function getStores() {
            return $http.get('http://192.168.2.109:3000/api/stores');
        }

        function createStore(data) {
            return $http.post('http://192.168.2.109:3000/api/stores', data);
        }

        function createCategory(data) {
            return $http.post('http://192.168.2.109:3000/api/categories', data);
        }

        function getStoreById(id) {
            return $http.get('http://192.168.2.109:3000/api/store/'+id);
        }

        function postReview(data) {
            return $http.post('http://192.168.2.109:3000/api/reviews', data);
        }
    });
})();