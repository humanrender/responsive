$(document).ready(function(){
  
  var samp = $(".console samp");
  
  function log(from,to,width,action,key){
    samp.append("<span class='action'>"
      +action+":</span><span class='range'> "
      +from+"..."+to
      +" </span><span class='label'>("+key+")</span><br/>");
  }
  
function mobile_enter(){
  $(".gist_container, .console").css({
    width:"100%", float:"none",
    "margin-left":0, "margin-right":0
  })
}

$.responsive()
  .from(0,480,"mobile")
    .enter(log)
    .enter(mobile_enter)
    .enter(function(){
      $("h1").css("font-size","39px")
    })
  .from(480,768,"tablet")
    .enter(log)
    .enter(mobile_enter)
  .from(768,992,"default")
    .enter(log)
    .exit(log)
    .enter(function(){
      $(".gist_container, .console").css({
        width:"48%", float:"left"
      });
      $(".gist_container").css({
        "margin-left":"2%"
      });
      $(".console").css({
        "margin-right":"2%"
      });
      $("h1").css("font-size","69px")
    })
  .start();
})