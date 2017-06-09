app.factory('AuthFactory', ['FirebaseAuthFactory', '$http', '$location', '$window', function(FirebaseAuthFactory, $http, $location, $window) {
  var auth = FirebaseAuthFactory;
  var loggedIn = {};
  var userInfo = { info: '' };
  var newLoggedIn = { loginStatus: false };

  auth.$onAuthStateChanged(function(firebaseUser) {
    // Check directly if firebaseUser is null
    newLoggedIn.loginStatus = !!firebaseUser;
    loggedIn.value = firebaseUser !== null;
    if (loggedIn.value) {
      getUserData(firebaseUser);
      $location.path('/main');
    } else {
      console.log('user is not logged in');
    }
  });

  function logIn() {
    console.log('login clicked');
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  }

  function getUserData(firebaseUser) {
    firebaseUser.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/users',
        headers: {
          id_token: idToken
        }
      }).then(function(response) {
        console.log('this garbage can function getUserData is not working blargh fuck');
        userInfo.info = response.data;
      });
    });
  }

  return {
    logIn: logIn,
    userInfo: userInfo,
    newLoggedIn: newLoggedIn
  };
}]);
