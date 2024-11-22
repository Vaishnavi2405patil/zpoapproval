sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/m/MessageToast",
	"sap/ui/events/KeyCodes",
	"sap/ca/ui/model/type/Time"],
  function (Controller,
	MessageBox,
	MessageToast,
	KeyCodes,
	Time) {
    "use strict";

    return Controller.extend("vaishnaviapp1.controller.View1", {
      onInit: function (Controller, MessageBox, MessageToast) {
        var ListCurrUrl = this.getOwnerComponent().getModel().sServiceUrl;
        var oListModel = new sap.ui.model.odata.ODataModel(ListCurrUrl, true);
        var docNoFilter = "DocNo eq '0010000067'";
        var url = "/getCommentSet?$filter=" + docNoFilter + " ";
        oListModel.read(url, {
          success: function (odata, response) {
            var oView = this.getView();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(odata);
            oView.setModel(oModel, "comment");
            this.getView().byId("idFeedInput").setEnabled(true);
          }.bind(this),
          error: function (e) {
            console.log("not load data", e);
          },
        });
         var  oFeedInput = this.byId("idFeedInput");
         oFeedInput.addEventDelegate({
          onkeydown:function(e){
           if(e.key === "Enter" || post ){
            var inputCommnet = oFeedInput.getValue();
            this.onPost(inputCommnet);
           }
          }.bind(this)
         })
      },

      // onLiveChange:function(oEvent){
      //   var oOriginalEvent = oEvent.getParameter("originalEvent");
      //   if (oOriginalEvent && oOriginalEvent.key === "Enter"){
      //     var sValue = oEvent.getSource().getValue();
      //     this.onPost(sValue);
      //   }
      // },
      onPost: function (inputCommnet) {
        var oPayload = {
          DocNo: "0010000067",
          EmpName: "Mayank Singh",
          // User: "Vaishnavi",
       // Comment: e.getParameter("value"),
        Comment : inputCommnet 
        };
        var ListCurrUrl = this.getOwnerComponent().getModel().sServiceUrl;
        var oCommentModel = new sap.ui.model.odata.ODataModel(ListCurrUrl,true);
        oCommentModel.create("/getCommentSet", oPayload, {
          success: function (odata, response) {
            var currentDate = new Date();
             var formattedDate = currentDate.toISOString().split("T")[0];
             var formattedTime = currentDate.toTimeString().split(" ")[0];
             odata.Date = formattedDate;
             odata.Time = formattedTime;
            var oModel = this.getView().getModel("comment");
            var oResult = oModel.getProperty("/results");
            oResult.unshift(odata);
            oModel.setProperty("/results", oResult);
            var oList = this.byId("idList");
            var oBinding = oList.getBinding("items");
            this.getView().byId("idFeedInput").setEnabled(false);
         //   var oBinding = oList.getBinding("items");
            MessageToast.show("Comment Posted Successfully");

              

            // this.getView().byId("idInput").setEnabled(false);
            //  MessageToast.show("Comment Posted Successfully");
            // var currentDate = new Date();
            // odata.Date = currentDate.toISOString().split("T")[0];
            // odata.Date = currentDate.toTimeString().split("")[0];
            // var oModel = this.getView().getModel("comment");
            // var oResult = oModel.getProperty("/results");
            // oResult.unshift(odata);
            // oModel.setProperty("/results", oResult);
            // var oList = this.byId("idList");
            // var oBinding = oList.getBinding("items");
          
            if (oBinding) {
              oBinding.refresh();
            }
          }.bind(this),
          error: function (e) {
            console.error("Error loading data:", e);
          },
        });
      },
      /**
       * @override
       */
      // onAfterRendering: function() {
      //   Controller.prototype.onAfterRendering.apply(this, arguments);
      //     let myFeedInput = this.byId("idInput");
      //     let dom = myFeedInput.getFocusDomRef();
      //     if(dom){
      //       dom.addEventListener('keypress',(e)=>{
      //         if((e.keyCode || e.which) == 13){
      //           if(e.preventDefault)
      //             e.preventDefault();
      //           myFeedInput.firePost();
      //                      }
      //       })
      //     }
      
      // }
    });
  }
);
