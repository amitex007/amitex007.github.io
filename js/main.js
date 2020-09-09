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

let postLoad = function(){
    let preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
}

actionListeners();
window.onload = postLoad;
