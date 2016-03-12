(function () {
    angular.module('nightOwl').controller('CreateTagController', function ($scope, $state, $stateParams, nightOwlFactory) {
        $scope.init = function () {
            console.log('initialized');
            console.log($stateParams);
            $scope.store = {};
            getCategories();
            $scope.store.latitude = $stateParams.lat;
            $scope.store.longitude = $stateParams.lng;

        };

        /**
        *   This is to get the list of categories
        */
        function getCategories() {
            nightOwlFactory.getCategories().then(function (data) {
                console.log(data);
                $scope.categories = data.data.result;
                $scope.categories.unshift({id : 'default', name : 'Other'})
                $scope.store.category = $stateParams.categories;
            });
        };
        $scope.init();
    });
})();