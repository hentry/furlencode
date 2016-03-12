(function () {
    angular.module('nightOwl').controller('LoginController', function ($scope, $state) {
        $scope.init = function () {
            console.log('initialized');
        };

        $scope.init();

        $scope.login = login;

        function login() {
            $state.go('home');
        }
    });
})();