var WareHouse = angular.module('WareHouse', ['ngRoute'])
    .constant("productsURL", "http://localhost:2403/goods")
    .constant("salelistURL", "http://localhost:2403/salelist")
    .constant("buyrecordURL", "http://localhost:2403/buyrecord")
    .constant("salerecordURL", "http://localhost:2403/salerecord")
    .constant("selectedClass", "active")
    .constant("submitClass", "disabled");

WareHouse.config(function ($routeProvider) {
    $routeProvider.when('/sale_list', {
        templateUrl: "./components/views/sale_list.html"
    }).when('/buy_record', {
        templateUrl: "./components/views/buy_record.html"
    }).when('/sale_record', {
        templateUrl: "./components/views/sale_record.html"
    }).when('/', {
        templateUrl: "./components/views/WareHoue.html"
    }).when('/output_goods', {
        templateUrl: "./components/views/output_goods.html"
    }).when('/goods', {
        templateUrl: "./components/views/goods.html"
    });
});

WareHouse.controller("productscontroller", function ($scope, selectedClass) {
    $scope.selectedProduct = null;
    $scope.selectProduct = function (item) {
        $scope.selectedProduct = item;
    };

    $scope.getProductClass = function (product) {
        return $scope.selectedProduct === product ?
            selectedClass :
            "";
    };
});

WareHouse.controller("indexcontroller", function ($scope, selectedClass) {
    var selectedItem = null;
    $scope.selectItem = function (item) {
        selectedItem = item;
    };

    $scope.getListClass = function (listItem) {
        return selectedItem === listItem ?
            selectedClass :
            "";
    };
});

WareHouse.controller("goodscentercontroller", function ($scope, productsURL, $http, salelistURL, salerecordURL) {
    $scope.goods = {};
    $scope.salelist = {};
    $scope.saleRecord = {};

    $http.get(productsURL).success(function (data) {
        $scope.goods.products = data;
    }).error(function (err) {
        $scope.goods.err = err;
    });

    $http.get(salelistURL).success(function (list) {
        $scope.salelist.data = list;
    }).error(function (err) {
        $scope.salelist.err = err;
    });

    $http.get(salerecordURL).success(function (records) {
        $scope.saleRecord.data = records;
    }).error(function (err) {
        $scope.saleRecord.err = err;
    });
});

WareHouse.controller("feedBackcontroller", function ($scope) {
    $scope.feedBack = {};
});

// WareHouse.controller("updateGoodscontroller", function ($scope, submitClass, productsURL, $http, $route, $window) {
//     $scope.updateGoods = {};
//     $scope.updateGoods.sure = false;
//     $scope.updateResults = {};

//     $scope.getID = function (updateProduct) {
//         dpd.goods.get({
//             "goodsName": updateProduct.goodsName,
//             "categrates": updateProduct.categrates
//         }, function (result) {
//             if (result) {
//                 $scope.updateObj(result[0].id, updateProduct, result);
//                 return;
//             }
//             $http.post(productsURL, {
//                 goodsName: updateProduct.goodsName,
//                 categrates: updateProduct.categrates,
//                 goodsNum: updateProduct.goodsNum,
//             }).success(function (data) {
//                 $scope.updateResults.goods = data;
//                 alert("录入成功");
//             }).error(function (err) {
//                 $scope.updateResults.err = err;
//             });
//         });
//     };

//     $scope.updateObj = function (id, updateGood, result) {
//         console.log(id);
//         console.log(result[0]);
//         dpd.products.put(id, {
//             "goodsName": updateGood.goodsName,
//             "categrates": updateGood.categrates,
//             "goodsNum": result[0].goodsNum + updateGood.goodsNum,
//         }, function (result, err) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log(result);
//         });
//     };


//     $scope.sureSubmit = function () {
//         if (!$scope.updateGoods.sure) {
//             return submitClass;
//         }
//         return "";
//     };

//     $scope.insertGoods = function (updateGoods) {
//         $scope.updateResults = {};

//         $scope.getID(updateGoods);
//     };

//     $route.reload();
//     $window.location.reload();
// });

WareHouse.controller("salelistcontroller", function ($scope) {
    $scope.feedBack = {};
});

