sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/m/Token",
    "sap/collaboration/components/fiori/sharing/attachment/Attachment",
    "sap/makit/Value",
  ],
  function (
    Controller,
    MessageBox,
    MessageToast,
    UploadCollectionParameter,
    Dialog,
    Button,
    Fragment,
    History,
    Token,
    Attachment,
    Value
  ) {
    "use strict";

    return Controller.extend("zpoapproval.controller.POApprovalDetail", {
      onInit: function (OEvent) {
        this._UserID = sap.ushell.Container.getService("UserInfo").getId();
        var that = this;
        var oModel = new sap.ui.model.odata.ODataModel(
          "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
          true
        );
        this.getView().setModel(oModel);
        if (this._UserID !== null) {
          that.getUserDeptByUserID(this._UserID);
        }
        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this._oRouter
          .getRoute("POApprovalDetail")
          .attachPatternMatched(this._onEditMatched, this);
        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this._oRouter
          .getRoute("POApprovalDetailChange")
          .attachPatternMatched(this._onEditMatched, this);

        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this._oRouter
          .getRoute("POApprovalDetailForTab")
          .attachPatternMatched(this._onEditMatchedAlreadyApproved, this);

        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this._oRouter
          .getRoute("POApprovalDetailForDevAppr")
          .attachPatternMatched(this._onEditMatchedDevAppr, this);

        this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this._oRouter
          .getRoute("poapprovaldetail")
          .attachPatternMatched(this._onEditMatchedToBeApproved, this);

        // var oUploadCollection = this.getView().byId("UploadCollection");
        // oUploadCollection.setUploadUrl(
        //   "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/POAttachmentsSet"
        // );
        // var filters = [];
        // var oUserId = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
        // filters.push(oUserId);

        // var OUploadButton = this.getView().byId("idupload");
      },
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },
      RefreshMasterList: function () {
        var oModel = this.getView().getModel();
        var oSidPOList = this.getView().byId("idViewForPOList");
        var txtPONOOB = this.getView().byId("objcmp");
        var PONoTemp = txtPONOOB.getTitle();
        var sid = oSidPOList.getText();
        var oList = sid + "--listPO";
        var oList1 = sap.ui.getCore().byId(oList);

        var oListDevAppr = sid + "--listPODevAppr";
        var GetOListDevAppr = sap.ui.getCore().byId(oListDevAppr);
        var aItems = oList1.getItems();
        var filters = [];
        var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
        filters.push(oUserID);
        var oModelData = new sap.ui.model.json.JSONModel();
        var POCoverNote = this.getView().byId("idFrame");
        var POPdf = this.getView().byId("idFramePO");

        var POQueryHistory = this.getView().byId("tblQueryHistory");
        var POQueryComments = this.getView().byId("tblComments");

        var oQueryButton = this.getView().byId("btnQuery");
        var oReviewButton = this.getView().byId("btnReview");
        var oApproveButton = this.getView().byId("btnApprove");
        var oApproveReject = this.getView().byId("btnReject");

        var oPoReleasebutton = this.getView().byId("btnApproveRelese");

        var PurchaseNo = this.getView().byId("PurOrdNo");
        var PODescription = this.getView().byId("PurOrdDesc");
        var POOrderInti = this.getView().byId("PurOrdInt");

        var vendor = this.getView().byId("PurOrdVendor");
        var txtCnDate = this.getView().byId("idCnDate");
        var Plant = this.getView().byId("idPlant");
        var DocType = this.getView().byId("PurDocType");

        var orderdate = this.getView().byId("PurOrdDt");
        var PoStatus = this.getView().byId("PurOrdSts");

        var Attachments = this.getView().byId("UploadCollection");
        var attachmentTitle = this.getView().byId("attachmentTitle");

        var oHtml = this.getView().byId("idFrame");

        var oHtmlPOPdf = this.getView().byId("idFramePO");
        var that = this;

        var Pocount;
        var txtPO_Status = this.getView().byId("objPrice");
        if (txtPO_Status.getText() === "A" || txtPO_Status.getText() === "Q") {
          oModel.read("/MyPOListSet", {
            filters: filters,
            success: function (odata, oResponse) {
              Pocount = odata.results.length;
              if (oList1 !== undefine) {
                if (Pocount > 0) {
                  oModelData.setData(odata);
                  oList1.setModel(oModelData);
                  oHtml.setVisible(true);
                  oHtmlPOPdf.setVisible(true);
                  that.handleIconTabBarSelect();
                } else {
                  oModelData.setData(odata);
                  oList1.setModel(oModelData);
                  txtPONOOB.setTitle("");

                  POCoverNote.setContent(null);
                  POPdf.setContent(null);
                  POQueryHistory.setModel(null);
                  POQueryComments.setModel(null);
                  PurchaseNo.setText("");
                  PODescription.setText("");
                  POOrderInti.setText("");
                  vendor.setText("");
                  Plant.setText("");
                  DocType.setText("");
                  orderdate.setText("");
                  PoStatus.setText("");
                  oQueryButton.setEnabled(false);
                  oReviewButton.setEnabled(false);
                  oApproveButton.setEnabled(false);
                  oApproveReject.setEnabled(false);
                  oPoReleasebutton.setEnabled(false);
                  Attachments.setUploadEnabled(false);
                  attachmentTitle.setText("Uploaded(" + 0 + ") ");
                  Attachments.setModel(null);
                }
              }
            },
            error: function () {},
          });
        } else if (txtPO_Status.getText() === "DevA") {
          var oModelDataDev = new sap.ui.model.json.JSONModel();
          oModel.read("/MyPODeviationListSet", {
            filters: filters,
            success: function (odata, oResponse) {
              Pocount = odata.results.length;
              if (GetOListDevAppr !== undefined) {
                if (Pocount > 0) {
                  oModelDataDev.setData(odata);
                  GetOListDevAppr.setModel(oModelDataDev);
                  oHtml.setVisible(true);
                  oHtmlPOPdf.setVisible(true);
                  that.handleIconTabBarSelect();
                } else {
                  oModelDataDev.setData(odata);
                  GetOListDevAppr.setModel(oModelDataDev);
                  txtPONOOB.setTitle("");

                  POCoverNote.setContent(null);
                  POPdf.setContent(null);
                  POQueryHistory.setModel(null);
                  POQueryComments.setModel(null);
                  PurchaseNo.setText("");
                  PODescription.setText("");
                  POOrderInti.setText("");
                  vendor.setText("");
                  txtCnDate.setText("");
                  Plant.setText("");
                  DocType.setText("");
                  orderdate.setText("");
                  PoStatus.setText("");
                  oQueryButton.setEnabled(false);
                  oReviewButton.setEnabled(false);
                  oApproveButton.setEnabled(false);
                  oApproveReject.setEnabled(false);
                  oPoReleasebutton.setEnabled(false);
                  Attachments.setUploadEnabled(false);

                  attachmentTitle.setText("Uploaded(" + 0 + ") ");
                  Attachments.setModel(null);
                }
              }
            },
            error: function () {},
          });
        }
      },
      handleNavButtonPress: function (oEvent) {
        this.PO_No = "";
        this.getRouter().navTo("FirstPage1", {}, true);
      },
      _onEditMatched: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var oParameters = oEvent.getParameters();

        var txtPONOOB = this.getView().byId("objcmp");
        var txtPO_Status = this.getView().byId("objPrice");

        var oApproveButton = this.getView().byId("btnApprove");
        var oApproveReject = this.getView().byId("btnReject");
        var oApproveButtonRelease = this.getView().byId("btnApproveRelese");
        var oReviewbButton = this.getView().byId("btnReview");

        var oQueryButton = this.getView().byId("btnQuery");
        var oSidPOList = this.getView().byId("idViewForPOList");
        var Attachments = this.getView().byId("UploadCollection");
        var oRevDept = this.getView().byId("idForRev1Dept");
        var oAlreadyApprovedText = this.getView().byId("idAlreadyApproved");

        if (
          oParameters.arguments.PO_No !== "" ||
          oParameters.arguments.PO_No !== null
        ) {
          this.PO_No = oParameters.arguments.PO_No;
          this.POStatus = oParameters.arguments.PO_Status;
          this.SID = oParameters.arguments.Sid;

          this.Dept = oParameters.arguments.Dept;
          that.Type = oParameters.arguments.Type;

          txtPONOOB.setTitle(this.PO_No);
          txtPO_Status.setText(this.POStatus);
          oSidPOList.setText(this.SID);
          var sid = oSidPOList.getText();

          var oList = sid + "--listPO";
          var oList1 = sap.ui.getCore().byId(oList);
          that.oListPO = sap.ui.getCore().byId(oList);
          oAlreadyApprovedText.setText("");
          if (txtPO_Status.getText() === "Q") {
            oApproveButton.setEnabled(false);
            oApproveButtonRelease.setEnabled(false);
            oApproveReject.setEnabled(false);
            oReviewbButton.setEnabled(false);
            oQueryButton.setEnabled(true);
            //  Attachments.setUploadEnabled(true);
            if (this.Dept === "REV1") {
              oReviewbButton.setEnabled(false);
            } else if (this.Dept === "REV2") {
              oReviewbButton.setEnabled(false);
              oApproveButtonRelease.setEnabled(false);
              oApproveReject.setEnabled(false);
            }
          } else if (txtPO_Status.getText() === "A") {
            oApproveButton.setEnabled(true);
            oApproveButtonRelease.setEnabled(true);
            oApproveReject.setVisible(true);

            oApproveReject.setEnabled(true);
            oReviewbButton.setEnabled(true);
            oQueryButton.setEnabled(true);
            //Attachments.setUploadEnabled(true);
            if (oRevDept.getText() === "REV1") {
              oApproveReject.setEnabled(true);
              oReviewbButton.setEnabled(true);
              oQueryButton.setEnabled(true);
            } else if (oRevDept.getText() === "REV2") {
              oApproveReject.setVisible(true);
            }
          }
          that.handleIconTabBarSelect();
        }
      },
      _onEditMatchedToBeApproved: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var oParameters = oEvent.getParameters();

        var txtToBeApproved = this.getView().byId("idToBeApproved");
        var txtPONOOB = this.getView().byId("objcmp");
        var oApproveButton = this.getView().byId("btnApprove");
        var oApproveButtonRelease = this.getView().byId("btnApproveRelese");
        var oReviewbButton = this.getView().byId("btnReview");
        var oQueryButton = this.getView().byId("btnQuery");

        var POCoverNote = this.getView().byId("idFrame");
        var POPdf = this.getView().byId("idFramePO");
        var POQueryHistory = this.getView().byId("tblQueryHistory");
        var POQueryComments = this.getView().byId("tblComments");

        var oQueryButton = this.getView().byId("btnQuery");
        var oReviewButton = this.getView().byId("btnReview");
        var oPoReleasebutton = this.getView().byId("btnApproveRelese");

        var PurchaseNo = this.getView().byId("PurOrdNo");
        var PODescription = this.getView().byId("PurOrdDesc");
        var POOrderInti = this.getView().byId("PurOrdInt");
        var txtCnDate = this.getView().byId("idCnDate");

        var vendor = this.getView().byId("PurOrdVendor");
        var Plant = this.getView().byId("idPlant");
        var DocType = this.getView().byId("PurDocType");

        var orderdate = this.getView().byId("PurOrdDt");
        var PoStatus = this.getView().byId("PurOrdSts");

        var Attachments = this.getView().byId("UploadCollection");
        var attachmentTitle = this.getView().byId("attachmentTitle");

        var oHtml = this.getView().byId("idFrame");

        var oHtmlPOPdf = this.getView().byId("idFramePO");
        var oSidPOList = this.getView().byId("idViewForPOList");
        if (
          oParameters.arguments.status !== "" ||
          oParameters.arguments.status !== null
        ) {
          this.Status = oParameters.arguments.status;
          var POBlank = txtPONOOB.setTitle("");
          txtToBeApproved.setText(this.Status);
          POCoverNote.setContent(null);
          POPdf.setContent(null);
          POQueryHistory.setModel(null);
          POQueryComments.setModel(null);
          PurchaseNo.setText("");
          PODescription.setText("");
          POOrderInti.setText("");
          vendor.setText("");
          txtCnDate.setText("");
          Plant.setText("");
          DocType.setText("");
          orderdate.setText("");
          PoStatus.setText("");

          Attachments.setUploadEnabled(false);
          attachmentTitle.setText("Uploaded(" + 0 + ") ");

          Attachments.setModel(null);

          if (this.Status === "A") {
            oQueryButton.setEnabled(false);
            oReviewButton.setEnabled(false);
            oApproveButton.setEnabled(false);
            oApproveReject.setVisible(true);
            oApproveReject.setEnabled(false);
            oPoReleasebutton.setEnabled(false);
          } else if (this.Status === "D") {
            oApproveReject.setEnabled(false);
            oQueryButton.setEnabled(false);
            oApproveButton.setEnabled(false);
          }
        }
      },
      _onEditMatchedAlreadyApproved: function (oEvent) {
        var that = this;
        var oParameters = oEvent.getParameters();
        var txtPONOOB = this.getView().byId("objcmp");
        var txtPO_Status = this.getView().byId("objPrice");

        var oApproveButton = this.getView().byId("btnApprove");
        var oApproveReject = this.getView().byId("btnReject");
        var oApproveButtonRelease = this.getView().byId("btnApproveRelese");
        var oReviewbButton = this.getView().byId("btnReview");
        var oReviewbButton = this.getView().byId("btnReview");
        var oQueryButton = this.getView().byId("btnQuery");

        var oSidPOList = this.getView().byId("idViewForPOList");
        var oAlreadyApprovedText = this.getView().byId("idAlreadyApproved");
        var oRevDept = this.getView().byId("idForRev1Dept");
        if (
          oParameters.arguments.PO_No !== "" ||
          oParameters.arguments.PO_No !== null
        ) {
          this.PO_No = oParameters.arguments.PO_No;
          this.SID = oParameters.arguments.Sid;
          this.AlrApp = oParameters.arguments.TemPStatusforAlApp;
          that.Type = oParameters.arguments.Type;

          txtPONOOB.setTitle(this.PO_No);
          oSidPOList.setText(this.SID);
          var sid = oSidPOList.getText();

          oAlreadyApprovedText.setText(this.AlrApp);
          txtPO_Status.setText(this.AlrApp);

          if (this.AlrApp === "ALP") {
            var oList = sid + "--listPOAlrdyApproved";
            var oList1 = sap.ui.getCore().byId(oList);
          } else {
            var oList = sid + "--listPODevAppr";
            var oList1 = sap.ui.getCore().byId(oList);
          }
          that.oListPO = sap.ui.getCore().byId(oList);

          that.handleIconTabBarSelect();
          var Attachments = this.getView().byId("UploadCollection");
          Attachments.setUploadEnabled(false);
          oApproveButton.setEnabled(false);
          oApproveButtonRelease.setEnabled(false);
          oApproveReject.setVisible(true);
          oApproveReject.setEnabled(false);
          oReviewbButton.setEnabled(false);
          oQueryButton.setEnabled(false);
          if (oAlreadyApprovedText.getText() === "DevA") {
            oQueryButton.setEnabled(true);
            oApproveButton.setEnabled(true);
            oApproveReject.setVisible(false);
            Attachments.setUploadEnabled(true);
          }
          if (oRevDept.getText() === "REV1") {
            oApproveReject.setVisible(false);
          }
        }
      },
      onUploadComplete: function (oEvent) {
        var that = this;
        that.OnPressAttachments();
      },
      onBeforeUploadStarts: function () {
        var Attachments = this.getView().byId("UploadCollection");
        var PO = this.getView().byId("objcmp").getTitle();

        var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
          name: "slug",
          value: oEvent.getParameter("fileName"),
        });
        oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        var oCustomerHeaderPONo = new sap.m.UploadCollectionParameter({
          name: "PO_NO",
          value: PO,
        });
        oEvent.getParameters().addHeaderParameter(oCustomerHeaderPONo);
        var oCustomerHeaderPONo1 = new sap.m.UploadCollectionParameter({
          name: "PONO",
          value: PO,
        });
        oEvent.getParameters().addHeaderParameter(oCustomerHeaderPONo1);
        var oModel = this.getView().getModel();
        oModel.refreshSecurityToken();
        var oHeaders = oModel.oHeaders;

        var sToken = oHeaders["x-csrf-token"];
        var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
          name: "x-csrf-token",
          value: sToken,
        });
        oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
        Attachments.setBusy(true);
      },
      onFilenameLengthExceed: function (oEvent) {
        var smsg = "Filename Length should be less than 35 characters";
        MessageBox.confirm(msg, {
          icon: sap.m.MessageBox.Icon.INFORMATION,
          title: "Confirm",
          action: [sap.m.MessageBox.Action.OK],
          onClose: function (sAction) {
            if (sAction === "OK") {
            }
          },
        });
      },
      onFileDeleted: function (oEvent) {
        var documnentId = oEvent.getParameter("documentId");
        this.deleteItemById(documnentId);
      },
      deleteItemById: function (sItemToDeleteId) {
        var that = this;
        var oModel = new sap.ui.model.odata.v2.ODataModel(
          "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
          true
        );
        var oPONo = this.getView().byId("objcmp").getTitle();
        oModel.setHeader({
          "X-Requested-With": "X",
          DocumentID: sItemToDeleteId,
        });
        oModel.remove("/POAttachmentsSet('" + oPONO + "')", {
          method: "DELETE",
          success: function (odata, oResponse) {
            MessageBox.success("Attachment Deleted Successfully", {
              icon: sap.m.MessageBox.Icon.SUCCESS,
              title: "Success",
              onClose: function (oAction) {
                that.OnPressAttachments();
              },
            });
          },
          error: function (error) {
            MessageBox.error("error");
          },
        });
      },
      getAttachmentTitleText: function () {
        var aItems = this.getView().byId("UploadCollection").getItems();
        return "Uploaded (" + aItems.length + ")";
      },
      handleSelectDialogPress: function () {
        debugger;
        var opreUsrModel = new sap.ui.model.odata.ODataModel(
          "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
          true
        );
        opreUsrModel.read("FetchPreviousUserIDSet('" + this.PO_No + "')", {
          success: function (odata, oResponse) {
            debugger;
            sap.ui.getCore().byId("inSapId").setValue(odata.USERID);
            sap.ui.getCore().byId("cmbUser").setValue(odata.EMAIL_ID);
            sap.ui.getCore().byId("fetchUser").setValue(odata.USERNAME);
          },
          error: function (oResponse) {
            debugger;
            MessageBox.error("FetchPreviousUserIDSet Failed");
          },
        });
        var oModel = this.getView().getModel();
        if (!this._oDialog) {
          this._oDialog = sap.ui.xmlfragment(
            "zpoapproval.fragments.Query",
            this
          );
          this._oDialog.setModel(this.getView().getModel());
        }
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._oDialog
        );
        this._oDialog.open();

        var cmbUser = sap.ui.getCore().byId("cmbUser");
        var filters = [];

        var oUserName = new sap.ui.model.Filter(
          "Bname",
          "sap.ui.model.FilterOperator.Contains",
          this._UserID
        );
        filters.push(oUserName);

        oModel.read("/UserSearchSet", {
          filters: filters,
          success: function (odata, oResponse) {
            var oModelDataUser = new sap.ui.model.json.JSONModel();
            oModelDataUser.setData(odata);
            cmbUser.setModel(oModelDataUser);
          },
          error: function (oResponse) {
            MessageBox.error("error");
          },
        });
        var oPONo = this.getView().byId("objcmp").getTitle();
        var Title =
          "Purchase Order/Change Cover Note No: " + oPONo + " - Query";

        var oTitle = this._oDialog.setTitle(Title);
        var oTitle = this._oDialog.setTitle(Title);
        cmbUser.setFilterFunction(function (sTerm, oItem) {
          var sItemText = oItem.getText().toLowerCase(),
            sSearchTerm = sTerm.toLowerCase();

          return sItemText.indexOf(sSearchTerm) > -1;
        });
      },
      OnCancelQuery: function (oEvent) {
        this._oDialog.close();
        if (this._oDialog) {
          this._oDialog.destroy();
          this._oDialog = null;
        }
      },
      SelectDialogPressApprove: function (oEvent) {
        if (!this._PressoDialog) {
          this._PressoDialog = sap.ui.xmlfragment(
            "zpoapproval.fragments.Approve",
            this
          );
          this._PressoDialog.setModel(this.getView().getModel());
        }
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._PressoDialog
        );
        this._PressoDialog.open();
        var lblOtp = sap.ui.getCore().byId("lblotp");
        var txtOtp = sap.ui.getCore().byId("idOTP");
        var genericUser = sap.ui.getCore().byId("txtgenericuser");

        var oModel = this.getView().getModel();
        oModel.read("/CheckGenericUserSet(UserID= '" + this._UserID + "')", {
          success: function (odata, oResponse) {
            if (odata.Generic === "X") {
              genericUser.setText(odata.Generic);
              lblOtp.setVisible(true);
              txtOtp.setVisible(true);
            } else {
              lblOtp.setVisible(false);
              txtOtp.setVisible(false);
            }
          },
          error: function (oResponse) {},
        });
        var oPONo = this.getView().byId("objcmp").getTitle();
        var TitleApprove =
          "Purchase Order/Change Cover Note No: " + oPONo + " - Approve";
        this._PressoDialog.setTitle(TitleApprove);
      },
      OnCancelApprove: function (oEvent) {
        this._PressoDialog.close();
        if (this._PressoDialog) {
          this._PressoDialog.destroy();
          this._PressoDialog = null;
        }
      },
      SelectDialogPressReject: function (oEvent) {
        if (!this._RejectoDialog) {
          this._RejectoDialog = sap.ui.xmlfragment(
            "zpoapproval.fragments.Reject",
            this
          );
          this._RejectoDialog.setModel(this.getView().getModel());
        }
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._RejectoDialog
        );
        this._RejectoDialog.open();
        var PoRejectionComments = sap.ui.getCore().byId("idRejectionComments");
        PoRejectionComments.setValue(null);
        var oPONo = this.getView().byId("objcmp").getTitle();
        var Title =
          "Purchase Order/Change Cover Note No: " + oPONo + " - Reject";
        this._RejectoDialog.setTitle(Title);
      },
      OnCancelReject: function (oEvent) {
        this._RejectoDialog.close();
        if (this._RejectoDialog) {
          this._RejectoDialog.destroy();
          this._RejectoDialog = null;
        }
      },

      handleDialogPressReview: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var Dept = "";
        oModel.read("/ApproverDeptSe('" + this._UserID + "'')", {
          success: function () {
            Dept = odata.Dept;
            that.getOpenReviewPOPUP(Dept);
          },
          error: function () {},
        });
      },
      getOpenReviewPOPUP: function (Dept) {
        var oPONo = this.getView().byId("objcmp").getTitle();
        if (Dept === "REV1") {
          if (!this._ReviewoDialog) {
            this._ReviewoDialog = sap.ui.xmlfragment(
              "zpoapproval.fragments.Review",
              this
            );
            this._ReviewoDialog.setModel(this.getView().getModel());
          }
          jQuery.sap.syncStyleClass(
            "sapUiSizeCompact",
            this.getView(),
            this._ReviewoDialog
          );
          this._ReviewoDialog.open();
          var Title = "Purchase Order No: " + oPONo + " - Review";
          var PoReviewComments = sap.ui.getCore().byId("idReviewComments");
          PoReviewComments.setValue(null);
          this._ReviewoDialog.s;
          this._ReviewoDialog.close();
          etTitle(Title);
        } else if (Dept === "REV2") {
          var oModel = this.getView().getModel();
          if (!this.oDialogReview2) {
            this.oDialogReview2 = sap.ui.xmlfragment(
              "POApproval.ZPOApproval.fragments.Review2",
              this
            );
            this.oDialogReview2.setModel(this.getView().getModel());
          }
          jQuery.sap.syncStyleClass(
            "sapUiSizeCompact",
            this.getView(),
            this.oDialogReview2
          );
          this.oDialogReview2.open();

          var inputReview2 = sap.ui.getCore().byId("cmbUserR");
        }
      },
      OnCancelReview: function () {
        this._ReviewoDialog.close();
        if (this._ReviewoDialog) {
          this._ReviewoDialog.destroy();
          this._ReviewoDialog = null; // make it falsy so that it can be created next time
        }
      },
      OnCancelReview2: function () {
        this.oDialogReview2.close();
        if (this.oDialogReview2) {
          this.oDialogReview2.destroy();
          this.oDialogReview2 = null;
        }
      },
      SelectDialogPressPORelease: function (oEvent) {
        if (!this._PressPOReleaseDialog) {
          this._PressPOReleaseDialog = sap.ui.xmlfragment(
            "zpoapproval.fragments.PORelease",
            this
          );
          this._PressPOReleaseDialog.setModel(this.getView().getModel());
        }
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._PressPOReleaseDialog
        );
        this._PressPOReleaseDialog.open();
        var PoApprovalComments = sap.ui.getCore().byId("idCommentsPORelase");
        PoApprovalComments.setValue(null);

        var oPONo = this.getView().byId("objcmp").getTitle();
        var TitleApprove =
          "Purchase Order/Change Cover Note No: " + oPONo + " - Approve";

        this._PressPOReleaseDialog.setTitle(TitleApprove);
      },
      OnCancelPORelease: function () {
        this._PressPOReleaseDialog.close();
        if (this._PressPOReleaseDialog) {
          this._PressPOReleaseDialog.destroy();
          this._PressPOReleaseDialog = null;
        }
      },
      GetClock24hrs: function () {
        var result = "";
        var d = new Date();
        var nhour = d.getHours(),
          nmin = d.getMinutes(),
          nsec = d.getSeconds();
        if (nhour === 0) {
          nhour = nhour;
        } else if (nhour >= 24) {
          nhour = nhour - 24;
        }
        if (nhour <= 9) {
          nhour = "0" + nhour;
        }
        if (nmin <= 9) {
          nmin = "0" + nmin;
        }
        if (nsec <= 9) {
          nsec = "0" + nsec;
        }
        result = nhour + ":" + nmin + ":" + nsec;
        return result;
      },
      _GetCuurentDate: function (CurrDate) {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        if (day < 10) {
          day = "0" + parseInt(currentDate.getDate());
        }
        if (month < 10) {
          month = "0" + parseInt(currentDate.getMonth() + 1);
        }
        CurrDate = day + "-" + month + "-" + year;
        return CurrDate;
      },
      OnSubmitApproval: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var po = this.getView().byId("objcmp").getTitle();
        var PoApprovalDate = that._GetCuurentDate();
        var PoApprovalTime = that.GetClock24hrs();
        var txtPO_Status = this.getView().byId("objPrice");
        var PoStatus;
        if (txtPO_Status.getText() === "A") {
          PoStatus = "A";
        } else if (txtPO_Status.getText() === "DevA") {
          PoStatus = "DEV2";
        }
        if (this.Type === "CHANGE") {
          var POType = "Amendment";
        } else {
          var POType = "PO";
        }

        var oSidPOList = this.getView().byId("idViewForPOList");

        var sid = oSidPOList.getText();

        var oList = sid + "--listPO";
        var oList1 = sap.ui.getCore().byId(oList);
        var aItems = oList1.getItems();
        var oItems = {};
        oItems.PO = po;
        oItems.UserName = this._UserID;
        oItems.POApprovalDate = PoApprovalDate;
        oItems.POApprovalTime = PoApprovalTime;
        oItems.POStatus = PoStatus;
        oItems.POApprovalComments = "Approved";
        oModel.setHeaders({
          "X-Requested-With": "X",
        });

        var genericUser = sap.ui.getCore().byId("txtgenericuser").getText();
        var txtOTP = sap.ui.getCore().byId("idOTP").getValue();
        if (genericUser === "X") {
          oModel.raed(
            "/CheckOTPSet(PO_NO='" +
              po +
              "',UserID'" +
              this._UserID +
              "',OTP='" +
              txtOTP +
              "')",
            {
              success: function (odata, oResponse) {
                if (odata.Valid === "") {
                  MessageBox.error("This OTP is not valid");
                  return;
                } else {
                  oModel.create("/UserApprovalSet", oItems, {
                    success: function () {
                      var smsg =
                        POType + po + " has been Successfully Approved";
                      that.OnCancelApprove();
                      MessageToast.show(smsg);
                      that.RefreshMasterList();
                      that.navtoMasterPage();
                    },
                    error: function () {},
                  });
                }
              },
              error: function (oResponse) {},
            }
          );
        }
      },

      OnSubmitPORelease: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var po = this.getView().byId("objcmp").getTitle();
        var PoReleaseDate = that._GetCuurentDate();
        var PoReleaseTime = that.GetClock24hrs();
        var PoStatus = "REL";
        var PReleaseComments = sap.ui.getCore().byId("idCommentsPORelase");

        if (PReleaseComments.getValue() === "") {
          MessageToast.show("Please Fill Comments");
          return false;
        } else {
          var oItems = {};
          oItems.PO = po;
          oItems.UserName = this._UserID;
          oItems.POApprovalDate = PoReleaseDate;
          oItems.POApprovalTime = PoReleaseTime;
          oItems.POStatus = PoStatus;
          oItems.POApprovalComments = PReleaseComments.getValue();
          oModel.setHeaders({
            "X-Requested-With": "X",
          });
          if (this.Type === "CHANGE") {
            var POType = "Amendment";
          } else {
            var POType = "PO";
          }
          oModel.create("/UserApprovalSet", oItems, {
            success: function (odata, oResponse) {
              var smsg = POType + po + " has been Successfully Approved";
              that.OnCancelPORelease();
              MessageToast.show(smsg);
              that.RefreshMasterList();
              that.navtoMasterPage();
            },
            error: function (oError) {},
          });
        }
      },
      OnSubmitReject: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var oButton = oEvent.getSource();
        var Dept = "";
        oModel.read("/ApproverDeptSet('" + this._UserID + "')", {
          succeess: function () {
            Dept = odata.Dept;
            that.OnRejectReview2POPUP(Dept);
          },
          error: function () {},
        });
      },
      OnRejectReview2POPUP: function (Dept) {
        var oModel = this.getView().getModel();
        var that = this;
        var po = this.getView().byId("objcmp").getTitle();

        var PoRejectionDate = that._GetCuurentDate();
        var PorejectionTime = that.GetClock24hrs();
        var PoStatus = "R";
        var PoStatusReview2 = "REJ_REV";
        var PoRejectionComments = sap.ui.getCore().byId("idRejectionComments");
        if (Dept === "PUR" || Dept === "REV1") {
          if (PoRejectionComments.getValue() === "") {
            MessageToast.show(" Please Fill the Comments ");
            return false;
          } else {
            var oItems = {};
            oItems.PO = po;
            oItems.UserName = this._UserID;
            oItems.PORejectionDate = PoRejectionDate;
            oItems.PORejectionTime = PorejectionTime;
            oItems.POStatus = PoStatus;
            oItems.PORejectionComments = PoRejectionComments.getValue();
            oModel.setHeaders({
              "X-Requested-With": "X",
            });
            if (this.Type === "CHANGE") {
              var POType = "Amendment";
            } else {
              var POType = "PO";
            }
            oModel.create("/UserRejectionSet", oItems, {
              success: function (odata, oResponse) {
                var smsg = POType + po + " has been Successfully Rejected";
                that.OnCancelReject();
                MessageToast.show(smsg);
                that.RefreshMasterList();
                that.navtoMasterPage();
              },
              error: function (oError) {},
            });
          }
        } else if (Dept === "REV2") {
          if (PoRejectionComments.getValue() === "") {
            MessageToast.show(" Please Fill the Comments ");
            return false;
          } else {
            var oItemsR = {};
            oItemsR.PO = po;
            oItemsR.UserName = this._UserID;
            oItemsR.PORejectionDate = PoRejectionDate;
            oItemsR.PORejectionTime = PorejectionTime;
            oItemsR.POStatus = PoStatusReview2;
            oItemsR.PORejectionComments = PoRejectionComments.getValue();
            oModel.setHeaders({
              "X-Requested-With": "X",
            });
            if (this.Type === "CHANGE") {
              var POType = "Amendment";
            } else {
              var POType = "PO";
            }
            oModel.create("/UserRejectionSet", oItemsR, {
              success: function (odata, oResponse) {
                var smsg = POType + po + " has been Successfully Rejected";
                that.OnCancelReject();
                MessageToast.show(smsg);
                that.RefreshMasterList();
                that.navtoMasterPage();
              },
              error: function (oError) {},
            });
          }
        }
      },
      OnChangeQueryText: function () {
        var oQueryTextChange = sap.ui.getCore().byId("idQuery");
        var oGetKey = oQueryTextChange.getSelectedKey();
        var idOthers = sap.ui.getCore().byId("idOthers");
        if (oGetKey === "Others") {
          idOthers.setText("");
        }
      },
      OnSubmitQuery: function (oEvent) {
        var oModel = this.getView().getModel();
        var that = this;
        var po = this.getView().byId("objcmp").getTitle();
        var SAPID = sap.ui.getCore().byId("inSapId");
        var EmailID = sap.ui.getCore().byId("cmbUser");
        var PoQuerTo = SAPID.getValue();

        var searchtext1 = "(";
        var searchtext2 = ")";
        var pos1 = PoQuerTo.indexOf(searchtext1);
        var pos2 = PoQuerTo.indexOf(searchtext2);
        var POQueyToGetValue = PoQuerTo.substring(pos1 + 1, pos2);

        var PoQueryDate = that._GetCuurentDate();
        var PoQueryTime = that.GetClock24hrs();
        var PoQueryText = sap.ui.getCore().byId("idQuery");
        if (PoQueryText.getValue() === "") {
          MessageToast.show(" Please Fill the details ");
          return false;
        } else {
          var oItems = {};
          oItems.PO_NO = po;
          oItems.Query_From = this._UserID;
          oItems.Query_To = PoQuerTo;
          oItems.Query_Date = PoQueryDate;
          oItems.Query_Time = PoQueryTime;
          oItems.Query_Text = PoQueryText.getValue();
          oItems.Query_To_EmailID = EmailID.getValue();
          oModel.setHeaders({
            "X-Requested-With": "X",
          });
          if (this.Type === "CHANGE") {
            var POType = "Query for Amendment";
          } else {
            var POType = "Query for PO ";
          }
          var POQueryUserName;
          if (pos1 > 0) {
            POQueryUserName = POQueyToGetValue;
          } else {
            POQueryUserName = PoQuerTo;
          }
          if (SAPID.getValue() === "") {
            MessageBox.error("SAP ID is not filled");
          } else {
            oModel.create("/POQuerySet", oItems, {
              success: function (odata, oResponse) {
                var smsg = POType + po + " has been Raised";
                that.OnCancelQuery();
                MessageBox.confirm(smsg, {
                  icon: sap.m.MessageBox.Icon.INFORMATION,
                  title: "Confirm",
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function (sAction) {
                    if (sAction === "OK") {
                      that.RefreshMasterList();
                      that.navtoMasterPage();
                    }
                  },
                });
              },
              error: function (oError) {},
            });
          }
        }
      },
      OnSubmitReview: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var po = this.getView().byId("objcmp").getTitle();
        var PoReveiwDate = that._GetCuurentDate();
        var PoReviewTime = that.GetClock24hrs();
        var PoStatus = "REV";
        var PoReviewComments = sap.ui.getCore().byId("idReviewComments");
        if (PoReviewComments.getValue() === "") {
          MessageToast.show("Please Fill Comments");
          return false;
        } else {
          var oItems = {};
          var that = this;
          oItems.PO = po;
          oItems.UserName = this._UserID;
          oItems.POApprovalDate = PoReveiwDate;
          oItems.POApprovalTime = PoReviewTime;
          oItems.POStatus = PoStatus;
          oItems.POApprovalComments = PoReviewComments.getValue();
          oModel.setHeaders({
            "X-Requested-With": "X",
          });
          oModel.create("/UserApprovalSet", oItems, {
            success: function (odata, oResponse) {
              var smsg = "PO " + po + " has been Reviewed";
              that.OnCancelReview();
              MessageBox.confirm(smsg, {
                icon: sap.m.MessageBox.Icon.INFORMATION,
                title: "Confirm",
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (sAction) {
                  if (sAction === "OK") {
                    that.RefreshMasterList();
                    that.navtoMasterPage();
                  }
                },
              });
            },
            error: function (oResponse) {},
          });
        }
      },
      OnSubmitReview2: function (oEvent) {
        var that = this;
        var oTable = sap.ui.getCore().byId("tblUserReview2");
        var oModel = this.getView().getModel();
        var oModelItems = oTable.getModel();
        var po = this.getView().byId("objcmp").getTitle();

        var oItems = {};
        var PoReveiwDate = that._GetCuurentDate();
        var PoReviewTime = that.GetClock24hrs();
        var PoStatus = "REV";
        var PoReview2Comments = sap.ui.getCore().byId("idReview2Comments");
        var PoReview2USer = sap.ui.getCore().byId("cmbUserR");
        oModel.setUseBatch(true);
        var aItems = oTable.getItems();

        var oSidPOList = this.getView().byId("idViewForPOList");

        var sid = oSidPOList.getText();

        var oList = sid + "--listPO";
        var oList1 = sap.ui.getCore().byId(oList);
        var aListItem = oList1.getItems();
        if (
          PoReview2Comments.getValue() === "" ||
          PoReview2USer.getTokens().length === 0 ||
          oTable.getItems().length <= 0
        ) {
          MessageToast.show(" Please Fill the Comment And Select the User ");
          return false;
        } else {
          for (var i = 0; i < aItems.length; i++) {
            var BNAME = oModelItems.getProperty(
              "UserID",
              aItems[i].getBindingContext()
            );
            var batchChanges = [];
            var oItemsTable = {};
            oItemsTable.PO = po;
            oItemsTable.BName = BNAME;
            oItemsTable.Name_First = "";
            oItemsTable.Name_Last = "";
            batchChanges.push(
              oModel.createBatchOperation(
                "POFinanceReleaseApproversSet",
                "POST",
                oItemsTable
              )
            );
            oModel.addBatchChangeOperations(batchChanges);
            oModel.submitBatch(
              function (data) {},
              function (err) {}
            );
          }
          oItems.PO = po;
          oItems.UserName = this._UserID;
          oItems.POApprovalDate = PoReveiwDate;
          oItems.POApprovalTime = PoReviewTime;
          oItems.POStatus = PoStatus;
          oItems.POApprovalComments = PoReview2Comments.getValue();
          oModel.create("/UserApprovalSet", oItems, {
            success: function (odata, oResponse) {
              var smsg = "PO " + po + " has been Reviewed";
              that.OnCancelReview2();
              MessageBox.confirm(smsg, {
                icon: sap.m.MessageBox.Icon.INFORMATION,
                title: "Confirm",
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (sAction) {
                  if (sAction === "OK") {
                    that.RefreshMasterList();
                    that.navtoMasterPage();
                  }
                },
              });
            },
            error: function (oError) {},
          });
        }
      },
      getUserDeptByUserID: function (UserId) {
        var filters = [];
        var Pocount;
        var POCountMyPOList;
        var that = this;
        var oUserID = new sap.ui.model.Filter("UserID", "EQ", UserId);
        filters.push(oUserID);
        var oModel = this.getView().getModel();
        var txtPO_Status = this.getView().byId("objPrice");
        oModel.read("/MyPODeviationListSet", {
          filters: filters,
          succeess: function (odata, oResponse) {
            Pocount = odata.results.length;
            that.getButtonsAsperDept(Pocount, POCountMyPOList, UserId);
          },
          error: function (oError) {},
        });
        oModel.read("/MyPOListSet", {
          filters: filters,
          success: function (odata, oResponse) {
            POCountMyPOList = odata.results.length;
            that.getButtonsAsperDept(Pocount, POCountMyPOList, UserId);
          },
          error: function (oError) {},
        });
      },
      getButtonsAsperDept: function (Pocount, POCountMyPOList, UserId) {
        var oModel = this.getView().getModel();
        var filters = [];
        var oUserID = new sap.ui.model.Filter("UserID", "EQ", UserId);
        filters.push(oUserID);
        var oQueryButton = this.getView().byId("btnQuery");
        var oReviewbButton = this.getView().byId("btnReview");
        var oApproveButton = this.getView().byId("btnApprove");
        var oRejectButton = this.getView().byId("btnReject");
        var oApproveButtonRelease = this.getView().byId("btnApproveRelese");
        var oRevDept = this.getView().byId("idForRev1Dept");

        oModel.read("/ApproverDeptSet('" + UserId + "')", {
          success: function (odata, oResponse) {
            oRevDept.setText(odata.Dept);
            if (odata.Dept === "PUR" && Pocount <= 0) {
              oQueryButton.setEnabled(false);
              oApproveButton.setEnabled(false);
              oRejectButton.setEnabled(false);
              oReviewbButton.setVisible(false);
              oApproveButton.setVisible(true);
              oRejectButton.setVisible(true);
            } else if (odata.Dept === "PUR" && Pocount > 0) {
              oQueryButton.setEnabled(true);
              oApproveButton.setEnabled(true);
              oReviewbButton.setVisible(false);
              oApproveButton.setVisible(true);
              oRejectButton.setVisible(false);
            } else if (odata.Dept === "REV1" && Pocount > 0) {
              oQueryButton.setEnabled(true);
              oApproveButton.setVisible(false);
              oRejectButton.setVisible(true);
            } else if (odata.Dept === "PUR" && POCountMyPOList <= 0) {
              oQueryButton.setEnabled(false);
              oApproveButton.setEnabled(false);
              oRejectButton.setEnabled(false);
              oReviewbButton.setVisible(false);
              oApproveButton.setVisible(true);
              oRejectButton.setVisible(true);
            } else if (odata.Dept === "PUR" && POCountMyPOList > 0) {
              oReviewbButton.setVisible(false);
              oApproveButton.setVisible(true);
              oRejectButton.setVisible(false);
            } else if (odata.Dept === "REV1" && POCountMyPOList <= 0) {
              oReviewbButton.setVisible(true);
              oApproveButton.setVisible(false);
              oRejectButton.setEnabled(false);
              oQueryButton.setEnabled(false);
              oReviewbButton.setEnabled(false);
            } else if (odata.Dept === "REV2" && POCountMyPOList <= 0) {
              oReviewbButton.setVisible(true);
              oApproveButton.setVisible(false);
              oRejectButton.setVisible(true);
              oApproveButtonRelease.setVisible(true);

              oQueryButton.setEnabled(false);
              oReviewbButton.setEnabled(false);
              oApproveButtonRelease.setEnabled(false);
              oApproveButton.setEnabled(false);
              oRejectButton.setEnabled(false);
            } else if (odata.Dept === "REV1" && POCountMyPOList > 0) {
              oQueryButton.setEnabled(true);
              oApproveButton.setVisible(false);
              oRejectButton.setVisible(true);
            } else if (odata.Dept === "REV2" && POCountMyPOList > 0) {
              oReviewbButton.setVisible(true);
              oReviewbButton.setText("Forward");
              oApproveButton.setVisible(false);
              oRejectButton.setVisible(true);
              oApproveButtonRelease.setVisible(true);

              oQueryButton.setEnabled(true);
            }
          },
          error: function (oError) {},
        });
      },
      handleIconTabBarSelect: function () {
        var that = this;
        var iconTab = this.getView().byId("idIconTabBarNoIcons");
        if (iconTab.getSelectedKey() === "CoverNote") {
          that.OnPressCoverNote();
        } else if (iconTab.getSelectedKey() === "PurchaseOrder") {
          that.OnPressPOPdf();
        } else if (iconTab.getSelectedKey() === "Attachments") {
          that.OnPressAttachments();
        } else if (iconTab.getSelectedKey() === "QueryHistory") {
          that.OnPressQueryHistory();
        } else if (iconTab.getSelectedKey() === "Comments") {
          that.OnPressPOComment();
        } else if (iconTab.getSelectedKey() === "General") {
          that.OnPressGeneralTab();
        }
      },
      OnPressCoverNote: function () {
        var that = this;
        var oModel = new sap.ui.model.odata.ODataModel(
          "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
          true
        );
        var PONo = this.getView().byId("objcmp").getTitle();
        var oHtml = this.getView().byId("idFrame");
        if (this.Type === "CHANGE") {
          this.POType = "CH";
        } else {
          this.POType = "PO";
        }
        if (this.Type === "CHANGE") {
          var sRead = "/CoverNotePdfSet('" + PONo + "')/$value";
        } else {
          var sRead =
            "/SelectedPOContentSet(PoNo='" +
            PONo +
            "',CnPo='" +
            "CN" +
            "')/$value";
        }

        oModel.read(sRead, {
          success: function (odata, oResponse) {
            if (oResponse.body !== "") {
              var pdfURL = oResponse.requestUri;
              oHtml.setContent(
                "<iframe src=" +
                  pdfURL +
                  " width='100%' height='600px'></iframe>"
              );
              oHtml.setVisible(true);
            } else {
            }
          },
          error: function () {
            oHtml.setContent(null);
            MessageBox.error("Cover Note Read Failed");
          },
        });
      },
      OnPressPOPdf: function () {
        var oModel = new sap.ui.model.odata.ODataModel(
          "/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/",
          true
        );
        var PONo = this.getView().byId("objcmp").getTitle();
        var oHtml = this.getView().byId("idFramePO");
        if (this.Type === "CHANGE") {
          this.POType = "CH";
        } else {
          this.POType = "PO";
        }
        var sRead =
          "/POPdfSet(PO_NO='" + PONo + "',CN_PO='" + this.POType + "')/$value";
        oModel.read(sRead, {
          success: function (odata, oResponse) {
            if (oResponse.body !== "") {
              var pdfURL = oResponse.requestUri;
              oHtml.setContent(
                "<iframe src=" +
                  pdfURL +
                  " width='100%' height='600px'></iframe>"
              );
              oHtml.setVisible(true);
            } else {
              oHtml.setVisible(false);
            }
          },
          error: function (oResponse) {
            oHtml.setContent(null);
            MessageBox.error("Purchase Order/Amendment pdf Read Failed");
          },
        });
      },
       OnPressAttachments: function () {
        var oModel = this.getView().getModel();
        var PONo = this.getView().byId("objcmp").getTitle();
        var that = this;
        var Attachments = this.getView().byId("UploadCollection");
        var OUserId = this._UserID;
        var oText,
          oDocumentDate,
          day,
          month,
          year,
          Hours,
          Minutes,
          Seconds,
          final;
        var attachmentTitle = this.getView().byId("attachmentTitle");
        var oAlreadyApprovedText = this.getView().byId("idAlreadyApproved");
        var filters = [];

        var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
        filters.push(oPOH);
        Attachments.setBusy(true);

        if (PONO !== "") {
          oModel.read("/POAttachmentsSet", {
            filters: filters,
            succeess: function (odata, oResponse) {
              var oModelData = new sap.ui.model.json.JSONModel();
              oModelData.setData(odata);
              Attachments.setModel(oModelData);
              Attachments.setBusy(false);
              if (Attachments.getItems().length > 0) {
                for (var i = 0; i < Attachments.getItems().length; i++) {
                  if (
                    Attachments.getItems()[i].getAttributes()[0].getTitle() ===
                    OUserId
                  ) {
                    if (oAlreadyApprovedText.getText() === "") {
                      Attachments.getItems()[i].setEnableDelete(true);
                    } else if (oAlreadyApprovedText.getText() === "ALP") {
                      Attachments.getItems()[i].setEnableDelete(false);
                    }
                    
                  } else {
                    Attachments.getItems()[i].setEnableDelete(false);
                  }

                  
                  oText = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(0, 13);
                  year = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(13, 17);
                  month = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(17, 19);
                  day = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(19, 21);

                  Hours = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(21, 24);
                  Minutes = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(24, 26);
                  Seconds = Attachments.getItems()
                    [i].getStatuses()[0]
                    .getText()
                    .substring(26, 28);

                  final =
                    oText +
                    day +
                    "-" +
                    month +
                    "-" +
                    year +
                    " " +
                    Hours +
                    ":" +
                    Minutes +
                    ":" +
                    Seconds;
                  Attachments.getItems()[i].getStatuses()[0].setText(final);
                }
              }
              attachmentTitle.setText(that.getAttachmentTitleText());
            },
            error: function (oError) {
              MessageBox.error("Failed  to Load Attachments");
            },
          });
        } else {
          Attachments.setModel(null);
          Attachments.setBusy(false);
          Attachments.setUploadEnabled(false);

          attachmentTitle.setText("Uploaded(" + 0 + ") ");
        }
      },
      OnPressQueryHistory: function () {
        var oModel = this.getView().getModel();
        var PONo = this.getView().byId("objcmp").getTitle();
        var oTableHistory = this.getView().byId("tblQueryHistory");
        var filters = [];
        var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
        filters.push(oPOH);
        oModel.read("/POQueryHistorySet", {
          filters: filters,
          success: function (odata, oResponse) {
            var oModelData = new sap.ui.model.json.JSONModel();
            oModelData.setData(odata);
            oTableHistory.setModel(oModelData);
          },
          error: function (oError) {
            MessageBox.error("Failed to Load Data");
          },
        });
      },
      OnPressPOComment: function () {
        var oModel = this.getView().getModel();
        var PONo = this.getView().byId("objcmp").getTitle();
        var oTable = this.getView().byId("tblComments");
        var filters = [];
        var oPOH = new sap.ui.model.Filter("PO", "EQ", PONo);
        filters.push(oPOH);
        oModel.read("/POCommentsSet", {
          filters: filters,
          success: function (odata, oResponse) {
            var oModelData = new sap.ui.model.json.JSONModel();
            oModelData.setData(odata);
            oTable.setModel(oModelData);
          },
          error: function (oError) {
            MessageBox.error("Failed to Load Data");
          },
        });
      },
      OnPressGeneralTab: function () {
        var that = this;
        var oModel = this.getView().getModel();
        var PONo = this.getView().byId("objcmp").getTitle();
        var txtPO_No = this.getView().byId("PurOrdNo");
        var txtPODesc = this.getView().byId("PurOrdDesc");
        var txtPurOrdInt = this.getView().byId("PurOrdInt");
        var txtVendor = this.getView().byId("PurOrdVendor");
        var txtCnDate = this.getView().byId("idCnDate");
        var txtPlant = this.getView().byId("idPlant");
        var txtDocument_Type = this.getView().byId("PurDocType");
        var txtDocumentDate = this.getView().byId("PurOrdDt");
        var txtPurOrdSts = this.getView().byId("PurOrdSts");
        that.oListPO;
        that.ChangeDataGeneral = that.oListPO
          .getModel()
          .getData()
          .results.filter(function (a) {
            return PONo == a.PO_No;
          });
        var DocumentDate, day, month, year, final;
        if (that.ChangeDataGeneral[0].PoType === "CHANGE") {
          oModel.read(
            "/PurchaseOrderGeneralSet(PO_NO='" +
              PONo +
              "',UserID='" +
              this._UserID +
              "')",
            {
              success: function (odata, oResponse) {
                txtPO_No.setText(odata.PO_NO);
                txtPODesc.setText();
                txtPurOrdInt.setText(odata.PO_Initiator);
                txtVendor.setText(odata.Vendor);

                txtPlant.setText(odata.Plant);
                txtDocument_Type.setText();
                txtPurOrdSts.setText(odata.PO_Status);
                if (odata.CN_Date !== null) {
                  var CNDate = odata.CN_Date;
                  year = CNDate.substring(0, 4);
                  month = CNDate.substring(4, 6);
                  day = CNDate.substring(6, 8);
                  final = day + "-" + month + "-" + year;
                  txtCnDate.setText(final);
                } else {
                  txtCnDate.setText("");
                }
              },
              error: function (oError) {
                MessageBox.error("Failed to Load Data");
              },
            }
          );
        } else {
          oModel.read(
            "//PurchaseOrderGeneralSet(PO_NO='" +
              PONo +
              "',UserID='" +
              this._UserID +
              "')",
            {
              success: function (odata, oResponse) {
                txtPO_No.setText(odata.PO_NO);
                txtPODesc.setText(odata.PO_Description);
                txtPurOrdInt.setText(odata.PO_Initiator);
                txtVendor.setText(odata.Vendor);

                txtPlant.setText(odata.Plant);
                txtDocument_Type.setText(odata.Document_Type);
                txtPurOrdSts.setText(odata.PO_Status);
                if (odata.Document_Date !== null) {
                  DocumentDate = odata.Document_Date;
                  year = DocumentDate.substring(0, 4);
                  month = DocumentDate.substring(4, 6);
                  day = DocumentDate.substring(6, 8);
                  final = day + "-" + month + "-" + year;
                  txtDocumentDate.setText(final);
                } else {
                  txtDocumentDate.setText("");
                }

                if (odata.CN_Date !== null) {
                  var CNDate = odata.CN_Date;
                  year = CNDate.substring(0, 4);
                  month = CNDate.substring(4, 6);
                  day = CNDate.substring(6, 8);

                  final = day + "-" + month + "-" + year;
                  txtCnDate.setText(final);
                } else {
                  txtCnDate.setText("");
                }
              },
              error: function (oError) {
                MessageBox.error("Failed to Load Data");
              },
            }
          );
        }
      },
      OnSelectUser: function (oEvent) {
        var oModel = this.getView().getModel();
        var oModelDataUser = new sap.ui.model.json.JSONModel();
        var SearchText = oEvent.getSource().getValue();
        var cmbUser = sap.ui.getCore().byId("cmbUser");
        var filters = [];
        if (SearchText.lenght >= 3) {
          var oBname = new sap.ui.model.Filter("Bname", "EQ", SearchText);
          filters.push(oBname);
          oModel.read("/UserSearchSet", {
            filters: filters,
            success: function (odata, oResponse) {
              oModelDataUser.setData(odata);
              cmbUser.setModel(oModelDataUser);
              cmbUser.bindAggregation("suggestionItems", {
                path: "/results",
                template: new sap.ui.core.Item({
                  text: "{NameFirst}{NameLast}({Bname})",
                }),
              });
            },
            error: function (oError) {
              MessageBox.error("Error");
            },
          });
        }
      },
      OnSelectUserReviwe2: function (oEvent) {
        var that = this;
        var oModel = this.getView().getModel();
        var oModelDataUser = new sap.ui.model.json.JSONModel();
        var SearchText = oEvent.getSource().getValue();
        var cmbUserR = sap.ui.getCore().byId("cmbUserR");
        var otableUser = sap.ui.getCore().byId("tblUserReview2");
        var item = {};
        var values = "";
        var filters = [];
        if (SearchText.length >= 3) {
          var oBname = new sap.ui.model.Filter("Bname", "EQ", SearchText);
          filters.push(oBname);
          oModel.read("/UserSearchSet", {
            filters: filters,
            success: function (odata, oResponse) {
              oModelDataUser.setData(odata);
              cmbUserR.setModel(oModelDataUser);
              cmbUseR.bindAggregation("suggestionItems", {
                path: "/results",
                template: new sap.ui.core.Item({
                  text: "{NameFirst} {NameLast}({Bname})",
                }),
              });
            },
            error: function (oError) {
              MessageBox.error("Error");
            },
          });
        }
      },
      navtoMasterPage: function () {
        this.getRouter().navTo("POApprovalMaster", {
          TempStatus: "R",
        });
      },
      onValueHelpDialogClose: function (oEvent) {
        debugger;
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var sapEmail = oSelectedItem.mProperties.description;
        var sapName = oSelectedItem.mProperties.title;
        var sapuserId = oSelectedItem.mProperties.info;
        sap.ui.getCore().byId("inSapId").setValue(sapuserId);
        sap.ui.getCore().byId("cmbUser").setValue(sapEmail);
        sap.ui.getCore().byId("fetchUser").setValue(sapName);
      },
      fetchUserValueHelp: function (oEvent) {
        debugger;
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "zpoapproval.fragments.FetchUser",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pValueHelpDialog.then(function (oDialog) {
          oDialog.open(sInputValue);
        });
        var oModelFetchUser = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModelFetchUser, "fetchuser");
        var CurrUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          "/sap/opu/odata/sap/";
        var oExcelModel = new sap.ui.model.odata.ODataModel(CurrUrl, true);
        oExcelModel.read(
          "ZVECV_PURCHASE_ORDER_APPROVAL_SRV/FetchGenericUserIDSet?$filter=(USERNAME eq '" +
            sInputValue +
            "')",
          {
            success: function (odata, oResponse) {
              debugger;
              var oJSONModel = this.getView().getModel("fetchuser");
              oJSONModel.setData(oData);
            }.bind(this),
            error: function (oError) {
              console.error("Error while fetching data : " + error);
            },
          }
        );
      },
      OnGetSAPID: function () {},
      OnGetSAPIDForReview2: function () {
        var that = this;
        var oModel = this.getView().getModel();
        var EmailAdrress = sap.ui.getCore().byId("cmbUserR");
        var idSapIDReview2 = sap.ui.getCore().byId("idSapIDReview2");
        var idUserNAmeReview2 = sap.ui.getCore().byId("idSapUserNameReview2");
        oModel.read(
          "/FetchGenericUserIDSet(EMAIL_ID='" + EmailAdrress.getValue() + "')",
          {
            success: function (odata, oResponse) {
              idSapIDReview2.setText(odata.USERID);
              idUserNAmeReview2.setText(odata.USERNAME);
              that.GetUserSelectedItems();
            },
            error: function (oError) {},
          }
        );
      },
      GetUserSelectedItems: function () {
        var flagReview2 = false;
        var oModelDataUser = new sap.ui.model.json.JSONModel();
        var cmbUserR = sap.ui.getCore().byId("cmbUserR");
        var selectedItems = cmbUserR.getTokens();
        var otableUser = sap.ui.getCore().byId("tblUserReview2");
        var text = cmbUserR.getValue();
        var oToken = new Token({
          key: text,
          text: text,
        });
        cmbUserR.addToken(oToken);
        cmbUserR.setValue("");
        var item = [];
        var values = "";
        var valuesTemp = "";
        var idSapIDReview2 = sap.ui.getCore().byId("idSapIDReview2");
        var idUserNAmeReview2 = sap.ui.getCore().byId("idSapUserNameReview2");
        var selectedItems = cmbUserR.getTokens();
        values = {
          resultsN: [],
        };
        if (idSapIDReview2.getText() !== "") {
          if (otableUser.getItems().length === 0) {
            item = {
              UserID: idSapIDReview2.getText(),
              UserName: idUserNAmeReview2.getText(),
              EmailID: oToken.getText(),
            };

            if (valuesTemp.results === undefined) {
              valuesTemp = {
                results: [],
              };
              valuesTemp.results.push(item);
              oModelDataUser.setData(valuesTemp);
              otableUser.setModel(oModelDataUser);
            }
          } else {
            var oModelTableTemp = otableUser.getModel();
            if (oModelTableTemp.getData() !== null) {
              var valuesTemp = oModelTableTemp.getData();

              if (values.results === undefined) {
                values = {
                  results: [],
                };
              }
              var oItem = new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({
                    text: "{UserID}",
                  }),
                  new sap.m.Text({
                    text: "{UserName}",
                  }),
                  new sap.m.Text({
                    text: "{EmailID}",
                  }),
                ],
              });
              var itemN = [];

              for (var i = 0; i < valuesTemp.results.length; i++) {
                var oTemp = valuesTemp.results[i];
                itemN = {
                  UserID: idSapIDReview2.getText(),
                  UserName: idUserNAmeReview2.getText(),
                  EmailID: oToken.getText(),
                };
              }
              valuesTemp.results.push(itemN);
              oModelTableTemp.setData(valuesTemp);
              otableUser.setModel(oModelTableTemp);
            }
          }
        } else {
          MessageBox.error("SAP ID is invalid");
        }
      },
      RemoveToken: function (oEvent) {
        if (oEvent.getParameters().type === "removed") {
          var otableUser = sap.ui.getCore().byId("tblUserReview2");
          var oModelTableTemp = otableUser.getModel();
          var aContexts = oModelTableTemp.getData().results;
          for (var i = 0; i < aContexts.length; i++) {
            if (
              oEvent.getParameters().token.getKey() === aContexts[i].EmailID
            ) {
              aContexts.splice(i, 1);
              oModelTableTemp.refresh();
            }
          }
        }
      },
    });
  }
);
