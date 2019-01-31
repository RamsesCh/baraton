'use strict';
var app = angular.module('app', ['ngRoute','ngStorage','toastr']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'MainCtrl',
        templateUrl: 'templates/home.html',
        resolve: {
            'service': 'itemsService',
            'serviceCat':'categoriesService'
        }
    });
    $routeProvider.when('/cart', {
        controller: 'CartCtrl',
        templateUrl: 'templates/cart.html',
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
app.factory('itemsService', function ($rootScope, $http, $q, $log, $parse) {
    var deferred = $q.defer();
    $http.get('products.json')
        .then(function (data, status, headers, config) {
            $rootScope.products = data.data.products;
            deferred.resolve();
        });
    return deferred.promise;
});
app.factory('categoriesService', function ($rootScope, $http, $q, $log, $parse) {
    var deferred = $q.defer();
    $http.get('categories.json')
        .then(function (data, status, headers, config) {
            $rootScope.categories = data.data.categories;
            deferred.resolve();
        });
    return deferred.promise;
});
app.controller('MasterCtrl', function($scope, $rootScope, $http, $localStorage, toastr){
    if($localStorage.cart == null){
        $localStorage.cart = [];
   }
    $rootScope.cart = $localStorage.cart;
});
app.controller('MainCtrl', function ($scope, $rootScope, $http, $localStorage, toastr) {
   $scope.listProducts=$rootScope.products
   $scope.listCategories=$rootScope.categories

   $scope.filterSublevel = function(id,name){
        $scope.filterSb = id;
        $scope.filterName = name;
   };

   $scope.allproducts = function(){
        $scope.filterSb = undefined;
        $scope.filterName = undefined;   
   }

   $scope.betwThan = function(prop, val,val2){
        return function(item){
            if(val == undefined || val2 == undefined){
                return true
            };
            if (item[prop] >= val && item[prop] <= val2){
                return true
            };
        };
  };   
   $scope.addItem = function(product){
        var productSelect = {
            id:product.id,
            name:product.name,
            price:product.price,
            cant:1
        }
        console.log(productSelect)
        $localStorage.cart.push(productSelect);
        toastr.success('', 'Producto agregado al carrito.');
   }
});
app.controller('CartCtrl', function($scope, $rootScope, toastr, $localStorage, $timeout, $location, $window){
    $scope.remove = function(index){
        console.log(index);
        $rootScope.cart.splice(index,1);
        toastr.error('','Producto eliminado')
    };
    $scope.more = function(index){
        $rootScope.cart[index].cant = parseInt($rootScope.cart[index].cant) + 1;
    };
    $scope.minus = function(index){
        $rootScope.cart[index].cant = parseInt($rootScope.cart[index].cant) - 1;
    };
    $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < $rootScope.cart.length; i++) {
            var subt = parseFloat($scope.cart[i].price);
            var subt2 = subt*$scope.cart[i].cant;
            var total = total + subt2;
        }
        return total;
    }
    $scope.ordernow = function(user){
        toastr.success('','Orden realizada con exito')
        $localStorage.cart = [];
        $rootScope.cart = [];
        $timeout(function () {
            $location.path('/');
            $window.location.reload()
        }, 2000);
    }
});
