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
            fa.trackEvent('loginClicked', {email : payload.email});
            nightOwlFactory.login(payload).then(function (data) {
                $state.go('home');
                fa.trackEvent('loginSuccess', data);
                localStorageService.set('no-userId', data.data.user[0].id);
                localStorageService.set('no-userName', data.data.user[0].name);
                localStorageService.set('no-mailId', data.data.user[0].email);
            });
        }
    });
})();