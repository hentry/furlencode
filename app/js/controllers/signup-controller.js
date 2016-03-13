(function () {
    angular.module('nightOwl').controller('SignUpController', function ($scope, $state, nightOwlFactory, localStorageService) {


        $scope.signup = signup;
        $scope.user = {};

        function signup() {

            var payload = {
                name : $scope.user.name,
                email : $scope.user.email,
                password : $scope.user.password
            };
            fa.trackEvent('signupClicked', {user : payload.name, email : payload.email});
            nightOwlFactory.signup(payload).then(function(data) {
                $state.go('home');
                localStorageService.set('no-userId', JSON.parse(data.data.user)[0].id);
                localStorageService.set('no-userName', JSON.parse(data.data.user)[0].name);
                localStorageService.set('no-mailId', JSON.parse(data.data.user)[0].email);
                fa.trackEvent('signupSuccess', data);
            },function (data) {
                console.log(data);
                fa.trackEvent('signupFailed', data);
            });
        };
    });
})();