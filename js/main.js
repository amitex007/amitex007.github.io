import {subdomains} from './config.js'
let actionListeners = function(){
    
    subdomains.forEach(function(domain){        
        var element = document.getElementById(`${domain.dmn}-btn`);
        element.onclick = function(){
        window.open(
            domain.url,
            '_blank' 
        );
        }
    }); 
}

actionListeners();
// window.onload = postLoad;
window.addEventListener('load', ()=>{
    let preloader = document.getElementById('preloader');
    preloader.classList.add('post-finish');
})
