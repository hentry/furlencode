(function () {
    angular.module('nightOwl').controller('LoginController', function ($scope, $state, nightOwlFactory, localStorageService) {
        $scope.init = function () {
            console.log('initialized');
            $scope.user = {};
        };

        $scope.init();

        $scope.login = login;

        function login() {

            var payload = {
                email : $scope.user.email,
                password : $scope.user.password
            };
            nightOwlFactory.login(payload).then(function (data) {
                $state.go('home');
                localStorageService.set('no-userId', data.data.user[0].id);
                localStorageService.set('no-userName', data.data.user[0].name);
                localStorageService.set('no-mailId', data.data.user[0].email);
            });
        }
    });
})();