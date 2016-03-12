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
                $state.go('home');
//                toaster.pop('success', 'Sign up successfully');
            },function (data) {
                console.log(data);
                alert(data.data.message);
//                toaster.pop('error', data.data.message);
            });
        };
    });
})();