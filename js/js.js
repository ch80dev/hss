(function(){
    let started = false;
    function start(){
        if(started) return;
        started = true;
        document.title = 'HSS v0.05';
        juego = new Game();
        ui = new UI();
        ui.refresh.go();
        Config.audit();
        HumanConfig.audit();
        ItemConfig.audit();
        MapConfig.audit();
        ShopConfig.audit();
        DefaultConfig.audit();
        if(window.HSS_AI_V005 && window.HSS_AI_V005.fitMap) window.HSS_AI_V005.fitMap();
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'css/ai-v005.css?v=005';
    document.head.appendChild(css);
    const patch = document.createElement('script');
    patch.src = 'js/ai-v005.js?v=005';
    patch.onload = start;
    patch.onerror = function(){ console.error('HSS v0.05 visual patch failed to load'); start(); };
    document.head.appendChild(patch);
})();
function rand_num(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
