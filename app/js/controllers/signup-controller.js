(function () {
    angular.module('nightOwl').controller('SignUpController', function ($scope, $state, nightOwlFactory) {


        $scope.signup = signup;
        $scope.user = {};

        function signup() {

            var payload = {
                name : $scope.user.name,
                email : $scope.user.email,
                password : $scope.user.password
            };
            fa.trackEvent('signupClicked', {user : payload.name, email : payload.email});
            nightOwlFactory.signup(payload).then(function() {
                $state.go('home');
                fa.trackEvent('signupSuccess', data);
            },function (data) {
                console.log(data);
                fa.trackEvent('signupFailed', data);
            });
        };
    });
})();