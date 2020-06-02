/**
 * Created by HISP-WS19 on 16-12-2016.
 */

var app = angular.module('testapp',['jsonFormatter','d2HeaderBar']);
app.controller('testcontroller',function($scope, $http,$timeout, $window){
		
		var getUrl = $window.location.href;
		var urlPart = getUrl.split('=');
		var urlUid = urlPart[1];

			$scope.getSchemas = function (input){
				$http.get("../../schemas.json?paging=false")
          			.then(function (data1) {
			  			var data = data1.data;
					$scope.callSchemaEndPoint(0,data,input);
					});
			}
	// initial check for URL if uid is passsed as argument or not !
		
		if(urlPart.length == 1){}
		
		else if(urlUid == ""){
					alert("Enter Uid");
				}
	
		else{
				// validating length of UID
				if(urlUid.length == 11){
						$scope.uid = urlUid;
						document.getElementById("overlay").style.display = "block";
						document.getElementById("loader").style.display = "block"; 
						document.getElementById("loading").style.display = "block"; 
						$scope.getSchemas($scope.uid);
					}
				
				else{
						alert("Uid must be of 11 characters.");
					}
			}
	
		$scope.callSchemaEndPoint = function (i,dataSchemas,uid,uidFound){
	
			//terminating recursion (if uid not found in whole json)
				if (i>=dataSchemas.schemas.length){
						document.getElementById("loader").style.display = "none";
		 				document.getElementById("loading").style.display = "none";
		 				document.getElementById("loading").innerHTML ="";
						document.getElementById("data").style.display = "none";
						document.getElementById("overlay").style.display = "none";
						document.getElementById("Type").style.display = "none";
						window.alert("Uid is not valid !");
						window.location.replace("../../../api/apps/Angular-test/index.html");
						return;
				}
						var j= i-1;
			//terminating recursion (if uid is found)
				if (uidFound){
			 			document.getElementById("loader").style.display = "none";
			  			document.getElementById("loading").style.display = "none";
			  			document.getElementById("loading").innerHTML ="";
			 			document.getElementById("data").style.display = "block";
						document.getElementById("overlay").style.display = "none";
						document.getElementById("Type").style.display = "block";
			 			document.getElementById("Type").innerHTML = "<b>UID Type : "+dataSchemas.schemas[j].displayName+"</b>";
						return;
				}
		
						var endPointName = dataSchemas.schemas[i].collectionName;
						
			// printing current searching domain

						document.getElementById("loading").innerHTML ="<p id='loadtext'>" +endPointName+"</p>";
				
						$.getJSON("../../"+endPointName+"/"+uid+".json?paging=false", function (response){	
								$timeout(function(){
			// printing Json response through json formatter
										$scope.names = response;
									});
			// calling same function (sending boolean "true" as uid found)	
								$scope.callSchemaEndPoint(i+1,dataSchemas,uid,true);
					
						})
							.error(function(e, x) {			
			// calling same function (sending boolean "false" as uid is not found)
								$scope.callSchemaEndPoint(i+1,dataSchemas,uid,false);
							});
		
					}
			// function on button
    $scope.submit = function () {	
	
			var input = $scope.uid;

			// validations check

 				 if(input == undefined || input == ""){
					  alert("Please enter the valid uid");
				  }
  
				else {
	   				document.getElementById("overlay").style.display = "block";
	  				document.getElementById("loader").style.display = "block"; 
					document.getElementById("loading").style.display = "block"; 
					document.getElementById("data").style.display = "none";
					document.getElementById("Type").style.display = "none";
						$scope.getSchemas($scope.uid);
    			}
   					 };

			});	
	$scope.checkIfEnterKeyWasPressed = function($event){
    	var keyCode = $event.which || $event.keyCode;
    			if (keyCode === 13) {
        			submit();
   				 }

  };