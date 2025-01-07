sap.ui.define(["sap/ui/core/mvc/Controller",'zpoapproval/utils/Formatter',
	'sap/ui/model/Filter',
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/routing/History",
	"sap/ui/model/Sorter"], function (Controller,Formatter,Filter,MessageBox,MessageToast,JSONModel,History,Sorter) {
  "use strict";

  return Controller.extend("zpoapproval.controller.POApprovalMaster", {
    formatter: Formatter,
    onInit: function () {
      var that = this;
      this._UserID = sap.ushell.Container.getService("UserInfo").getId();
      var oModel = new sap.ui.model.odata.ODataModel(
        "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
        true
      );
      this.getView().setModel(oModel);
      oModel.read("/POSuperUserSet('" + this._UserID + "')", {
        success: function (odata, oResponse) {
          debugger;
        },
        error: function () {},
      });
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.getRoute("POApprovalMaster").attachPatternMatched(this._onPatternMatched, this);
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oRouter.getRoute("FirstPage1").attachPatternMatched(this._onEditMatched, this);
      this._Flag = "false";
     // this.getView().byId("idDevAppr").addStyleClass("myApproveOnDeviation");
    },
    _onEditMatched: function (oEvent) {
      var oListDevAppr = this.getView().byId("listPODevAppr");
      var oListToBeApprove = this.getView().byId("listPO");

      var oListAlApproved = this.getView().byId("listPOAlrdyApproved");

      oListDevAppr.removeSelections(true);
      oListToBeApprove.removeSelections(true);
      oListAlApproved.removeSelections(true);

    },
    _onPatternMatched: function (oEvent) {
      var TempValue = this.getView().byId("txtTempValue");
      var oParameters = oEvent.getParameters();

      if (
        oParameters.arguments.TempStatus !== "" ||
        oParameters.arguments.TempStatus !== null
      ) {
        this.TempValue = oParameters.arguments.TempStatus;
        TempValue.setText(this.TempValue);
      }
    },
    onBeforeRendering: function () {
      var that = this;
      var oModel = new sap.ui.model.odata.ODataModel(
        "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
        true
      );
      this.getView().setModel(oModel);
      var oList = this.getView().byId("listPO");
      var oListAlApproved = this.getView().byId("listPOAlrdyApproved");
      var oListDevAppr = this.getView().byId("listPODevAppr");
      var filters = [];
      var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
      filters.push(oUserID);

      var PoCountalDevAppr = this.getView().byId("idtextPocountDevAppr");

      oModel.read("/MyPODeviationListSet", {
        filters: filters,
        success: function (odata, oResponse) {
          var PocountDevAppr = odata.results.length;
          PoCountalDevAppr.setText(PocountDevAppr);
          var oModelData = new sap.ui.model.json.JSONModel();
          oModelData.setData(odata);
          oListDevAppr.setModel(oModelData);
        },
        error: function () {},
      });
      var PoCountToBeApprove = this.getView().byId("idtextPocount");
      oModel.read("/MyPOListSet", {
        filters: filters,
        success: function (odata, oResponse) {
          var Pocount = odata.results.length;
          PoCountToBeApprove.setText(Pocount);
          var oModelData = new sap.ui.model.json.JSONModel();
          oModelData.setData(odata);
          oList.setModel(oModelData);
        },
        error: function () {},
      });
      var PoCountalAlryApproved = this.getView().byId(
        "idtextPocountAlredyAproved"
      );
      oModel.read("/MyPOApprovedListSet", {
        filters: filters,
        success: function (odata, oResponse) {
          var PocountAl = odata.results.length;
          PoCountalAlryApproved.setText(PocountAl);
          var oModelData = new sap.ui.model.json.JSONModel();
          oModelData.setData(odata);
          oListAlApproved.setModel(oModelData);
        },
        error: function () {
         
        },
      });

      var that = this;
      if (this._UserID !== null) {
        that.getButtonsAsperDept(this._UserID);
      }
    },
    attachUpdateFinished: function (oEvent) {
      var oTabSelect = this.getView()
        .byId("idIconTabBarNoIcons")
        .getSelectedKey();
      var aItems = oEvent.getSource().getItems();
      var olistItemDevAppr = this.getView().byId("listPODevAppr");
      var TempPONoSelectionChange = this.getView().byId(
        "txtTemPOSelctionChange"
      );
      var TempValue = this.getView().byId("txtTempValue");
      if (oTabSelect === "DevAppr") {
        if (this._Flag === "false") {
          if (olistItemDevAppr.getItems().length > 0) {
            olistItemDevAppr.getItems()[0].setSelected(true);
            olistItemDevAppr.getItems()[0].firePress();
            this._Flag = "true";
          }
        } else if (this._Flag === "true") {
          if (olistItemDevAppr.getItems().length > 0) {
            for (var i = 0; i < aItems.length; i++) {
              if (
                olistItemDevAppr.getItems()[i].getTitle() ===
                TempPONoSelectionChange.getText()
              ) {
                olistItemDevAppr.getItems()[i].setSelected(true);
                olistItemDevAppr.getItems()[i].firePress();

                break;
              } else {
                if (TempValue.getText() === "R") {
                  olistItemDevAppr.getItems()[0].firePress();
                  olistItemDevAppr.getItems()[0].setSelected(true);
                }
              }
            }
          }
        }
      } else if (oTabSelect === "ToBeApprove") {
        if (this._Flag === "false") {
          if (aItems.length > 0) {
            oEvent.getSource().getItems()[0].setSelected(true);
            oEvent.getSource().getItems()[0].firePress();
            this._Flag = "true";
          }
        } else if (this._Flag === "true") {
          if (aItems.length > 0) {
            for (var i = 0; i < aItems.length; i++) {
              if (
                aItems[i].getTitle().split(":")[1] ===
                TempPONoSelectionChange.getText()
              ) {
                aItems[i].setSelected(true);
                aItems[i].firePress();
                break;
              } else {
                if (TempValue.getText() === "R") {
                  aItems[0].firePress();
                  aItems[0].setSelected(true);
                }
              }
            }
          }
        }
      }
    },
    onSelectionChange: function (e) {

      var oListToBeApproved = this.getView().byId("listPO");
      var PoNo = e.getParameters().listItem.getTitle().split(":")[1];
      var PoStatus = e.getParameters().listItem.getSecondStatus().getText();
      var oDept = this.getView().byId("iddept");
      var POType = e.getParameters().listItem.getAttributes()[7].getText();

      var TempPONoSelectionChange = this.getView().byId(
        "txtTemPOSelctionChange"
      );
      TempPONoSelectionChange.setText(PoNo);
      var postatus = "";
      var TemPStatusforAlApp = "";
      var StatusDevAppr = "";
      var Sid = this.getView().sId;
      //var Sid = this.getView().getId();
      if (PoStatus === "In Query") {
        postatus = "Q";
      } else if (PoStatus === "In Approval") {
        postatus = "A";
      } else if (PoStatus === "Approved") {
        postatus = "AP";
      }
      var oTabSelect = this.getView()
        .byId("idIconTabBarNoIcons")
        .getSelectedKey();

      if (oTabSelect === "ToBeApprove") {
        this.getRouter().navTo("POApprovalDetail", {
          PO_No: PoNo,
          PO_Status: postatus,
          Sid: Sid,
          Dept: oDept.getText(),
          Type: POType,
        });
      } else if (oTabSelect === "AlreadyApproved") {
        this.getRouter().navTo("POApprovalDetailForTab", {
          PO_No: PoNo,
          Sid: Sid,
          TemPStatusforAlApp: "ALP",
          Type: POType,
        });
      } else if (oTabSelect === "DevAppr") {
        this.getRouter().navTo("POApprovalDetailForTab", {
          PO_No: PoNo,
          Sid: Sid,
          TemPStatusforAlApp: "DevA",
          Type: POType,
        });
      }

      if (this._prevSelect) {
        this._prevSelect.$().css('background-color', '');
      }
      var item = e.getParameter("listItem");
      item.$().css('background-color', '#D3D3D3');

      this._prevSelect = item;
    },

    getRouter: function () {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },
    onListItemPress:function(oEvent){
      var oTabSelect = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
      var oDevApprTab = this.getView().byId("idDevAppr");
      var oDept = this.getView().byId("iddept");
      if (oDept.getText() === "REV1")
         {
				  oDevApprTab.setVisible(false);
			}
      var objEdit = oEvent.getSource().getBindingContext().getObject();
      var postatus = "";
   //   var Sid = this.getView().sId;	
      var Sid = this.getView().getId();	
      
      var TemPStatusforAlApp = "";
      var StatusDevAppr = "";
      if (objEdit.PO_Status === "In Query") {
				postatus = "Q";
			}else if(objEdit.PO_Status === "In Approval"){
        postatus = "A";
      }else if (objEdit.PO_Status === "Approved") {
				postatus = "AP";
			}

      if (oTabSelect === "ToBeApprove") {
				this.getRouter().navTo("POApprovalDetail", {
					PO_No: objEdit.PO_No,
					PO_Status: postatus,
					Sid: Sid,
					Dept: objEdit.User_Dept,
					Type: objEdit.PoType
				});

			} else if (oTabSelect === "AlreadyApproved") {
				this.getRouter().navTo("POApprovalDetailForTab", {
					PO_No: objEdit.PO_No,
					Sid: Sid,
					TemPStatusforAlApp: "ALP",
					Type: objEdit.PoType

				});

			}else if (oTabSelect === "DevAppr") {
				var PoCountalDevAppr = this.getView().byId("idtextPocountDevAppr");

				if (PoCountalDevAppr.getText() > 0) {
					this.getRouter().navTo("POApprovalDetailForTab", {
						PO_No: objEdit.PO_No,
						Sid: Sid,
						TemPStatusforAlApp: "DevA",
						Type: objEdit.PoType

					});
				}
}
    },
    onSearch:function(oEvent){
      debugger;
      var sQuery = oEvent.getParameter("query");
      var oTabSelect = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
      var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("PO_No", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Document_Type", sap.ui.model.FilterOperator.Contains, sQuery) 
				]
			});
      if (oTabSelect === "ToBeApprove") {
				var oBinding = this.byId("listPO").getBinding("items");
				oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
			} else if (oTabSelect === "AlreadyApproved") {
				var oBindingAlpp = this.byId("listPOAlrdyApproved").getBinding("items");
				oBindingAlpp.filter(oFilter, sap.ui.model.FilterType.Application);
			} else if (oTabSelect === "DevAppr") {
				var oBindingDevAppr = this.byId("listPODevAppr").getBinding("items");
				oBindingDevAppr.filter(oFilter, sap.ui.model.FilterType.Application);
			}
    },
    handleOpenDialog:function(oEvent){
      if (!this._oDialogFilter) {
				this._oDialogFilter = sap.ui.xmlfragment("zpoapproval.fragments.Filter", this);
				this._oDialogFilter.setModel(this.getView().getModel());
			}
      jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogFilter);
			this._oDialogFilter.open();
     
    },  
    handleConfirm:function(oEvent){
      var query = oEvent.getSource().getSelectedFilterItems();
      var oBinding = this.byId("listPO").getBinding("items");
      if (query.length > 0) {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("PO_Status", sap.ui.model.FilterOperator.EQ, query[0].getText()),
					]
				});
				oBinding.filter(oFilter);
			} else {
				oBinding.filter([]);
			}
    },
    OnSelectTab:function(oEvent){
      var that = this;
      var oModel = this.getView().getModel();
      var sKey = oEvent.getParameter("key");
      var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
      var oListToBeApprove = this.getView().byId("listPO");
			var oListAlreadyApproved = this.getView().byId("listPOAlrdyApproved");
			var oListDevAppr = this.getView().byId("listPODevAppr");
      var filters = [];
      filters.push(oUserID);
      var Pocount;
			var oModelData = new sap.ui.model.json.JSONModel();
			var PoCountToBeApprove = this.getView().byId("idtextPocount");
			var PoCountalAlryApproved = this.getView().byId("idtextPocountAlredyAproved");
			var PoCountalDevAppr = this.getView().byId("idtextPocountDevAppr");
			var status = "";
			var RushText = this.getView().byId("idRush");
      if(sKey === "ToBeApprove"){
        oModel.read("/MyPOListSet", {
					filters: filters,
					success: function(odata, oResponse) {
						that.dataActionRequired = odata.results;
						for (var j = 0; j < that.dataActionRequired.length; j++) {

							if (that.dataActionRequired[j].PoType === "CHANGE") {
								that.dataActionRequired[j].PO_Amount = "";
            		}
}
						PoCountToBeApprove.setText(odata.results.length);

						oModelData.setData(odata);
						oListToBeApprove.setModel(oModelData);

						oListToBeApprove.getItems()[0].setSelected(true);
						oListToBeApprove.getItems()[0].firePress();

					},
					error: function() {
						
					}
				});
        if (PoCountToBeApprove.getText() <= 0) {
					this.getRouter().navTo("poapprovaldetail", {
						status: "A"
					});
				}
        for (var k = 0; k < oListToBeApprove.getItems().length; k++) {
					if (oListToBeApprove.getItems()[k].getTitle().split(":")[0] === "Amd CN no") {
						oListToBeApprove.getItems()[k].getAttributes()[0].setVisible(false);
					}
        }
       

      }else if(sKey === "AlreadyApproved"){
         oModel.read("/MyPOApprovedListSet",{
          filters: filters,
          success:function(odata,oResponse){
            that.dataActionRequired = odata.results;
            for (var j = 0; j < that.dataActionRequired.length; j++) {

							if (that.dataActionRequired[j].PoType === "CHANGE") {
								that.dataActionRequired[j].PO_Amount = "";
								
							}

						}
            PoCountalAlryApproved.setText(odata.results.length);
            oModelData.setData(odata);
            oListAlreadyApproved.setModel(oModelData);
						oListAlreadyApproved.getItems()[0].setSelected(true);
						oListAlreadyApproved.getItems()[0].firePress();

          },
          error:function(oError){

          }
         });
         if (PoCountalAlryApproved.getText() <= 0) {
					this.getRouter().navTo("poapprovaldetail", {
						status: "A"
					});
				}
        for (var k = 0; k < oListToBeApprove.getItems().length; k++) {
					if (oListAlreadyApproved.getItems()[k].getTitle().split(":")[0] === "Amd CN no") {
						oListAlreadyApproved.getItems()[k].getAttributes()[0].setVisible(false);
					}
				}

      }else if(sKey === "DevAppr"){
        oModel.read("/MyPOApprovedListSet", {
					filters: filters,
					success: function(odata, oResponse) {
						that.dataActionRequired = odata.results;
						for (var j = 0; j < that.dataActionRequired.length; j++) {

							if (that.dataActionRequired[j].PoType === "CHANGE") {
								that.dataActionRequired[j].PO_Amount = "";
								
							}

						}
						PoCountalAlryApproved.setText(odata.results.length);

						oModelData.setData(odata);
						oListAlreadyApproved.setModel(oModelData);
						oListAlreadyApproved.getItems()[0].setSelected(true);
						oListAlreadyApproved.getItems()[0].firePress();
					},
					error: function() {
					
					}
				});
				if (PoCountalAlryApproved.getText() <= 0) {
					this.getRouter().navTo("poapprovaldetail", {
						status: "A"
					});
				}

				for (var k = 0; k < oListToBeApprove.getItems().length; k++) {
					if (oListAlreadyApproved.getItems()[k].getTitle().split(":")[0] === "Amd CN no") {
						oListAlreadyApproved.getItems()[k].getAttributes()[0].setVisible(false);
					}
				}
			}


    },
    getButtonsAsperDept: function (UserId) {
      var oModel = this.getView().getModel();
      var filters = [];
      var oUserID = new sap.ui.model.Filter("UserID", "EQ", UserId);
      filters.push(oUserID);
     
      var oDevApprTab = this.getView().byId("idDevAppr");
      var oTabSelect = this.getView().byId("idIconTabBarNoIcons");
      var oDept = this.getView().byId("iddept");

      var oListTo = this.getView().byId("listPO");

      oModel.read("/ApproverDeptSet('" + UserId + "')", {
        success: function (odata, oResponse) {
          oDept.setText(odata.Dept);
          if (odata.Dept === "PUR") {
            oDevApprTab.setVisible(true);
            oTabSelect.setSelectedKey("ToBeApprove");
          } else {
            oTabSelect.setSelectedKey("ToBeApprove");
            oDevApprTab.setVisible(false);
            oListTo.getItems()[0].setSelected(true);
            oListTo.getItems()[0].firePress();
          }
        },

        error: function (e) {
          
        }
      });
    },
  });
});
