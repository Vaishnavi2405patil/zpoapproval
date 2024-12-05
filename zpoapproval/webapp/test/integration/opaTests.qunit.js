/* global QUnit */

sap.ui.getCore().attachInit(function(){
	"use strict";
	sap.ui.require(["zpoapproval/test/integration/AllJourneys"
	], function () {
		QUnit.config.autostart = false;
		QUnit.start();
	});
})

// sap.ui.require(["zpoapproval/test/integration/AllJourneys"
// ], function () {
// 	QUnit.config.autostart = false;
// 	QUnit.start();
// });


// QUnit.config.autostart = false;

// sap.ui.getCore().attachInit(function () {
// 	"use strict";

// 	sap.ui.require([
// 		"POApproval/ZPOApproval/test/integration/AllJourneys"
// 	], function () {
// 		QUnit.start();
// 	});
// });