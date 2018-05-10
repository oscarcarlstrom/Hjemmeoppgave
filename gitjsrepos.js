var app = angular.module("app", []);

//Customize number format
app.run(["$locale", function ($locale) {
    $locale.NUMBER_FORMATS.GROUP_SEP = " ";
}]);

//Init controller
app.controller("controller", function($scope, $http) {
    const GET_REPOS_URL = "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=100";
    const PAGE_VIEW_SIZE = 20; //Defines how many repos to display per page

    var allRepos; //This array holds all repos returned from github
    var nPages; //The number of pages needed for the pagination
    var currentPageIndex; //The index of the current page

    //Show loading animation before the http request is done
    $scope.isLoading = function () {
       return $http.pendingRequests.length !== 0;
    };

    $http.get(GET_REPOS_URL).then(function (response) {
      allRepos = response.data.items;
      nPages = allRepos.length / PAGE_VIEW_SIZE;
      currentPageIndex = 0;

      initTableData(); //Init the table data/meta data
    });

    //Inits the table data/meta data
    function initTableData() {
      //Calculates the number of pagination buttons needed
      $scope.number = nPages;
      $scope.getPageNumber = function(n) {
          return new Array(n);
      }

      //Shows the selected page
      $scope.showPage = showPage;

      $scope.isActive = function (index) {
        return index === currentPageIndex;
      };

      //Shows the next page
      $scope.nextPage = function() {
        if (!isLastPage())
          showPage(currentPageIndex + 1);
      }

      //Shows the previous page
      $scope.prevPage = function() {
        if (!isFirstPage())
          showPage(currentPageIndex - 1);
      }

      //Controls the disabled attribute for prev/next buttons
      $scope.isLastPage = isLastPage;
      $scope.isFirstPage = isFirstPage;

      //Show first page
      $scope.repos = allRepos.slice(currentPageIndex, PAGE_VIEW_SIZE);
    }

    //Sets the selected page
    function showPage(i) {
      var startIndex = i * PAGE_VIEW_SIZE;
      $scope.repos = allRepos.slice(startIndex, startIndex + PAGE_VIEW_SIZE);
      currentPageIndex = i;
    }

    function isLastPage() {
      return currentPageIndex == (nPages - 1);
    }

    function isFirstPage() {
      return currentPageIndex == 0;
    }
});
