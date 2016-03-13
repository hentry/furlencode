(function () {
    angular.module('nightOwl').controller('HomeController', function ($scope, $state, uiGmapGoogleMapApi, nightOwlFactory, $uibModal, $rootScope, $timeout, localStorageService, $filter) {

        uiGmapGoogleMapApi.then(function(maps) {

            getLocation();
            getCategories();
            $scope.iconUrl = 'https://s3.amazonaws.com/uploads.hipchat.com/63650/3177593/xS66AZFiD16CG6W/tool%20%281%29.png';
            $scope.userName = localStorageService.get('no-userName');
            $scope.map = {
              center: {
                latitude: 30,
                longitude: 10
              },
              control : {},
              mexiIdKey : 'id',
              zoom: 10,
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
                },currentLocation: {
                    id: 1,
                    options:{
                        icon : 'https://s3.amazonaws.com/uploads.hipchat.com/63650/3177593/Lf4cJasO7iMbJ67/user_icon.png',
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
//                    fa.trackEvent('mapClicked', {latitude: lat,longitude: lon});
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

            $scope.getDirections = function ($event) {

                $scope.directionsDisplay = new google.maps.DirectionsRenderer();
                $scope.directionsService = new google.maps.DirectionsService();
                var geocoder = new google.maps.Geocoder();
                var latitude = ($($event.target).parents().find('#latitude')).html();
                var longitude = ($($event.target).parents().find('#longitude')).html();
                var request = {
                  origin:new google.maps.LatLng($scope.currentLocation.latitude,$scope.currentLocation.longitude),
                  destination:new google.maps.LatLng(latitude,longitude),
                  travelMode: google.maps.TravelMode.DRIVING
                };
                $scope.directionsService.route(request, function (response, status) {
                      if (status === google.maps.DirectionsStatus.OK) {
                        $scope.directionsDisplay.setDirections(response);
                        $scope.directionsDisplay.setMap($scope.map.control.getGMap());
        //                directionsDisplay.setPanel(document.getElementById('directionsList'));
        //                $scope.directions.showList = true;
                      } else {
                        alert('Google route unsuccesfull!');
                      }
                });
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
                    $scope.gotGeoLocation = true;
                    $scope.currentLocation = {};
                    $scope.currentLocation.latitude = position.coords.latitude;
                    $scope.currentLocation.longitude = position.coords.longitude;
                    $scope.map.control.refresh({latitude : $scope.currentLocation.latitude, longitude : $scope.currentLocation.longitude});

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
            fa.trackEvent('newStoreModalOpened', $scope.parameters);
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

                    for (var index = 0; index < data.data.result.length; index++) {
                        var store = data.data.result[index];
                        markers.push({'id' : store.id, 'latitude' : store.latitude, 'longitude' : store.longitude, 'category' : getCategoryById(store.category_id).name, 'categoryId' : store.category_id,  'name' : store.name, 'showWindow' : false,"options":{"animation":1,"labelContent":"Markers id 1","labelAnchor":"22 0","labelClass":"marker-labels" }})
                    }
                    $scope.markers = markers;
                    $scope.markersCopy = angular.copy($scope.markers);
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

        $scope.goToCreatePage = openModal;

        $scope.filterBasedOnCategory = function () {

            var filteredMarkers = [];
            for (var index = 0; index < $scope.markersCopy.length; index++) {
                var marker = $scope.markersCopy[index];
                if (marker.categoryId == $scope.selectedCategory) {
                    filteredMarkers.push(marker);
                }
            }
            $scope.markers = $filter('filter')(filteredMarkers, {name: $scope.tagName});
        };

        $scope.filterBasedOnName = function () {
//            $scope.filterBasedOnCategory();
            $scope.markers = $filter('filter')($scope.markersCopy, {name: $scope.tagName, categoryId : $scope.selectedCategory});
        };

        $scope.init = function () {
            $rootScope.$on('refreshStores', function () {
                getCategories();
                $scope.map.clickedMarker = {};
                $scope.selectedCategory = '';
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
                fa.trackEvent('newStoreCreated', payload);
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
            fa.trackEvent('modalClosedWithoutCreation', {});
            $uibModalInstance.dismiss('cancel');
        };

        $scope.init = function () {
            console.log('initialized');
            $scope.store = {};
            getCategories();
            $scope.isNewCategory = false;
            $scope.store.latitude = parameters.coords.lat;
            $scope.store.longitude = parameters.coords.lng;

            $scope.hstep = 1;
            $scope.mstep = 15;


        };
        $scope.changed = function () {
            $log.log('Time changed to: ' + $scope.store.closeTime);
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