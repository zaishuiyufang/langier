"use strict";require(["config"],function(){require(["jquery","header","lunbo"],function(e,t,n){new Promise(function(n,o){e("header").load("/html/component/header.html",function(){t.init(),n()}),e("footer").load("/html/component/footer.html"),e(".banner").load("/html/component/lunbo.html",function(){e(".banner").lunbo({goPrev:"goPrev",goNext:"goNext"})})}).then(function(){}).then(function(){})})});