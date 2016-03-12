(function () {

    angular.module('nightOwl').factory('nightOwlFactory',function ($http, URL) {

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
            return $http.get(URL+'categories');
        }

        function signup(data) {
            return $http.post(URL+'signup', data);
        }

        function login(data) {
            return $http.post(URL+'login', data);
        }

        function getStores() {
            return $http.get(URL+'stores');
        }

        function createStore(data) {
            return $http.post(URL+'stores', data);
        }

        function createCategory(data) {
            return $http.post(URL+'categories', data);
        }

        function getStoreById(id) {
            return $http.get(URL+'store/'+id);
        }

        function postReview(data) {
            return $http.post(URL+'reviews', data);
        }
    });
})();