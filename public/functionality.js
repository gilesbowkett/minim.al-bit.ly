$(document).ready(function(){
  $("button").click(function(event){
    window.location.href = "/" + $("input").val();
  });
});
