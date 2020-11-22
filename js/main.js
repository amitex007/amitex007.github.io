import {subdomains} from './config.js'
let actionListeners = function(){
    
    subdomains.forEach(function(domain){        
        var element = document.getElementById(`${domain.dmn}-btn`);
        if(element){
            element.onclick = function(){
                window.open(
                    domain.url,
                    '_blank' 
                );
                }
        }
    }); 
}

actionListeners();
// window.onload = postLoad;
window.addEventListener('load', ()=>{
    let preloader = document.getElementById('preloader');
    preloader.classList.add('post-finish');
})

$(document).ready(function(){
    $("#successRequest").hide();
    $("#failureRequest").hide();
    $("#cvloader").hide();

    $("#resumeForm").submit(function(){
        console.log("Form post received")
        $("#resumeForm").hide();
        $("#cvMessage").hide();
        $("#cvloader").show();
        $.post($(this).attr('action'), $(this).serialize(), function(response){
            // do something here on success
            console.log(response);

            $("#cvloader").hide();

            if(response.result=="success") {
                $("#successRequest").show();
            } else {
                $("#failureRequest").hide();
            }
      },'json');
      return false;
    })
});