WareHouse.controller("outputGoodscontroller", function ($scope, $http, $route, $window, salelistURL, submitClass, salerecordURL, $timeout) {
    $scope.saleGoodsList = {};
    $scope.saleGoodsList.clothes = {};
    $scope.saleGoodsList.foods = {};
    $scope.saleGoodsList.wrtingMaterial = {};
    $scope.SaleListResult = {};
    $scope.checkBit = false;
    $scope.categratesFilterFn1 = function (item) {
        if (item.categrates === "食品") {
            return true;
        }
        return false;
    };
    $scope.categratesFilterFn2 = function (item) {
        if (item.categrates === "服装") {
            return true;
        }
        return false;
    };
    $scope.categratesFilterFn3 = function (item) {
        if (item.categrates === "文具") {
            return true;
        }
        return false;
    };

    $scope.getID = function (updateProduct) {
        dpd.goods.get({
            "goodsName": updateProduct.name,
            "categrates": updateProduct.cate
        }, function (result) {
            console.log(result[0]);
            $scope.updateObj(result[0].id, updateProduct, result);
        });
    };

    $scope.updateObj = function (id, updateGood, result) {
        console.log(id);
        console.log(result[0]);
        dpd.goods.put(id, {
            "goodsName": updateGood.name,
            "categrates": updateGood.cate,
            "goodsNum": result[0].goodsNum - updateGood.num,
        }, function (result, err) {
            if (err) {
                console.log(err);
            }
            console.log(result);
        });
    };

    $scope.insertList = function (saleGoodsList) {
        var time = new Date();
        var m = time.getMonth() + 1;
        var t = time.getFullYear() + "-" + m + "-" +
            time.getDate() + " " + time.getHours() + ":" +
            time.getMinutes() + ":" + time.getSeconds();
        $http.post(salelistURL, {
            saleID: saleGoodsList.listID,
            clothes: saleGoodsList.clothes.name,
            foods: saleGoodsList.foods.name,
            writingMaterial: saleGoodsList.writingMaterial.name,
            saleDate: t
        }).success(function (data) {
            $scope.SaleListResult.data = data;
        }).error(function (err) {
            $scope.SaleListResult.err = err;
        });

        $http.post(salerecordURL, {
            saleID: saleGoodsList.listID,
            categrates: saleGoodsList.clothes.cate,
            saleName: saleGoodsList.clothes.name,
            saleNum: saleGoodsList.clothes.num,
            saleCompany: saleGoodsList.clothes.saleCompany
        }).success(function (data) {
            console.log(data);
        }).error(function (err) {
            console.log(err);
        });

        $http.post(salerecordURL, {
            saleID: saleGoodsList.listID,
            categrates: saleGoodsList.foods.cate,
            saleName: saleGoodsList.foods.name,
            saleNum: saleGoodsList.foods.num,
            saleCompany: saleGoodsList.foods.saleCompany
        }).success(function (data) {
            console.log(data);
        }).error(function (err) {
            console.log(err);
        });

        $http.post(salerecordURL, {
            saleID: saleGoodsList.listID,
            categrates: saleGoodsList.writingMaterial.cate,
            saleName: saleGoodsList.writingMaterial.name,
            saleNum: saleGoodsList.writingMaterial.num,
            saleCompany: saleGoodsList.writingMaterial.saleCompany
        }).success(function (data) {
            console.log(data);
            $scope.getID($scope.saleGoodsList.clothes);
            $scope.getID($scope.saleGoodsList.foods);
            $scope.getID($scope.saleGoodsList.writingMaterial);
            alert("出库成功!");
        }).error(function (err) {
            console.log(err);
            alert("出库失败! 请重新操作");
        });

        $timeout($scope.reload, 2000);

    };

    // $scope.updateGoods = function () {
    //     $scope.getID($scope.saleGoodsList.clothes);
    //     $scope.getID($scope.saleGoodsList.foods);
    //     $scope.getID($scope.saleGoodsList.writingMaterial);
    // };

    $scope.reload = function () {
        $route.reload();
        $window.location.reload();
     };
});


WareHouse.controller("saledetailcontroller", function ($scope) {
    $scope.filterTextFn = "";
    $scope.selectedListID = "出库清单号";

    $scope.selectFilter = function (selectText) {
        $scope.selectedListID = selectText;
        switch (selectText) {
            case "货物类别":
                $scope.filterTextFn = 'categratesFilter';
                break;
            case "货物名称":
                $scope.filterTextFn = 'goodsNameFilter';
                break;
            default:
                $scope.filterTextFn = 'listIDFilter';
                break;
        }
    };

    $scope.filterTable = function (record) {
        switch ($scope.filterTextFn) {
            case "categratesFilter":
                if (record.categrates === $scope.filterText) {
                    return true;
                }
                return false;
            case "goodsNameFilter":
                if (record.saleName === $scope.filterText) {
                    return true;
                }
                return false;
            case "listIDFilter":
                if (record.saleID === $scope.filterText) {
                    return true;
                }
                return false;
            default:
                break;
        }
        return true;
    };

});

// WareHouse.controller("salerecordcontroller", function ($scope, salerecordURL, $http, $route, $location, $window) {
//     $scope.updateRecord = {};
//     $scope.saleResults = {};
//     $scope.updateRecord.income = 0;

//     $scope.getID = function (updateGood) {
//         dpd.products.get({
//             "goodsName": updateGood.saleName,
//             "categrates": updateGood.categrates
//         }, function (result) {
//             $scope.updateObj(result[0].id, updateGood, result);
//         });
//     };

//     $scope.updateObj = function (id, updateGood, result) {
//         console.log(id);
//         console.log(result);
//         dpd.products.put(id, {
//             "goodsName": updateGood.saleName,
//             "categrates": updateGood.categrates,
//             "goodsNum": result[0].goodsNum - updateGood.saleNum
//         }, function (result, err) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log(result);
//         });
//     };

//     $scope.sellGoods = function (updateGood) {
//         updateGood.income = updateGood.salePrice * updateGood.saleNum;
//         $http.post(salerecordURL, {
//             saleID: updateGood.saleID,
//             saleName: updateGood.saleName,
//             categrates: updateGood.categrates,
//             saleNum: updateGood.saleNum,
//             saleCompany: updateGood.saleCompany
//         }).success(function (data) {
//             $scope.saleResults.goods = data;
//             $scope.updateGoods();
//             alert("出库成功");
//             $route.reload();
//             $window.location.reload();

//         }).error(function (err) {
//             $scope.saleResults.err = err;
//             alert($scope.saleResults.err);
//         });

//     };

//     $scope.updateGoods = function () {
//         $scope.getID($scope.updateRecord);
//     };
// });