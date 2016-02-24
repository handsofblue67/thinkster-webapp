/**
 * Created by michael on 2/22/16.
 */


var app = angular.module('flapperNews', ['ui.router']);


app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['posts', function(posts){
                        return posts.getAll();
                    }]
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams', 'posts', function($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('/home');
    }
]);

app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, posts, post){

        $scope.post = post;

        $scope.addComment = function(){
            if($scope.body === '') { return; }
            $scope.post.comment.push({
                body: $scope.body,
                author: 'user',
                upvotes: 0
            });
            $scope.body = '';
        };
    }
]);

app.factory('posts', ['$http', function($http){
    var o = {
        posts: []
    };

    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };

    o.create = function(post) {
        return $http.post('/post', post).success(function(data){
            o.post.push(data);
        });
    };

    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function(data){
                posts.upvotes += 1;
            });
    };

    o.get = function(id) {
        return $http.get('/post/' + id).then(function(res){
            return res.data;
        });
    };

    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts){

        $scope.posts = posts.posts;

        //$scope.posts = [
        //    {title: 'post 1', upvotes: 5},
        //    {title: 'post 2', upvotes: 2},
        //    {title: 'post 3', upvotes: 15},
        //    {title: 'post 4', upvotes: 9},
        //    {title: 'post 5', upvotes: 4}
        //];

        $scope.addPost = function(){
            if (!$scope.title || $scope.title === '') { return; }
            posts.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpvotes = function(post){
            post.upvote(post);
        };

    }
]);
