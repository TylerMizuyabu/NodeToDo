var app = angular.module('todoApp',['ngRoute','ngResource'])
    .run(function($rootScope,$http,$location){
        $rootScope.authenticated = false;
        $rootScope.currentUser = '';

        $rootScope.signout = function(){
            $http.get('auth/logout');
            $rootScope.authenticated = false;
            $rootScope.currentUser = '';
        }
    });

app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: 'main.html',
        controller: 'MainController'
    })

    .when('/login',{
        templateUrl:'login.html',
        controller: 'authController'
    })

    .when('/register',{
        templateUrl:'register.html',
        controller: 'authController'
    });
});


app.factory('todosService',function($resource){
    return $resource('/api/todos');
});

app.controller('MainController',function(todosService,$http,$scope,$rootScope,$location){
    
    if(! $rootScope.authenticated){
        $location.path('/login');
    }
    $http.get('/api/todos/'+$rootScope.currentUser).success(function(data){
        $scope.todos = data;
    });
    
    $scope.newTodo = {text:'',created_by:$rootScope.currentUser};

    $scope.create = function(){
        $http.post('/api/todos',$scope.newTodo).success(function(data){
            if(data.status == 'success'){
                $http.get('/api/todos/'+$rootScope.currentUser).success(function(data){
                    $scope.todos = data;
                });
                $scope.newTodo = {text:'',created_by:$rootScope.currentUser};
            }else{
                alert(data.error);
            }
        });
    };

    $scope.delete = function(id){
        var data = {id:id, user:$rootScope.currentUser};
        $http({url:'/api/todos', 
            method: 'DELETE', 
            data:data,
            headers:{"Content-Type": "application/json;charset=utf-8"}
            }).success(function(data){
                if(data.status == 'success'){
                    $http.get('/api/todos/'+$rootScope.currentUser).success(function(data){
                        $scope.todos = data;
                    });
                }else{
                    alert(data.error);
                }
                $scope.id = '';
            });
    }
});

app.controller('authController',function($scope,$http,$rootScope,$location){
    $scope.user = {username:'',password:''};
    $scope.error_message = '';

    $scope.login = function(){
        $http.post('/auth/login', $scope.user).success(function(data){
            if(data.status == 'success'){
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user._id;
                $location.path('/');
            }else{
                $scope.error_message = data.message;
            }
        });
    };

    $scope.register = function(){
        $http.post('/auth/signup', $scope.user).success(function(data){
            if(data.status == 'success'){
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user._id;
                $location.path('/');
            }else{
                $scope.error_message = data.message;
            }
        });
    };
});