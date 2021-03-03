var Handlebars = require("../../lib/handlebars");module.exports = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\n                        	<tr>\n                            	<td align=\"center\" valign=\"top\">\n\n                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"templatePreheader\">\n                                        <tr>\n                                            <td valign=\"top\" align=\"center\" class=\"preheaderContent\" style=\"padding-top:10px; padding-right:20px; padding-bottom:10px; padding-left:20px;\" >\n						                                    "
    + container.escapeExpression(((helper = (helper = helpers.teaser || (depth0 != null ? depth0.teaser : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"teaser","hash":{},"data":data}) : helper)))
    + "\n                                            </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n	<head>\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n        <title>"
    + alias4(((helper = (helper = helpers.subjectSimple || (depth0 != null ? depth0.subjectSimple : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subjectSimple","hash":{},"data":data}) : helper)))
    + "</title>\n        <style type=\"text/css\">\n			#outlook a {\n			  padding: 0;\n			}\n			.ReadMsgBody {\n			  width: 100%;\n			}\n			.ExternalClass {\n			  width: 100%;\n			}\n			.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n			  line-height: 100%;\n			}\n			body, table, td, p, a, li, blockquote {\n			  -webkit-text-size-adjust: 100%;\n			  -ms-text-size-adjust: 100%;\n			}\n			table, td {\n			  mso-table-lspace: 0pt;\n			  mso-table-rspace: 0pt;\n			}\n			img {\n			  -ms-interpolation-mode: bicubic;\n			}\n			body {\n			  margin: 0;\n			  padding: 0;\n			}\n			img {\n			  border: 0;\n			  height: auto;\n			  line-height: 100%;\n			  outline: none;\n			  text-decoration: none;\n			  display: block;\n			}\n			table {\n			  border-collapse: collapse !important;\n			}\n			body, #bodyTable, #bodyCell {\n			  height: 100% !important;\n			  margin: 0;\n			  padding: 0;\n			  width: 100% !important;\n			}\n			#bodyCell {\n			  padding: 0px;\n			}\n			#templateContainer {\n			  width: 600px;\n				border:0px;\n			}\n\n\n			body, #bodyTable{\n				 background-color:#FFFFFF;\n			}\n\n			#bodyCell{\n				 border-top:0px;\n			}\n\n			h1 {\n			  color: #202020 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 26px;\n			  font-style: normal;\n			  font-weight: bold;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n			h2 {\n			  color: #404040 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 20px;\n			  font-style: normal;\n			  font-weight: bold;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n			h3 {\n			  color: #606060 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 16px;\n			  font-style: italic;\n			  font-weight: normal;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n			h4 {\n			  color: #808080 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 14px;\n			  font-style: italic;\n			  font-weight: normal;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n\n			#templatePreheader {\n			  background-color: #F4F4F4;\n			  border-bottom: 0px;\n			}\n			.preheaderContent {\n			  color: #808080;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 10px;\n			  line-height: 125%;\n			  text-align: left;\n			}\n			.preheaderContent a:link, .preheaderContent a:visited, .preheaderContent a .yshortcuts {\n			  color: #606060;\n			  font-weight: normal;\n			  text-decoration: underline;\n			}\n			#templateHeader {\n			  background-color: #FFFFFF;\n			  border-top: 1px solid #FFFFFF;\n			  border-bottom: 1px solid #FFFFFF;\n			}\n			.headerContent {\n			  background-color: #FFFFFF;\n			  color: #777;\n			  font-family: helvetica, arial, sans-serif;\n			  font-size: 20px;\n			  font-weight: bold;\n			  line-height: 100%;\n			  padding-top: 0;\n			  padding-right: 0;\n			  padding-bottom: 0;\n			  padding-left: 0;\n			  text-align: left;\n			  vertical-align: middle;\n			}\n\n			.headerContent a:link, .headerContent a:visited, .headerContent a .yshortcuts {\n				  color: #4fd1d9;\n				  font-weight: normal;\n				  text-decoration: underline;\n				}\n				#headerImage {\n				  height: auto;\n				  max-width: 600px;\n				}\n\n\n			#templateBody {\n			  background-color: #FFF;\n			}\n\n			.bodyContent {\n			  background-color: #fff;\n			  color: #202020;\n			  font-family: helvetica, arial, sans-serif;\n			  font-size: 16px;\n			  line-height: 150%;\n			  padding-top: 0px;\n			  padding-right: 0px;\n			  padding-bottom: 0px;\n			  padding-left: 0px;\n			  text-align: left;\n			}\n\n			.bodyContent a:link, .bodyContent a:visited, .bodyContent a .yshortcuts {\n			  color: #4fd1d9;\n			  font-weight: normal;\n			  text-decoration: underline;\n			}\n			.bodyContent img {\n			  display: inline;\n			  height: auto;\n			  max-width: 560px;\n			}\n			.bodyContent p {\n				padding-left: 30px;\n				padding-right: 30px;\n			}\n\n\n			#templateFooter {\n			  background-color: #ffffff;\n			  border-top: 0px solid #FFFFFF;\n				padding: 10px;\n			}\n\n			.footerContent {\n			  color: #777;\n			  font-family: helvetica, arial, sans-serif;\n			  font-size: 10px;\n			  line-height: 150%;\n			  padding-top: 20px;\n			  padding-right: 20px;\n			  padding-bottom: 20px;\n			  padding-left: 20px;\n			  text-align: center;\n			}\n\n			.footerContent a:link, .footerContent a:visited,  .footerContent a .yshortcuts, .footerContent a span {\n				 color:#202020;\n				 font-weight:normal;\n				 text-decoration:underline;\n			}\n\n\n      @media only screen and (max-width: 480px) {\n        body, table, td, p, a, li, blockquote {\n          -webkit-text-size-adjust: none !important;\n        }\n        body {\n          width: 100% !important;\n          min-width: 100% !important;\n        }\n        #bodyCell {\n          padding: 0px !important;\n        }\n        #templateContainer {\n          max-width: 600px !important;\n          width: 100% !important;\n        }\n        h1 {\n          font-size: 24px !important;\n          line-height: 100% !important;\n        }\n        h2 {\n          font-size: 20px !important;\n          line-height: 100% !important;\n        }\n        h3 {\n          font-size: 18px !important;\n          line-height: 100% !important;\n        }\n        h4 {\n          font-size: 16px !important;\n          line-height: 100% !important;\n        }\n        #templatePreheader {\n          display: none !important;\n        }\n        #headerImage {\n          height: auto !important;\n          max-width: 600px !important;\n          width: 100% !important;\n        }\n        .headerContent {\n          font-size: 20px !important;\n          line-height: 125% !important;\n        }\n        #bodyImage {\n          height: auto !important;\n          max-width: 560px !important;\n          width: 100% !important;\n        }\n        .bodyContent {\n          font-size: 18px !important;\n          line-height: 125% !important;\n        }\n        .footerContent {\n          font-size: 14px !important;\n          line-height: 115% !important;\n        }\n        .footerContent a {\n					color: #cccccc;\n          display: block !important;\n        }\n      }\n\n				</style>\n    </head>\n    <body leftmargin=\"0\" marginwidth=\"0\" topmargin=\"0\" marginheight=\"0\" offset=\"0\">\n    	<center>\n        	<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" id=\"bodyTable\">\n            	<tr>\n                	<td align=\"center\" valign=\"top\" id=\"bodyCell\">\n                    	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"templateContainer\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.teaser : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                            <tr>\n                              	<td align=\"center\" valign=\"top\">\n                                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"templateHeader\">\n  <tr>\n    <td valign=\"top\" class=\"headerContent\">\n      <a href=\""
    + alias4(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">\n        <img class=\"atri\" id=\"topImg"
    + alias4(((helper = (helper = helpers.ts || (depth0 != null ? depth0.ts : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ts","hash":{},"data":data}) : helper)))
    + "\" type=\"plaintext\" h=\"310\" textLeft=\"25\" smallText1=\"Do you know your Emoji Location?\" smallText2=\"\" bigStyle=\"#000000\" medText=\"You're seconds away\" bigText=\"Welcome!\" bigtextSize=\"92\" />\n      </a>\n    </td>\n  </tr>\n  <tr>\n    <td valign=\"top\" class=\"headerContent\">\n      <a href=\""
    + alias4(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">\n        <img class=\"atri\" id=\"ctaImg"
    + alias4(((helper = (helper = helpers.ts || (depth0 != null ? depth0.ts : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ts","hash":{},"data":data}) : helper)))
    + "\" type=\"ctarooster\" button=\"CLICK TO VERIFY &amp; FIND YOUR EMOJILOCI\" />\n      </a>\n    </td>\n  </tr>\n  <tr>\n    <td valign=\"top\" class=\"headerContent\">\n      <a href=\""
    + alias4(((helper = (helper = helpers.ctaUrl || (depth0 != null ? depth0.ctaUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data}) : helper)))
    + "\">\n        <img src=\"https://cdn.hipr.space/email/logo-email-footer.png\" />\n      </a>\n    </td>\n  </tr>\n</table>\n\n                                </td>\n                            </tr>\n                        	<tr>\n                            	<td align=\"center\" valign=\"top\">\n                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"templateFooter\">\n                                        <tr>\n                                            <td valign=\"top\" class=\"footerContent\" style=\"padding-top:16px;\" >\n                                            </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n                        </table>\n                    </td>\n                </tr>\n            </table>\n        </center>\n    </body>\n</html>\n";
},"useData":true});