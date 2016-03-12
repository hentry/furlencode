(function () {
    angular.module('nightOwl').controller('HomeController', function ($scope, $state, uiGmapGoogleMapApi, nightOwlFactory, $uibModal, $rootScope, $timeout) {

        uiGmapGoogleMapApi.then(function(maps) {

            getLocation();
            getCategories();
            $scope.map = {
              center: {
                latitude: 30,
                longitude: 10
              },
              mexiIdKey : 'id',
              zoom: 8,
              bounds: {},
              clickMarkers: [
                      {id: 1, "latitude": 50.948968, "longitude": 6.944781},
                      {id: 2, "latitude": 50.94129, "longitude": 6.95817},
                      {id: 3, "latitude": 50.9175, "longitude": 6.943611}
                    ],
              clickedMarker: {
                  id: 0,
                  options:{
                    draggable: true
                  }
                },
              events: {
                  click: function (mapModel, eventName, originalEventArgs) {

                    var e = originalEventArgs[0];
                    var lat = e.latLng.lat(),
                      lon = e.latLng.lng();
                  $scope.showMarker = false;
                    $scope.map.clickedMarker = {
                      id: 0,
                      latitude: lat,
                      longitude: lon,
                      options : {
                        labelContent: 'Please click the <img src="assets/images/add_tag.svg"/> button in the top to tag this location',
                        labelClass: "marker-labels",
                        labelAnchor:"50 0"
                      }
                    };
                    $scope.selectedCoordinates = {
                        lat : lat,
                        lng : lon
                    };
                    //scope apply required because this event handler is outside of the angular domain
                    $scope.$evalAsync();
                  }
              }
            };
            $scope.options = {
              scrollwheel: false
            };

        });


        var onMarkerClicked = function (marker) {
            marker.showWindow = true;
            $scope.$apply();
        };

        $scope.windowOptions = {
          visible: true
        };

        $scope.onClick = function() {
            $scope.windowOptions.visible = !$scope.windowOptions.visible;
        };

        $scope.closeClick = function() {
            $scope.windowOptions.visible = false;
        };
        $scope.onMarkerClicked = onMarkerClicked;

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log(position);
                    $scope.gotGeoLocation = true;
                    $scope.map.center.latitude = position.coords.latitude;
                    $scope.map.center.longitude = position.coords.longitude;

                    $scope.$evalAsync();
                });
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        /**
        *   This is to get the list of categories
        */
        function getCategories() {
            nightOwlFactory.getCategories().then(function (data) {
                $scope.categories = data.data.result;
                getStores();
            });
        };

        function openModal() {
            if (!$scope.selectedCoordinates || !$scope.selectedCoordinates.lat || !$scope.selectedCoordinates.lng) return;
            $scope.parameters = {
                coords : $scope.selectedCoordinates,
                category : $scope.selectedCategory
              };
            var modalInstance = $uibModal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'app/templates/create-tag-modal.html',
                  controller: 'AddStoreModalController',
                  size: 'lg',
                  resolve: {
                    parameters: function () {
                      return $scope.parameters;
                    }
                  }
                });

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


        function getStores() {

              var markers = [];
              nightOwlFactory.getStores().then(function(data) {
                 console.log(data);
                    for (var index = 0; index < data.data.result.length; index++) {
                        var store = data.data.result[index];
                        markers.push({'id' : store.id, 'latitude' : store.latitude, 'longitude' : store.longitude, 'category' : getCategoryById(store.category_id).name, 'name' : store.name, 'showWindow' : false,"options":{"animation":1,"labelContent":"Markers id 1","labelAnchor":"22 0","labelClass":"marker-labels" }})
                    }
                    $scope.markers = markers;
                    _.each($scope.markers, function (marker) {
                        marker.closeClick = function () {
                            marker.showWindow = false;
                            $scope.$evalAsync();
                        };
                        marker.onClicked = function () {
                            onMarkerClicked(marker);
                        };
                    });
              });

        }

        $scope.goToViewPage = function(id) {
            console.log(id);
        };

//        $scope.goToCreatePage = function() {
//            $state.go('create', {categories: $scope.selectedCategory, lat : $scope.selectedCoordinates.lat,lng : $scope.selectedCoordinates.lng });
//        };

        $scope.goToCreatePage = openModal;

        $scope.init = function () {
            $rootScope.$on('refreshStores', function () {
                getCategories();
                $scope.map.clickedMarker = {};
                $scope.showMarker = false;
            });
            $scope.markers = [];
        };


        $scope.init();
    }).controller('AddStoreModalController', function ($scope, parameters, $uibModalInstance, nightOwlFactory, localStorageService, $rootScope) {

        function createStore() {

            var payload = {
                name : $scope.store.name,
                latitude : $scope.store.latitude,
                longitude : $scope.store.longitude,
                user_id : localStorageService.get('no-userId'),
                category_id : $scope.store.category
            };
            nightOwlFactory.createStore(payload).then(function(data) {
                $uibModalInstance.close();
                $rootScope.$broadcast('refreshStores');
            });
        };

        $scope.ok = function () {
            if (!$scope.isNewCategory) {
                createStore();
            } else {
                nightOwlFactory.createCategory({name : $scope.store.newCategory}).then(function (data) {
                    console.log(data);
                    $scope.store.category = data.data.category[0].id;
                    createStore();
                });
            }


        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init = function () {
            console.log('initialized');
            $scope.store = {};
            getCategories();
            $scope.isNewCategory = false;
            $scope.store.latitude = parameters.coords.lat;
            $scope.store.longitude = parameters.coords.lng;

        };

          /**
          *   This is to get the list of categories
          */
          function getCategories() {
              nightOwlFactory.getCategories().then(function (data) {
                  console.log(data);
                  $scope.categories = data.data.result;
                  $scope.categories.unshift({id : 'default', name : 'Other'})
                  $scope.store.category = parameters.category;
              });
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

          $scope.onCategoryChange = function () {
                $scope.isNewCategory = getCategoryById($scope.store.category).name == 'Other';
          };


          $scope.init();

    }).controller('RedirectController', function($scope, $state) {

        $scope.init = function() {

        };
        $scope.goToViewPage = function($event) {
            var id = $($($event.target).parents().find('#store-id')[0]).html();
            $state.go('review', {id : id});
        };
        $scope.init();
    });
})();