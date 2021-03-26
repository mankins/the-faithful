var Handlebars = require("../../handlebars");module.exports = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n                        	<tr>\n                            	<td align=\"center\" valign=\"top\">\n\n                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"templatePreheader\">\n                                        <tr>\n                                            <td valign=\"top\" align=\"center\" class=\"preheaderContent\" style=\"padding-top:10px; padding-right:20px; padding-bottom:10px; padding-left:20px;\" >\n						                                    "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"teaser") || (depth0 != null ? lookupProperty(depth0,"teaser") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"teaser","hash":{},"data":data,"loc":{"start":{"line":321,"column":42},"end":{"line":321,"column":52}}}) : helper)))
    + "\n                                            </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <tr>\n        <td valign=\"top\" class=\"headerContent\">\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"ctaUrl") || (depth0 != null ? lookupProperty(depth0,"ctaUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data,"loc":{"start":{"line":412,"column":21},"end":{"line":412,"column":31}}}) : helper)))
    + "\">\n                <img class=\"atri\" id=\"topImg\" type=\"plaintext\" h=\"300\" textLeft=\"25\" smallStyle=\"#111111\"\n                    medtextsize=\"39\" smallText1=\"Could you take our short survey\"\n                    smallText2=\" to figure out what's next?\" bigStyle=\"#000000\" medStyle=\"#333333\"\n                    medText=\"March 19-21 at 2pm & 7pm EDT\" bigText=\"Thank you for joining us!\" />\n            </a>\n        </td>\n    </tr>\n\n    <tr>\n        <td valign=\"top\" class=\"headerContent\">\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"ctaUrl") || (depth0 != null ? lookupProperty(depth0,"ctaUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data,"loc":{"start":{"line":423,"column":21},"end":{"line":423,"column":31}}}) : helper)))
    + "\">\n                <img class=\"atri\" id=\"ccc\" type=\"faithful\" logo=\"lg\" />\n            </a>\n        </td>\n    </tr>\n    <tr>\n        <td valign=\"top\" class=\"headerContent\">\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"ctaUrl") || (depth0 != null ? lookupProperty(depth0,"ctaUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data,"loc":{"start":{"line":430,"column":21},"end":{"line":430,"column":31}}}) : helper)))
    + "\">\n                <img class=\"atri\" id=\"topImg3\" type=\"bodytext\" h=\"150\" minfont=\"10\" maxfont=\"24\" fg=\"#000000\" y=\"1\"\n                    ws=\"75\"\n                    text=\"From writer/director Annie Berman comes a stirring exploration into the orbits of three of the biggest cultural icons of our time: Princess Diana, Elvis Presley, and Pope John Paul II\" />\n            </a>\n        </td>\n    </tr>\n    <tr>\n        <td valign=\"top\" class=\"headerContent\">\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"ctaUrl") || (depth0 != null ? lookupProperty(depth0,"ctaUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data,"loc":{"start":{"line":439,"column":21},"end":{"line":439,"column":31}}}) : helper)))
    + "\">\n                <img class=\"atri\" id=\"lrn-more\" type=\"cta\" h=\"120\" button=\"LEARN MORE\" />\n            </a>\n        </td>\n    </tr>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n	<head>\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n        <title>"
    + alias4(((helper = (helper = lookupProperty(helpers,"subjectSimple") || (depth0 != null ? lookupProperty(depth0,"subjectSimple") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subjectSimple","hash":{},"data":data,"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":32}}}) : helper)))
    + "</title>\n        <style type=\"text/css\">\n			#outlook a {\n			  padding: 0;\n			}\n			.ReadMsgBody {\n			  width: 100%;\n			}\n			.ExternalClass {\n			  width: 100%;\n			}\n			.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n			  line-height: 100%;\n			}\n			body, table, td, p, a, li, blockquote {\n			  -webkit-text-size-adjust: 100%;\n			  -ms-text-size-adjust: 100%;\n			}\n			table, td {\n			  mso-table-lspace: 0pt;\n			  mso-table-rspace: 0pt;\n			}\n			img {\n			  -ms-interpolation-mode: bicubic;\n			}\n			body {\n			  margin: 0;\n			  padding: 0;\n			}\n			img {\n			  border: 0;\n			  height: auto;\n			  line-height: 100%;\n			  outline: none;\n			  text-decoration: none;\n			  display: block;\n			}\n			table {\n			  border-collapse: collapse !important;\n			}\n			body, #bodyTable, #bodyCell {\n			  height: 100% !important;\n			  margin: 0;\n			  padding: 0;\n			  width: 100% !important;\n			}\n			#bodyCell {\n			  padding: 0px;\n			}\n			#templateContainer {\n			  width: 600px;\n				border:0px;\n			}\n\n\n			body, #bodyTable{\n				 background-color:#FFFFFF;\n			}\n\n			#bodyCell{\n				 border-top:0px;\n			}\n\n			h1 {\n			  color: #202020 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 26px;\n			  font-style: normal;\n			  font-weight: bold;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n			h2 {\n			  color: #404040 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 20px;\n			  font-style: normal;\n			  font-weight: bold;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n			h3 {\n			  color: #606060 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 16px;\n			  font-style: italic;\n			  font-weight: normal;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n			h4 {\n			  color: #808080 !important;\n			  display: block;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 14px;\n			  font-style: italic;\n			  font-weight: normal;\n			  line-height: 100%;\n			  letter-spacing: normal;\n			  margin-top: 0;\n			  margin-right: 0;\n			  margin-bottom: 10px;\n			  margin-left: 0;\n			  text-align: left;\n			}\n\n			#templatePreheader {\n			  background-color: #F4F4F4;\n			  border-bottom: 0px;\n			}\n			.preheaderContent {\n			  color: #808080;\n			  font-family: helvetica, arial, sans-serif\n			  font-size: 10px;\n			  line-height: 125%;\n			  text-align: left;\n			}\n			.preheaderContent a:link, .preheaderContent a:visited, .preheaderContent a .yshortcuts {\n			  color: #606060;\n			  font-weight: normal;\n			  text-decoration: underline;\n			}\n			#templateHeader {\n			  background-color: #FFFFFF;\n			  border-top: 1px solid #FFFFFF;\n			  border-bottom: 1px solid #FFFFFF;\n			}\n			.headerContent {\n			  background-color: #FFFFFF;\n			  color: #777;\n			  font-family: helvetica, arial, sans-serif;\n			  font-size: 20px;\n			  font-weight: bold;\n			  line-height: 100%;\n			  padding-top: 0;\n			  padding-right: 0;\n			  padding-bottom: 0;\n			  padding-left: 0;\n			  text-align: left;\n			  vertical-align: middle;\n			}\n\n			.headerContent a:link, .headerContent a:visited, .headerContent a .yshortcuts {\n				  color: #4fd1d9;\n				  font-weight: normal;\n				  text-decoration: underline;\n				}\n				#headerImage {\n				  height: auto;\n				  max-width: 600px;\n				}\n\n\n			#templateBody {\n			  background-color: #FFF;\n			}\n\n			.bodyContent {\n			  background-color: #fff;\n			  color: #202020;\n			  font-family: helvetica, arial, sans-serif;\n			  font-size: 16px;\n			  line-height: 150%;\n			  padding-top: 0px;\n			  padding-right: 0px;\n			  padding-bottom: 0px;\n			  padding-left: 0px;\n			  text-align: left;\n			}\n\n			.bodyContent a:link, .bodyContent a:visited, .bodyContent a .yshortcuts {\n			  color: #4fd1d9;\n			  font-weight: normal;\n			  text-decoration: underline;\n			}\n			.bodyContent img {\n			  display: inline;\n			  height: auto;\n			  max-width: 560px;\n			}\n			.bodyContent p {\n				padding-left: 30px;\n				padding-right: 30px;\n			}\n\n\n			#templateFooter {\n			  background-color: #ffffff;\n			  border-top: 0px solid #FFFFFF;\n				padding: 10px;\n			}\n\n			.footerContent {\n			  color: #777;\n			  font-family: helvetica, arial, sans-serif;\n			  font-size: 10px;\n			  line-height: 150%;\n			  padding-top: 20px;\n			  padding-right: 20px;\n			  padding-bottom: 20px;\n			  padding-left: 20px;\n			  text-align: center;\n			}\n\n			.footerContent a:link, .footerContent a:visited,  .footerContent a .yshortcuts, .footerContent a span {\n				 color:#202020;\n				 font-weight:normal;\n				 text-decoration:underline;\n			}\n\n\n      @media only screen and (max-width: 480px) {\n        body, table, td, p, a, li, blockquote {\n          -webkit-text-size-adjust: none !important;\n        }\n        body {\n          width: 100% !important;\n          min-width: 100% !important;\n        }\n        #bodyCell {\n          padding: 0px !important;\n        }\n        #templateContainer {\n          max-width: 600px !important;\n          width: 100% !important;\n        }\n        h1 {\n          font-size: 24px !important;\n          line-height: 100% !important;\n        }\n        h2 {\n          font-size: 20px !important;\n          line-height: 100% !important;\n        }\n        h3 {\n          font-size: 18px !important;\n          line-height: 100% !important;\n        }\n        h4 {\n          font-size: 16px !important;\n          line-height: 100% !important;\n        }\n        #templatePreheader {\n          display: none !important;\n        }\n        #headerImage {\n          height: auto !important;\n          max-width: 600px !important;\n          width: 100% !important;\n        }\n        .headerContent {\n          font-size: 20px !important;\n          line-height: 125% !important;\n        }\n        #bodyImage {\n          height: auto !important;\n          max-width: 560px !important;\n          width: 100% !important;\n        }\n        .bodyContent {\n          font-size: 18px !important;\n          line-height: 125% !important;\n        }\n        .footerContent {\n          font-size: 14px !important;\n          line-height: 115% !important;\n        }\n        .footerContent a {\n					color: #cccccc;\n          display: block !important;\n        }\n      }\n\n				</style>\n    </head>\n    <body leftmargin=\"0\" marginwidth=\"0\" topmargin=\"0\" marginheight=\"0\" offset=\"0\">\n    	<center>\n        	<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" id=\"bodyTable\">\n            	<tr>\n                	<td align=\"center\" valign=\"top\" id=\"bodyCell\">\n                    	<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"templateContainer\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"teaser") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":311,"column":12},"end":{"line":328,"column":20}}})) != null ? stack1 : "")
    + "\n                            <tr>\n                              	<td align=\"center\" valign=\"top\">\n                                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"templateHeader\">\n    <tr>\n        <td valign=\"top\" class=\"headerContent\" style=\"background-color:#fedfd7;\">\n            <p style=\"padding: 15px\">Thank you for joining us for a momentous opening weekend! Our heads are still\n                spinning from the\n                tremendous turnout (over 500 viewers!), and from the outpouring of love and support, still circling our\n                brains.\n            </p>\n        </td>\n    </tr>\n    <tr>\n        <td valign=\"top\" class=\"headerContent\" style=\"background-color:#fedfd7; text-align:center;\">\n            <blockquote>\n \"Exquisite storytelling\" \n            </blockquote>\n            <blockquote>\n\"A magnum opus\"\n            </blockquote>\n            <blockquote>\n“Mesmerizing\"\n            </blockquote>\n            <blockquote>\n\"A work of art!\"\n            </blockquote>\n        </td>\n    </tr>\n    <tr>\n        <td valign=\"top\" class=\"headerContent\" style=\"background-color:#fedfd7;\">\n            <p style=\"padding: 15px\">Could you do us a quick favor? We created a short survey to help us figure out\n                our next steps.\n            </p>\n        </td>\n    </tr>\n    <tr>\n        <td valign=\"top\" class=\"headerContent\">\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"ctaUrl") || (depth0 != null ? lookupProperty(depth0,"ctaUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data,"loc":{"start":{"line":368,"column":21},"end":{"line":368,"column":31}}}) : helper)))
    + "\">\n                <img class=\"atri\" id=\"ctaImg\" type=\"cta\" h=\"90\" button=\"TAKE OUR SHORT SURVEY\" />\n            </a>\n        </td>\n    </tr>\n\n    <tr>\n        <td valign=\"top\" class=\"headerContent\" style=\"background-color:#fedfd7;\">\n            <p style=\"padding: 15px\">\n                Did you miss it? You can now <a style=\"font-weight: bold; color: #777777\" href=\"https://www.the-faithful.com/\">stream The\n                    Faithful from our website</a> as well as on <a style=\"font-weight: bold; color: #777777\"\n                    href=\"https://cinnamon.video/watch?v=542589753027987412&utm_source=thefaithful\">Cinnamon</a>.\n                Cinnamon is a beautiful new streaming platform that directly supports creators without resorting to\n                advertising.\n            </p>\n        </td>\n    </tr>\n\n    <tr>\n        <td valign=\"top\" class=\"headerContent\" style=\"background-color:#fedfd7;\">\n            <p style=\"padding-left: 15px\">\n                Much gratitude,\n       </p>\n            <p style=\"padding-left: 15px\">\nAnnie Berman & Team\n       </p>\n        </td>\n    </tr>\n\n\n\n    <tr>\n        <td valign=\"top\" class=\"headerContent\">\n            <a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"ctaUrl") || (depth0 != null ? lookupProperty(depth0,"ctaUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctaUrl","hash":{},"data":data,"loc":{"start":{"line":401,"column":21},"end":{"line":401,"column":31}}}) : helper)))
    + "\">\n                <img class=\"atri\" id=\"bottom-img\" type=\"faithful\" logo=\"friend-25-footer\" h=\"710\"\n                    logofile=\"friend-25-footer.png\" />\n            </a>\n        </td>\n    </tr>\n\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"disabledok") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":409,"column":4},"end":{"line":444,"column":11}}})) != null ? stack1 : "")
    + "\n</table>\n                                </td>\n                            </tr>\n                        	<tr>\n                            	<td align=\"center\" valign=\"top\">\n                                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" id=\"templateFooter\">\n                                        <tr>\n                                            <td valign=\"top\" class=\"footerContent\" style=\"padding-top:16px;\" >\n<a href=\"%unsubscribe_url%\">Unsubscribe</a> | <a href=\"https://www.the-faithful.com\">The Faithful: The King, The Pope, The Princess</a> | <a href=\"https://www.the-faithful.com\">The Faithful, LLC</a>\n                                            </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n                        </table>\n                    </td>\n                </tr>\n            </table>\n        </center>\n    </body>\n</html>\n";
},"useData":true});