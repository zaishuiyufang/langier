"use strict";require(["config"],function(){require(["jquery","header","lunbo"],function(o,e,n){o("header").load("/html/component/header.html",function(){e.init(),resolve()}),o("footer").load("/html/component/footer.html"),o(".banner").load("/html/component/lunbo.html",function(){o(".banner").lunbo({goPrev:"goPrev",goNext:"goNext"})})})});