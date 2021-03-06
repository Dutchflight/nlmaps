import { getProvider, geolocator_icon } from '../../lib/index.js';


if (typeof L !== 'undefined' && typeof L === 'object'){
L.NlmapsBgLayer = L.TileLayer.extend({
  initialize: function(name='standaard', options) {
    const provider = getProvider(name);
    const opts = L.Util.extend({}, options, {
      'minZoom':      provider.minZoom,
      'maxZoom':      provider.maxZoom,
      'scheme':       'xyz',
      'attribution':  provider.attribution,
      sa_id:          name
    });
    L.TileLayer.prototype.initialize.call(this, provider.url, opts);
  }
});
/*
 *      * Factory function for consistency with Leaflet conventions
 *           */
L.nlmapsBgLayer = function (options, source) {
  return new L.NlmapsBgLayer(options, source);
};

L.Control.GeoLocatorControl = L.Control.extend({
  options: {
    position: 'topright'
  },
  initialize: function (options) {
            // set default options if nothing is set (merge one step deep)
            for (var i in options) {
                if (typeof this.options[i] === 'object') {
                    L.extend(this.options[i], options[i]);
                } else {
                    this.options[i] = options[i];
                }
            }
  },

  onAdd: function(map){
    let div = L.DomUtil.create('div');
    div.id = 'nlmaps-geolocator-control';
    div.style.backgroundColor = '#fff';
    div.style.cursor = 'pointer';
    div.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.65)';
    div.style.height = '26px';
    div.style.width = '26px';
    div.style.borderRadius = '26px 26px';
    div.innerHTML = geolocator_icon;
    if (this.options.geolocator.isStarted()){
      L.DomUtil.addClass(div, 'started')
    }
    function moveMap(position){
      map.panTo([position.coords.latitude,position.coords.longitude])
    }
    L.DomEvent.on(div, 'click', function(e){
      this.options.geolocator.start();
      L.DomUtil.addClass(div, 'started');
    }, this);
    this.options.geolocator.on('position', function(d) {
      L.DomUtil.removeClass(div, 'started');
      L.DomUtil.addClass(div, 'has-position');
      moveMap(d);
    })
    return div;
  },
  onRemove: function(map){}
})

L.geoLocatorControl = function(geolocator){
  return new L.Control.GeoLocatorControl({geolocator:geolocator});
}


}

function bgLayer(name) {
  if (typeof L !== 'undefined' && typeof L === 'object') {
    return L.nlmapsBgLayer(name)
  }
}

function geoLocatorControl(geolocator) {
  if (typeof L !== 'undefined' && typeof L === 'object') {
    return L.geoLocatorControl(geolocator)
  }

  
}

export { bgLayer, geoLocatorControl };
