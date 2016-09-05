var app = angular.module('myApp', ['ngResource']);
/*app.factory('Posts', function($resource){
		return $resource('http://localhost:3000/posts/:id', {id:'@id'});
});*/
app.factory('Posts', function($resource){
		return $resource('http://localhost:3000/posts/:id',null,
			{
				'update' : {
					method : 'PUT'
					}
				
			});
});
app.controller('PostCtrl', function($scope, Posts){

		$scope.editable = false;

		$scope.post = {};	

		$scope.listPosts = function(){
		    $scope.posts = Posts.query();
		}	

		$scope.deletePost = function(postId){
		
			 Posts.delete({id : postId }, function(){   			
	   			$scope.posts.splice($scope.posts.indexOf(this.post), 1);
	   	});	

		}
		$scope.listPosts();

		$scope.editPost = function(){
			$scope.editable = true;			
			$scope.post = this.post;
			return false;						
		}

		$scope.addPost = function(){

			Posts.save($scope.post, function(){				
				$scope.post = {};
				$scope.listPosts();
			}); 
		}

		$scope.Update = function(pid, post){
		  Posts.update({id: pid}, post);			
		}

		$scope.cancel = function(){
			$scope.editable = false;
			$scope.post = {};
		}

		

		/*$scope.newPost = new Posts({
			author: 'The Lord',
			date: '01-12-09',
			message: 'Depending on the Lord',
			title : 'Loving Jesus more'
		});
		$scope.newPost.$save(function(){
			$scope.posts = Posts.query();
		})*/
	

	 



});



/*
57be0f783c56cbc75eb63eaa
57be1e5ce2fdc598213d4464
57be2188e2fdc598213d4465

57be0f163c56cbc75eb63ea9




*/