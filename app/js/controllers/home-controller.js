(function () {
    angular.module('nightOwl').controller('HomeController', function ($scope, $state, uiGmapGoogleMapApi, nightOwlFactory, $uibModal) {

        uiGmapGoogleMapApi.then(function(maps) {

            $scope.map = {
              center: {
                latitude: 30,
                longitude: 10
              },
              mexiIdKey : 'id',
              mexiMarkers : [
                {   id : '1',
                    latitude: 15,
                      longitude: 80,
                    title: 'Hentry'
                },{
                       id : '1',
                      latitude: 16,
                        longitude: 82,
                      title: 'martin'
                  }
              ],
              zoom: 4,
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
            $scope.markers = [
                {"id":1,"latitude":12,"longitude":77,"showWindow":false,"options":{"animation":1,"labelContent":"Markers id 1","labelAnchor":"22 0","labelClass":"marker-labels"}},
                {"id":2,"latitude":20,"longitude":60,"showWindow":false,"options":{"animation":1,"labelContent":"Markers id 1","labelAnchor":"22 0","labelClass":"marker-labels"}},
                {"id":3,"latitude":30,"longitude":50,"showWindow":false,"options":{"animation":1,"labelContent":"Markers id 1","labelAnchor":"22 0","labelClass":"marker-labels"}}
            ];

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

          _.each($scope.markers, function (marker) {
              marker.closeClick = function () {
                marker.showWindow = false;
                $scope.$evalAsync();
              };
              marker.onClicked = function () {
                onMarkerClicked(marker);
              };
            });

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log(position);
                    $scope.gotGeoLocation = true;
                    $scope.map.center.latitude = position.coords.latitude;
                    $scope.map.center.longitude = position.coords.longitude;

                    if ($scope.$$phase) {
                        $scope.$apply();
                    }
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
                console.log(data);
                $scope.categories = data.data.result;
            });
        };

        function openModal() {
            var modalInstance = $uibModal.open({
                  animation: $scope.animationsEnabled,
                  templateUrl: 'app/templates/create-tag-modal.html',
                  controller: 'ModalInstanceCtrl',
                  size: size,
                  resolve: {
                    items: function () {
                      return {
                        coords : $scope.selectedCoordinates,
                        category : $scope.selectedCategory
                      };
                    }
                  }
                });

        };
//        $scope.goToCreatePage = function() {
//            $state.go('create', {categories: $scope.selectedCategory, lat : $scope.selectedCoordinates.lat,lng : $scope.selectedCoordinates.lng });
//        };

        $scope.goToCreatePage = openModal;

        $scope.init = function () {
            getLocation();
            getCategories();
        };


        $scope.init();
    });
})();