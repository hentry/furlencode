(function () {
    angular.module('nightOwl').controller('ReviewController', function ($scope, $state, $stateParams, nightOwlFactory, uiGmapGoogleMapApi, localStorageService) {
        $scope.init = function () {
            console.log('initialized');
            $scope.store = {};
            $scope.reviewText = '';
            $scope.dateOptions = {
                dateDisabled: false,
                formatYear: 'yy',
                maxDate: new Date(),
                startingDay: 1
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];
            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            getVisitsByStoreId();

        };

        function getVisitsByStoreId() {
            var payload = {
                user_id : localStorageService.get('no-userId'),
                store_id : $stateParams.id
            };

            nightOwlFactory.getVisitsByStoreId(payload).then(function (data) {
                console.log(data);
                $scope.storeVisitCount = data.data.result.count;
            })
        }
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.postVisit = function () {

            var payload = {
                store_id : $stateParams.id,
                user_id : localStorageService.get('no-userId'),
                purpose : $scope.visit.purpose,
                time : $scope.visit.date,
                status : true
            };

            nightOwlFactory.postVisit(payload).then(function () {
                getVisitsByStoreId();
            });
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
                $scope.isAlreadyReviewed();
            });
        };

        $scope.writeAnReview = function () {
            $scope.writeReview = true;
        };

        function rateReview(isLike, critic) {
            var payload = {
                liked : isLike,
                critic : critic,
                user_id : localStorageService.get('no-userId'),
                store_id : $stateParams.id
            };
            nightOwlFactory.postReview(payload).then(function () {
                getStoreById();
            });
        }
        $scope.postThisReview = function (isLike) {
            if (!$scope.reviewText) return;

            rateReview(isLike, $scope.reviewText);
        }

        $scope.isAlreadyReviewed = function () {

            if (!$scope.store.reviews) return;
            $scope.isReviewed = false;
            var myReview = {};

            for (var index = 0; index < $scope.store.reviews.length; index++) {
                var review = $scope.store.reviews[index];
                if (review.user_id == localStorageService.get('no-userId')) {
                    $scope.isReviewed = true;
                    myReview = review;
                    break;
                }
            }

            return myReview;
        };

        $scope.editMyReview = function () {
            $scope.writeReview = true;
            $scope.reviewText = $scope.isAlreadyReviewed().critic;
        };

        $scope.likePost = function (review) {
            review.liked = true;
            rateReview(review.liked, review.critic);
        };

        $scope.init();
    });
})();