(function(){
  'use strict';
  const originalDisplay = UIMap.prototype.display;

  function exitTypeFromCell(mapAt){
    return mapAt === 2 ? 'sewer' : mapAt === 3 ? 'alley' : mapAt === 4 ? 'street' : null;
  }

  function fitMap(){
    if(window.innerWidth < 700){
      document.documentElement.style.setProperty('--ai-tile','22px');
      document.body.classList.remove('ai-fit-desktop');
      return;
    }
    document.body.classList.add('ai-fit-desktop');
    const top = document.getElementById('top');
    const bottom = document.getElementById('bottom');
    const map = document.getElementById('map');
    const topH = top ? top.offsetHeight : 105;
    const bottomH = bottom ? bottom.offsetHeight : 45;
    const extra = 78;
    const availH = Math.max(320, window.innerHeight - topH - bottomH - extra);
    const availW = Math.max(480, window.innerWidth - 70);
    const byH = Math.floor(availH / MapConfig.max_y);
    const byW = Math.floor(availW / MapConfig.max_x);
    const size = Math.max(16, Math.min(32, byH, byW));
    document.documentElement.style.setProperty('--ai-tile', size + 'px');
    if(map) map.style.setProperty('--ai-map-height', (size * MapConfig.max_y) + 'px');
  }

  function decorateMap(){
    const type = juego.player.state.location.type;
    const id = juego.player.state.location.id;
    const grid = document.getElementById('map_grid');
    if(!grid) return;
    grid.dataset.locationType = type;
    const canUnlock = !!(juego.player.inventory && juego.player.inventory.get && juego.player.inventory.get.has_a_tool && juego.player.inventory.get.has_a_tool());

    for(let y=0; y<MapConfig.max_y; y++){
      for(let x=0; x<MapConfig.max_x; x++){
        const el = document.getElementById(`cell-${x}-${y}`);
        if(!el) continue;
        const mapAt = juego.map.get.at(x,y);
        const at = `${type}-${id}-${x}-${y}`;
        const loot = juego.map.loot[at];
        const isPlayer = juego.player.movement.at(x,y);

        if(isPlayer){
          el.classList.add('ai-player-tile');
          el.title = 'YOU';
        }

        const exitType = exitTypeFromCell(mapAt);
        if(exitType){
          const used = juego.map.get.inspector.exit.have_they_used_this(type,id,x,y);
          el.classList.add('ai-exit', `ai-exit-${exitType}`, used ? 'ai-exit-visited' : 'ai-exit-new');
          el.title = used ? `Visited ${exitType} exit` : `Unexplored ${exitType} exit`;
        }

        if(MapConfig.cell_class[mapAt] === 'trash' && loot){
          const kind = loot.type || 'trash';
          el.classList.add('ai-container', `ai-${kind}`);
          if(loot.searched){
            el.classList.add('ai-searched');
            el.title = `Searched ${kind}`;
          }else if(loot.locked){
            el.classList.add('ai-locked');
            if(canUnlock) el.classList.add('ai-tool-ready');
            el.title = canUnlock ? `Locked ${kind} — tool ready` : `Locked ${kind} — equip any tool or attack it`;
          }else{
            el.classList.add('ai-searchable');
            el.title = `${kind} — search this`;
          }
        }

        if(mapAt === 1 && loot && loot.stuff && loot.stuff.length){
          el.classList.add('ai-ground-loot');
          el.title = loot.stuff.map(i => i.name).join(', ');
        }

        if(MapConfig.cell_class[mapAt] === 'shop'){
          const shop = juego.map.get.inspector.entity.fetch_shop(type,id,x,y);
          if(shop && shop.type){
            el.classList.add('ai-shop', `ai-shop-${shop.type}`);
            el.dataset.shop = shop.type;
            el.title = (typeof ShopConfig !== 'undefined' && ShopConfig.names && ShopConfig.names[shop.type]) || shop.type;
          }
        }

        if(el.classList.contains('homeless') || el.classList.contains('homeless_met')) el.classList.add('ai-homeless');
        if(el.classList.contains('citizen') || el.classList.contains('citizen_met')) el.classList.add('ai-citizen');
        if(el.classList.contains('cop') || el.classList.contains('cop_red')) el.classList.add('ai-cop');
        if(el.classList.contains('rat')) el.classList.add('ai-rat');
      }
    }
    fitMap();
  }

  UIMap.prototype.display = function(){
    originalDisplay.call(this);
    decorateMap();
  };

  window.addEventListener('resize', fitMap, {passive:true});
  window.HSS_AI_V005 = {fitMap, decorateMap, version:'0.05'};
})();