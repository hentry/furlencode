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
            nightOwlFactory.signup(payload).then(function() {

            });
        };
    });
})();