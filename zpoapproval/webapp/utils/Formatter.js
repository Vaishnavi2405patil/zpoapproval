sap.ui.define([], function()
 {
	"use strict";
  var Formatter={
    status:function(sStatus)
    {
    if(sStatus === "PO"){
        return "PO no";

    }else if(sStatus === "SA"){
return "SA no";
     }else if(sStatus === "CHANGE"){
           return "Amd CN no";
    }
  }
}
	return  Formatter;
});