// Allow for variables in the css 
var cssclass = document.querySelector(":root");
var mystyle = window.getComputedStyle(cssclass);

const filterGroup = document.getElementById('filter-group');

mapboxgl.accessToken = 'pk.eyJ1IjoicHRyc3prd2N6IiwiYSI6ImNscGkxOHVvbjA2eW8ybG80NDJ3ajBtMWwifQ.L2qe-aJO35nls3sfd0WKPA';
 
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // style: 'mapbox://styles/mapbox/streets-v12', // style URL
    style: 'mapbox://styles/ptrszkwcz/clqmt03br00g201qrfnt9442u',
    center: [2.8, 48.98661300179635], // starting position [lng, lat]
    zoom: 4 // starting zoom
});

// Dont forget this part for Hover!
let hoveredPolygonId = null;
let clickedPolygonId = null;

const cats = ['Biomass','Coal','Gas','Geothermal','Hydro','Nuclear','Oil','Solar','Tidal','Wind'];
const cat_labels = ['Biomass','Coal','Gas','Geothermal','Hydro','Nuclear','Oil','Solar','Wave & Tidal','Wind'];;
var filter_cats = [];

const anals = ["anal1", "anal2", "anal3"];

let 'A-PrimStyle' = "anal1"

map.on('load', () => {

    map.addSource('source-A', {
        'type': 'vector',
        'url': "mapbox://ptrszkwcz.clqq16a8mb7jd1up43l248y74-5f80h",
        'promoteId':'gppd_idnr' // Because mapbox fucks up when assigning IDs, make own IDs in QGIS and then set here!!!
    });


    map.addLayer({
        'id': 'A-PrimStyle',
        'type': 'circle',
        'source': 'source-A', 
        'source-layer':'Power_Europe_Select_good',
        'layout': {},
        'paint': {
            'circle-radius': 3,
            // 'circle-color': , 
            'circle-opacity': 0
            },
    });

    //COLOR BY ATTRIBUTE, POINT ---------------------------------------------------------------
    map.addLayer({
        'id': 'anal1',
        'type': 'circle',
        'source': 'source-A', 
        'source-layer':'Power_Europe_Select_good',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
                'circle-radius': [ 'interpolate', ['linear'], ['get', 'capacity_m'],
                    0, 1.5,
                    5000,25
                ],
            'circle-color': [ 'match', ['get','primary_fu'],
                'Biomass', '#9e5418',
                // 'Biomass', '#9514c4',
                'Coal', '#fc0303',
                'Gas', '#e01075',
                'Geothermal', '#8800ff',
                'Hydro', '#0398fc',
                'Nuclear', '#ff00f7',
                'Oil', '#eb7f7f',
                'Solar', '#e3bb0e',
                'Tidal', '#1859c9',
                'Wind', '#12c474',
                '#000000'
                ], 
                'circle-opacity': 0.5
            },
    });

    map.addLayer({
        'id': 'anal2',
        'type': 'circle',
        'source': 'source-A', 
        'source-layer':'Power_Europe_Select_good',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
                'circle-radius': [ 'interpolate', ['linear'], ['get', 'estimate_4'],
                    0, 1.5,
                    33000,25
                ],
            'circle-color': [ 'match', ['get','primary_fu'],
                'Biomass', '#9e5418',
                // 'Biomass', '#9514c4',
                'Coal', '#fc0303',
                'Gas', '#e01075',
                'Geothermal', '#8800ff',
                'Hydro', '#0398fc',
                'Nuclear', '#ff00f7',
                'Oil', '#eb7f7f',
                'Solar', '#e3bb0e',
                'Tidal', '#1859c9',
                'Wind', '#12c474',
                '#000000'
                ], 
                'circle-opacity': 0.5
            },
    });

    map.addLayer({
        'id': 'anal3',
        'type': 'circle',
        'source': 'source-A', 
        'source-layer':'Power_Europe_Select_good',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
                'circle-radius': [ 'interpolate', ['linear'], ['get', 'CapFac'],
                    0.5, 1.5,
                    1,25
                ],
            'circle-color': [ 'match', ['get','primary_fu'],
                'Biomass', '#9e5418',
                // 'Biomass', '#9514c4',
                'Coal', '#fc0303',
                'Gas', '#e01075',
                'Geothermal', '#8800ff',
                'Hydro', '#0398fc',
                'Nuclear', '#ff00f7',
                'Oil', '#eb7f7f',
                'Solar', '#e3bb0e',
                'Tidal', '#1859c9',
                'Wind', '#12c474',
                '#000000'
                ], 
                'circle-opacity': 0.5
            },
    });


    //HIHGLIGHT ON HOVER, POINT ---------------------------------------------------------------
    map.addLayer({
        'id': 'A-Hover-point',
        'type': 'circle',
        'source': 'source-A', // reference the data source
        'source-layer':'Power_Europe_Select_good',
        'layout': {},
        'paint': {
            'circle-color': "rgba(0,0,0,0)",
            'circle-stroke-color': mystyle.getPropertyValue("--highl_color"),
            'circle-stroke-width': [ 'case', 
                ['boolean', ['feature-state', 'hover'], false], 2, 0],
            'circle-radius': map.getPaintProperty('A-PrimStyle', 'circle-radius'),
            'circle-opacity': [ 'case', 
            ['boolean', ['feature-state', 'hover'], false], 1, 0]
        }
    }); 


    //HIHGLIGHT ON CLICK, POIMT ---------------------------------------------------------------
    map.addLayer({
        'id': 'A-Click-point',
        'type': 'circle',
        'source': 'source-A', // reference the data source
        'source-layer':'Power_Europe_Select_good',
        'layout': {},
        'paint': {
            'circle-color': "rgba(0,0,0,0)",
            'circle-stroke-color': mystyle.getPropertyValue("--highl_color"),
            'circle-stroke-width': [ 'case', 
                ['boolean', ['feature-state', 'highl_click'], false], 2, 0],
            'circle-radius': map.getPaintProperty('A-PrimStyle', 'circle-radius'),
            'circle-opacity': [ 'case', 
            ['boolean', ['feature-state', 'highl_click'], false], 1, 0]
        }
    }); 

    // POPUP ON CLICK ---------------------------------------------------------------
    const popup = new mapboxgl.Popup({
        closeButton: false,
    });

    // this function finds the center of a feature (to set popup) 
    function getFeatureCenter(feature) {
        let center = [];
        let latitude = 0;
        let longitude = 0;
        let height = 0;
        let coordinates = [];
        feature.geometry.coordinates.forEach(function (c) {
            let dupe = [];
            if (feature.geometry.type === "MultiPolygon")
                dupe.push(...c[0]); //deep clone to avoid modifying the original array
            else 
                dupe.push(...c); //deep clone to avoid modifying the original array
            dupe.splice(-1, 1); //features in mapbox repeat the first coordinates at the end. We remove it.
            coordinates = coordinates.concat(dupe);
        });
        if (feature.geometry.type === "Point") {
            center = coordinates[0];
        }
        else {
            coordinates.forEach(function (c) {
                latitude += c[0];
                longitude += c[1];
            });
            center = [latitude / coordinates.length, longitude / coordinates.length];
        }

        return center;
    }

    map.on('click', 'A-PrimStyle', (e) => {
        new mapboxgl.Popup()
        feature = e.features[0]
        // console.log(feature)
        // let acreage_long = feature.properties.ACRES
        // let acreage = acreage_long.toFixed(2)
        // popup.setLngLat(getFeatureCenter(feature))
        popup.setLngLat(e.lngLat)
        .setHTML(`<poptit>
                    Name: ${feature.properties.name}
                    </poptit>
                <div class = "pop-lines"></div>
                <div class = "pop-session">
                  <left>Primary Fuel</left><right>${feature.properties.primary_fu}</right>
                </div>
                <div class = "pop-session">
                    <left>Capacity</left><right>${feature.properties.capacity_m}</right>
                </div>
                <div class = "pop-session">
                    <left>Power Generation</left><right>${feature.properties.estimate_4}</right>
                </div>
                <div class = "pop-session">
                <left>Capacity Factor</left><right>${feature.properties.CapFac}</right>
            </div>
                  `)
        .addTo(map);
    });
    
    // HIGHLIGHT ON CLICK BOOLEAN ---------------------------------------------------------------
    map.on('click', 'A-PrimStyle', (e) => {
        if (e.features.length > 0) {
            if (clickedPolygonId !== null) {
                map.setFeatureState(
                    { source: 'source-A', sourceLayer: 'Power_Europe_Select_good', id: clickedPolygonId },
                    { click: false, highl_click: false }
                    );
            }

            clickedPolygonId = e.features[0].id;
            // hoveredPolygonId = e.features[0].properties.featID;

            map.setFeatureState(
                { source: 'source-A', sourceLayer: 'Power_Europe_Select_good', id: clickedPolygonId },
                { click: true, highl_click: true }
            );
        } 
    });
 
    // CLICK HIGHLIGHT CLOSE ON CLICK --------------------------------------------------------------- 
    map.on('click', (e) => {
        let counter = 0;
        const quer_features = map.queryRenderedFeatures(e.point);
        for (let i = 0; i < quer_features.length; i++) {
            if (quer_features[i].layer.id === 'A-PrimStyle'){
                counter += 1;
            }
        }
        if (counter == 0) {
            map.setFeatureState(
                    { source: 'source-A', sourceLayer: 'Power_Europe_Select_good', id: clickedPolygonId },
                    { highl_click: false }
                );
        }
    }); 


    // CHANGE MOUSE APPEARANCE --------------------------------------------------------------- 
    map.on('mouseenter', 'A-PrimStyle', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'A-PrimStyle', () => {
        map.getCanvas().style.cursor = 'move';
    });

  
    
    // HIGHLIGHT ON HOVER BOOLEAN --------------------------------------------------------------- 
    map.on('mousemove', 'A-PrimStyle', (e) => {
        if (e.features.length > 0) {

            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: 'source-A', sourceLayer: 'Power_Europe_Select_good', id: hoveredPolygonId },
                    { hover: false }
                    );
            }

            hoveredPolygonId = e.features[0].id;
            // hoveredPolygonId = e.features[0].properties.featID;

            map.setFeatureState(
                { source: 'source-A', sourceLayer: 'Power_Europe_Select_good', id: hoveredPolygonId },
                { hover: true }
            );
        }
    });
 
        
    // When the mouse leaves the state-fill layer, update the feature state of the
    map.on('mouseleave', 'A-PrimStyle', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'source-A', sourceLayer: 'Power_Europe_Select_good', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = null;
    });



    // CLICK TO FILTER (INTEGRATED INTO LEGEND) ---------------------------------------------------------------
    for (let i = 0; i < cats.length; i++) {

        const hash = "#"
        const ID_name = hash.concat(cats[i])


        const sessionDiv = document.querySelector(ID_name);

        // console.log(sessionDiv)

        sessionDiv.addEventListener('click', (e) => {
            // console.log(e.srcElement)
            filter_select = e.target.id

            if (filter_cats.includes(filter_select)){

                const del_index = filter_cats.indexOf(filter_select);
                const new_filter =filter_cats.splice(del_index, 1);
                sessionDiv.classList.add("checked");
                
            }
            else{
                const new_filter = filter_cats.push(filter_select)
                sessionDiv.checked = false;
                sessionDiv.classList.remove("checked");
            }

            if (filter_cats.length > 0){
                map.setFilter("anal1", ['match', ['get', 'primary_fu'], filter_cats,false,true]);
                map.setFilter("anal2", ['match', ['get', 'primary_fu'], filter_cats,false,true]);
                map.setFilter("anal3", ['match', ['get', 'primary_fu'], filter_cats,false,true]);
            }
            else{
                map.setFilter("anal1", null)
                map.setFilter("anal2", null)
                map.setFilter("anal3", null)
            }
        });
    }

    // CLICK TO CHANGE ANALYSIS ---------------------------------------------------------------



    for (let i = 0; i < anals.length; i++) {

        const hash = "#"
        const ID_name = hash.concat(anals[i])

        const sessionDiv = document.querySelector(ID_name);

        // sessionDiv.addEventListener('click', (e) => {
        //     // console.log(e.srcElement)
        //     filter_select = e.target.id

        //     if (filter_cats.includes(filter_select)){

        //         const del_index = filter_cats.indexOf(filter_select);
        //         const new_filter =filter_cats.splice(del_index, 1);
        //         sessionDiv.classList.add("checked");
                
        //     }
        //     else{
        //         const new_filter = filter_cats.push(filter_select)
        //         sessionDiv.checked = false;
        //         sessionDiv.classList.remove("checked");
        //     }

            // if (filter_cats.length > 0){
            //     map.setFilter('A-PrimStyle', ['match', ['get', 'primary_fu'], filter_cats,false,true]);
            // }
            // else{
            //     map.setFilter('A-PrimStyle', null)
            // }
        // });

        // sessionDiv.onclick = function (e){
         
        // }

        sessionDiv.onclick = function (e) {
            // const clickedLayer = this.textContent;
            const clickedLayer = sessionDiv.id

            e.preventDefault();
            e.stopPropagation();

            for (let i = 0; i < anals.length; i++){
                const hash = "#"
                const ID_name = hash.concat(anals[i])

                if (anals[i] != clickedLayer){
                    map.setLayoutProperty(anals[i], 'visibility', 'none');

                    let noclickDiv = document.querySelector(ID_name);
                    const noclickclass = noclickDiv.classList;
                    noclickclass.remove("checked")
                }
                else {
                    map.setLayoutProperty(anals[i], 'visibility', 'visible');

                    'A-PrimStyle' = anals[i]
       

                    const clickclass = sessionDiv.classList;
                    let clickDiv = document.querySelector(ID_name);
                    const noclickclass = clickDiv.classList;
                    clickclass.add("checked")
                }
            }
            // // map.triggerRepaint();
            // map.setPaintProperty('A-Hover-point', 'circle-radius',20);
            // map.setPaintProperty('A-Click-point', 'circle-radius',20);

        }

       
    }


});
