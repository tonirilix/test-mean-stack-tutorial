angular.module('flapperNews',['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl:'/home.html',
		controller:'MainCtrl',
		resolve: {
		  postPromise: ['posts', function(posts){
		    return posts.getAll();
		  }]
		}
	})
	.state('posts',{
		url:'/posts/{id}',
		templateUrl:'/posts.html',
		controller:'PostsCtrl',
		resolve: {
		  post: ['$stateParams', 'posts', function($stateParams, posts) {
		    return posts.get($stateParams.id);
		  }]
		}
	});
	$urlRouterProvider.otherwise('home')
}])
.controller('MainCtrl',[
	'$scope',
	'posts',
	function($scope,posts){
		//$scope.title = '';

		$scope.test = 'Hello Alucin!';
		
		// $scope.posts = [
		// 	{title: 'Post 1',upvotes:5},
		// 	{title: 'Post 2',upvotes:2},
		// 	{title: 'Post 3',upvotes:15},
		// 	{title: 'Post 4',upvotes:9},
		// 	{title: 'Post 5',upvotes:4},
		// ];

		$scope.posts = posts.posts;			

		$scope.addPost = function(){			
			if($scope.title === '' || $scope.title === undefined) { return; }

			posts.create({
				title: $scope.title,
			  	link: $scope.link,
			})			

			$scope.title = '';
			$scope.link = '';
		};
		
		/**
		 * Incrementa los votos de un post
		 * @param  {[type]} post
		 * @return {[type]}
		 */
		$scope.incrementUpvotes = function(post){
			//post.upvotes+=1;
			posts.upvote(post);
		};		
	}
])
.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	'post',
	function($scope, $stateParams, posts, post){
		$scope.post = post;

		$scope.addComment = function(){
		  if($scope.body === '') { return; }		  
		  
		  posts.addComment(post._id, {
		  	body: $scope.body,
		    author: 'user',
			})
		  .success(function(comment){
		  	$scope.post.comments.push(comment);
			});

		  $scope.body = '';
		};

		$scope.incrementUpvotes = function(comment){
		  posts.upvoteComment(post, comment);
		};
	}
])
.factory('posts', ['$http',function($http){
  var o = {
    posts: []
  };

  /*gets all posts*/
  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };

  o.create = function(post){
  	return $http.post('/posts',post).success(function(data){
  		o.posts.push(data);
  	});
  };

  o.upvote = function(post){
  	return $http.put('/posts/' + post._id + '/upvote')
  	.success(function(data){
  		post.upvotes = data.upvotes;
  	});
  };

  o.get = function(id){
  	return $http.get('/posts/'+id)
  	.then(function(res){
      return res.data;
    });
  };

  o.addComment = function(id, comment){
  	 return $http.post('/posts/' + id + '/comments', comment);
  };

  o.upvoteComment = function(post,comment){
  	return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
    .success(function(data){    	
      console.log(data);
      comment.upvotes += 1;
    });
  };

  return o;
}]);