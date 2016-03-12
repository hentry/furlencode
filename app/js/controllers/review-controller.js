(function () {
    angular.module('nightOwl').controller('ReviewController', function ($scope, $state, $stateParams, nightOwlFactory, uiGmapGoogleMapApi, localStorageService) {
        $scope.init = function () {
            console.log('initialized');
            $scope.store = {};
            $scope.reviewText = '';
            console.log($stateParams);

        };

        uiGmapGoogleMapApi.then(function(maps) {
            getCategories();
        })
        function getAddressFromLAtLong (latitude, longitude) {

            var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(latitude, longitude);

                geocoder.geocode(
                    {'latLng': latlng},
                    function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    var add= results[0].formatted_address;
                                    $scope.store.address = add;
                                    if (!$scope.$$phase) $scope.$apply();
                                }
                                else  {
                                    alert("address not found");
                                }
                        }
                         else {
                            alert("Geocoder failed due to: " + status);
                        }
                    }
                );

        };

        function getCategoryById (id) {

            var selectedCategory = {};
            for (var index =0; index < $scope.categories.length; index++) {
                var category = $scope.categories[index];
                if (category.id == id) {
                    selectedCategory = category;
                    break;
                }
            }

            return selectedCategory;
        };

        function getCategories() {
            nightOwlFactory.getCategories().then(function (data) {
                $scope.categories = data.data.result;
                getStoreById();
            });
        };
        function getStoreById() {
            nightOwlFactory.getStoreById($stateParams.id).then(function (data) {

                if (!data.data.store[0]) return;
                $scope.store = data.data.store[0];
                $scope.store.storeName = getCategoryById($scope.store.category_id).name;
                getAddressFromLAtLong($scope.store.latitude, $scope.store.longitude);
            });
        };

        $scope.writeAnReview = function () {
            $scope.writeReview = true;
        };

        $scope.postThisReview = function () {
            if (!$scope.reviewText) return;

            var payload = {
                liked : false,
                critic : $scope.reviewText,
                user_id : localStorageService.get('no-userId'),
                store_id : $stateParams.id
            };
            nightOwlFactory.postReview(payload).then(function () {
                getStoreById();
            });
        }

        $scope.isAlreadyReviewed = function () {

            if (!$scope.store.reviews) return;
            var isReviewed = false;

            for (var index = 0; index < $scope.store.reviews.length; index++) {
                var review = $scope.store.reviews[index];
                if (review.user_id == localStorageService.get('no-userId')) {
                    isReviewed = true;
                    break;
                }
            }

            return isReviewed;
        };

        $scope.init();
    });
})();