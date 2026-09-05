/* ============================================================
   NRIP report v2 — interactive behavior (story edition)
   ============================================================ */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    setupNav();
    setupReadbar();
    setupReveal();
    setupCounters();
    setupLightbox();
    setupMapExplorer();
    setupUpazilaExplorer();
    setupScenarioExplorer();
    setupToTop();
    setupParallaxHero();
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#7c6a56';
    Chart.defaults.font.size = 12;
    renderStatCharts();
    renderCroppingCharts();
    renderIrrigationCharts();
    renderSoilPropChart();
    renderClimateCharts();
  }

  /* ---------------- Nav ---------------- */
  function setupNav(){
    const toggle = document.querySelector('.nav-toggle');
    const navlinks = document.querySelector('.navlinks');
    const navAnchor = document.createComment('navlinks-anchor');
    if(navlinks && navlinks.parentNode) navlinks.parentNode.insertBefore(navAnchor, navlinks);

    if(toggle && navlinks){
      toggle.addEventListener('click', ()=>{
        const opening = !document.body.classList.contains('nav-open');
        document.body.classList.toggle('nav-open', opening);
        if(opening){ document.body.appendChild(navlinks); }
        else if(navAnchor.parentNode){ navAnchor.parentNode.insertBefore(navlinks, navAnchor.nextSibling); }
      });
    }
    const links = document.querySelectorAll('.navlinks a');
    links.forEach(l=>{
      l.addEventListener('click', ()=>{
        document.body.classList.remove('nav-open');
        if(navlinks && navAnchor.parentNode && navlinks.parentNode === document.body){
          navAnchor.parentNode.insertBefore(navlinks, navAnchor.nextSibling);
        }
      });
    });
    const sections = document.querySelectorAll('section[id]');
    const topnav = document.querySelector('.topnav');
    const spy = () => {
      let current = '';
      const y = window.scrollY + 120;
      sections.forEach(sec=>{ if(sec.offsetTop <= y) current = sec.id; });
      links.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#'+current));
      if(topnav) topnav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', spy, {passive:true});
    spy();

    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 720 && document.body.classList.contains('nav-open')){
        document.body.classList.remove('nav-open');
        if(navlinks && navAnchor.parentNode && navlinks.parentNode === document.body){
          navAnchor.parentNode.insertBefore(navlinks, navAnchor.nextSibling);
        }
      }
    });
  }

  /* ---------------- Read progress bar ---------------- */
  function setupReadbar(){
    const bar = document.querySelector('.readbar');
    if(!bar) return;
    const update = () => {
      const h = document.documentElement;
      const height = h.scrollHeight - h.clientHeight;
      bar.style.width = height > 0 ? (h.scrollTop/height*100)+'%' : '0%';
    };
    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  /* ---------------- Varied reveal-on-scroll ---------------- */
  function setupReveal(){
    const items = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window) || items.length === 0){
      items.forEach(i=>i.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: '650px 0px 650px 0px' });
    items.forEach(i=> io.observe(i));

    // stagger: assign --i based on position among siblings inside a .stagger parent
    document.querySelectorAll('.stagger').forEach(parent=>{
      [...parent.children].forEach((child, idx)=> child.style.setProperty('--i', idx));
    });

    window.setTimeout(()=>{
      document.querySelectorAll('.reveal:not(.in)').forEach(i=> i.classList.add('in'));
    }, 1200);
  }

  /* ---------------- Animated number counters ---------------- */
  function setupCounters(){
    const els = document.querySelectorAll('[data-count]');
    if(!els.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1400;
      const start = performance.now();
      function frame(now){
        const p = Math.min(1, (now-start)/dur);
        const eased = 1 - Math.pow(1-p, 3);
        const val = target * eased;
        el.textContent = prefix + val.toLocaleString(undefined, {minimumFractionDigits:decimals, maximumFractionDigits:decimals}) + suffix;
        if(p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    };
    if(!('IntersectionObserver' in window)){ els.forEach(animate); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    els.forEach(el=> io.observe(el));
  }

  /* ---------------- Subtle hero parallax ---------------- */
  function setupParallaxHero(){
    const art = document.querySelector('.hero-art');
    if(!art) return;
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y < 700){ art.style.transform = `translateY(${y*0.08}px)`; }
    }, {passive:true});
  }

  /* ---------------- Lightbox ---------------- */
  function setupLightbox(){
    const lb = document.getElementById('lightbox');
    if(!lb) return;
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lb-cap');
    document.addEventListener('click', (e)=>{
      const img = e.target.closest('img[data-zoom]');
      if(!img) return;
      lbImg.src = img.getAttribute('data-zoom') || img.src;
      lbCap.textContent = img.getAttribute('data-caption') || img.alt || '';
      lb.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    const close = () => { lb.classList.remove('show'); document.body.style.overflow=''; };
    lb.addEventListener('click', close);
    lb.querySelector('.lb-close').addEventListener('click', (e)=>{ e.stopPropagation(); close(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
  }

  /* ---------------- Map explorer tabs ---------------- */
  function setupMapExplorer(){
    document.querySelectorAll('.map-explorer').forEach(explorer=>{
      const tabs = explorer.querySelectorAll('.map-tab');
      const panes = explorer.querySelectorAll('.map-pane');
      tabs.forEach(tab=>{
        tab.addEventListener('click', ()=>{
          tabs.forEach(t=>t.classList.remove('active'));
          panes.forEach(p=>p.classList.remove('active'));
          tab.classList.add('active');
          const target = explorer.querySelector('.map-pane[data-pane="'+tab.dataset.target+'"]');
          if(target) target.classList.add('active');
        });
      });
    });
  }

  /* ---------------- Upazila explorer ---------------- */
  function setupUpazilaExplorer(){
    const grid = document.getElementById('upazilaGrid');
    if(!grid) return;
    const detail = document.getElementById('upazilaDetail');
    const cards = grid.querySelectorAll('.upazila-card');

    const info = {
      'Godagari': 'Largest total area in the study (41,513 ha). One of the two DTW-dominant upazilas with the heaviest groundwater draw alongside Niamatpur — the northwest\'s biggest success story, and its deepest water-table risk, in one place.',
      'Niamatpur': 'Second-largest upazila (42,217 ha) and the leading Boro rice producer. STW-heavy irrigation mix. Flagged alongside Godagari as carrying the most groundwater-depletion risk.',
      'Tanore': 'One of the upazilas specifically recommended for AWD scheduling, thanks to significant clay-soil coverage that needs a different irrigation rhythm from the rest of NRIP.',
      'Chapai Nababganj Sadar': 'Named as a target for AWD scheduling. Closer to the Ganges floodplain margin, with comparatively better drainage than the deep Barind interior.',
      'Gomastapur': 'Sits closer to the floodplain margins — marginally better drainage and more valley terrain than the rest of the High Barind interior.',
      'Nachole': 'Falls within the High Barind Tract\'s core clay belt, contributing to the dominant clay-loam and clay coverage that defines the area\'s water-management story.',
      'Manda': 'A smaller upazila (12,453 ha) on the High Barind Tract, in the Naogaon portion of NRIP.',
      'Paba': 'The smallest upazila by area (7,999 ha) in the NRIP set, on the Rajshahi side of the project.',
      'Porsha': 'Sits at the northern edge of the study area in Naogaon district, on the High Barind Tract.'
    };
    cards.forEach(card=>{
      card.addEventListener('click', ()=>{
        cards.forEach(c=>c.classList.remove('on'));
        card.classList.add('on');
        const name = card.dataset.name;
        const idx = NRIP.upazilas.indexOf(name);
        const total = idx>=0 ? NRIP.upazilaTotals[idx].toLocaleString() : '—';
        detail.style.opacity = 0;
        setTimeout(()=>{
          detail.innerHTML =
            '<div class="flabel" style="font-family:var(--mono);font-size:11px;color:var(--clay-700);letter-spacing:.06em;margin-bottom:8px;text-transform:uppercase;">'+ (NRIP.upazilaDistrict[name]||'') +' district</div>'+
            '<h4 style="margin-bottom:6px;">'+name+'</h4>'+
            '<p style="font-size:13px;color:var(--ink-500);margin-bottom:10px;">Total mapped area: <strong style="color:var(--ink-900);">'+total+' ha</strong></p>'+
            '<p style="margin-bottom:0;">'+(info[name]||'Part of the nine-upazila NRIP study area.')+'</p>';
          detail.style.transition = 'opacity .3s ease';
          detail.style.opacity = 1;
        }, 120);
      });
    });
    if(cards.length){ cards[0].click(); }
  }

  /* ---------------- Scenario explorer ---------------- */
  function setupScenarioExplorer(){
    const box = document.getElementById('scenarioBox');
    if(!box) return;
    const scenBtns = box.querySelectorAll('.seg.scenario-seg button');
    const metricBtns = box.querySelectorAll('.seg.metric-seg button');
    const img = document.getElementById('scenarioImg');
    const note = document.getElementById('scenarioNote');
    const cap = document.getElementById('scenarioCap');

    const files = {
      '10-pcwr':'assets/img/pcwr_10.jpg', '10-nir':'assets/img/nir_10.jpg', '10-yield':'assets/img/yield_10.jpg',
      '20-pcwr':'assets/img/pcwr_20.jpg', '20-nir':'assets/img/nir_20.jpg', '20-yield':'assets/img/yield_20.jpg',
      '100-pcwr':'assets/img/pcwr_100.jpg', '100-nir':'assets/img/nir_100.jpg', '100-yield':'assets/img/yield_100.jpg'
    };
    const notes = {
      pcwr: 'PCWR reflects atmospheric demand, not soil. Clay Loam, Loam, Silty Loam and Sandy Loam sit almost on top of each other in every scenario — only Clay trails behind, because its poor aeration cuts transpiration.',
      nir: 'This is where soil texture takes over. Under frequent schedules, Clay needs the least water of the five — its slow drainage holds moisture longer. Under infrequent scheduling the ranking flips: Sandy Loam now needs the most.',
      yield: 'Yield is nearly soil-independent for four of five soils under every schedule. Clay alone drops and swings under frequent irrigation — then converges back with the rest once irrigation becomes infrequent.'
    };
    const scenLabel = {'10':'10% RAW depletion — frequent','20':'20% RAW depletion — frequent','100':'100% RAW depletion — infrequent'};
    const metricLabel = {'pcwr':'Water Requirement','nir':'Irrigation Applied','yield':'Grain Yield'};

    let scen = '10', metric = 'pcwr';
    function render(){
      const key = scen+'-'+metric;
      img.style.opacity = 0;
      setTimeout(()=>{
        img.src = files[key];
        img.setAttribute('data-zoom', files[key]);
        img.setAttribute('data-caption', metricLabel[metric]+' — '+scenLabel[scen]);
        img.style.transition = 'opacity .3s ease';
        img.style.opacity = 1;
      }, 150);
      note.textContent = notes[metric];
      cap.textContent = metricLabel[metric] + ' · ' + scenLabel[scen] + ' · BRRI dhan88, Rajshahi, 1990–2024';
    }
    scenBtns.forEach(b=>{
      b.addEventListener('click', ()=>{ scenBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active'); scen=b.dataset.scen; render(); });
    });
    metricBtns.forEach(b=>{
      b.addEventListener('click', ()=>{ metricBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active'); metric=b.dataset.metric; render(); });
    });
    render();
  }

  /* ---------------- Back to top ---------------- */
  function setupToTop(){
    const btn = document.querySelector('.totop');
    if(!btn) return;
    window.addEventListener('scroll', ()=>{ btn.classList.toggle('show', window.scrollY > 900); }, {passive:true});
    btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* ================= CHART RENDERERS ================= */
  function donutOpts(extra){
    return Object.assign({
      responsive:true, maintainAspectRatio:false, cutout:'64%',
      animation:{ animateRotate:true, duration:900, easing:'easeOutQuart' },
      plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', titleFont:{weight:'700'}, padding:12, cornerRadius:10,
        callbacks:{ label:(ctx)=> ctx.label+': '+ctx.parsed.toLocaleString()+' ha' } } }
    }, extra||{});
  }
  function makeLegend(container, labels, colors, pct){
    if(!container) return;
    container.innerHTML = labels.map((l,i)=>
      '<span class="mini-chip"><i style="width:9px;height:9px;border-radius:3px;display:inline-block;background:'+colors[i]+'"></i>'+l+ (pct? ' — '+pct[i]+'%':'') +'</span>'
    ).join('');
  }

  function renderStatCharts(){
    const specs = [
      {id:'chartAEZ', legend:'legendAEZ', data:NRIP.aez},
      {id:'chartMoisture', legend:'legendMoisture', data:NRIP.soilMoisture},
      {id:'chartRecession', legend:'legendRecession', data:NRIP.recession},
      {id:'chartLandType', legend:'legendLandType', data:NRIP.landType},
      {id:'chartLandform', legend:'legendLandform', data:NRIP.landform},
      {id:'chartDrainage', legend:'legendDrainage', data:NRIP.drainage},
      {id:'chartTexture', legend:'legendTexture', data:NRIP.texture}
    ];
    specs.forEach(s=>{
      const canvas = document.getElementById(s.id);
      if(!canvas) return;
      new Chart(canvas, {
        type:'doughnut',
        data:{ labels:s.data.labels, datasets:[{ data:s.data.values, backgroundColor:s.data.colors, borderColor:'#fff', borderWidth:3, hoverOffset:8 }] },
        options: donutOpts()
      });
      makeLegend(document.getElementById(s.legend), s.data.labels, s.data.colors, s.data.pct);
    });

    const upBar = document.getElementById('chartUpazilaTotals');
    if(upBar){
      new Chart(upBar, {
        type:'bar',
        data:{ labels:NRIP.upazilas, datasets:[{ label:'Total mapped area (ha)', data:NRIP.upazilaTotals, backgroundColor: makeGradient(upBar,'#c96f3c','#8a4423'), borderRadius:8, maxBarThickness:36 }]},
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'},
          plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10 } },
          scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}, maxRotation:40, minRotation:40} }, y:{ grid:{color:'#f0e2d0'}, ticks:{ callback:(v)=> (v/1000)+'k' } } } }
      });
    }
  }

  function makeGradient(canvas, c1, c2){
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0,0,0,260);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    return g;
  }

  function renderCroppingCharts(){
    const c = NRIP.cropping;
    const areaEl = document.getElementById('chartCropArea');
    if(areaEl){
      new Chart(areaEl, { type:'doughnut', data:{ labels:['Rice (Aus, Aman, Boro)','Non-rice crops'], datasets:[{ data:[c.riceHa, c.nonRiceHa], backgroundColor:['#2f5c3a','#d99a3f'], borderColor:'#fff', borderWidth:3, hoverOffset:8 }]}, options: donutOpts() });
    }
    const prodEl = document.getElementById('chartCropProd');
    if(prodEl){
      new Chart(prodEl, { type:'doughnut', data:{ labels:['Rice','Non-rice crops'], datasets:[{ data:[c.riceProdT, c.nonRiceProdT], backgroundColor:['#1f7fa3','#f0c878'], borderColor:'#fff', borderWidth:3, hoverOffset:8 }]}, options: donutOpts() });
    }
    const costEl = document.getElementById('chartIrrigCost');
    if(costEl){
      new Chart(costEl, {
        type:'bar',
        data:{ labels:['Boro rice','Most other crops'], datasets:[
            { label:'from', data:[c.boroCostPerHa[0], c.otherCostPerHa[0]], backgroundColor:'#b8452f', borderRadius:6, maxBarThickness:48 },
            { label:'to', data:[c.boroCostPerHa[1]-c.boroCostPerHa[0], c.otherCostPerHa[1]-c.otherCostPerHa[0]], backgroundColor:'#f0b8a3', borderRadius:6, maxBarThickness:48 }
        ]},
        options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y', animation:{duration:900,easing:'easeOutQuart'},
          plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10 } },
          scales:{ x:{ stacked:true, grid:{color:'#f0e2d0'}, ticks:{ callback:(v)=> 'Tk '+(v/1000)+'k' } }, y:{ stacked:true, grid:{display:false} } } }
      });
    }
  }

  function renderIrrigationCharts(){
    const src = NRIP.irrigationSource;
    const el = document.getElementById('chartIrrigSource');
    if(el){
      new Chart(el, { type:'doughnut', data:{ labels:src.labels, datasets:[{ data:src.values, backgroundColor:src.colors, borderColor:'#fff', borderWidth:3, hoverOffset:8 }]},
        options: donutOpts({ plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.label+': '+ctx.parsed+'%' } } } }) });
      makeLegend(document.getElementById('legendIrrigSource'), src.labels, src.colors);
    }
    const pw = NRIP.power;
    const pel = document.getElementById('chartPower');
    if(pel){
      new Chart(pel, { type:'doughnut', data:{ labels:pw.labels, datasets:[{ data:pw.values, backgroundColor:pw.colors, borderColor:'#fff', borderWidth:3, hoverOffset:8 }]},
        options: donutOpts({ plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.label+': '+ctx.parsed+'%' } } } }) });
      makeLegend(document.getElementById('legendPower'), pw.labels, pw.colors);
    }
    const mel = document.getElementById('chartMethodByUpazila');
    if(mel){
      const m = NRIP.methodByUpazila;
      new Chart(mel, {
        type:'bar',
        data:{ labels:m.labels, datasets:[
          { label:'Deep Tube Well', data:m.dtw, backgroundColor:'#b8452f', stack:'s' },
          { label:'Shallow Tube Well', data:m.stw, backgroundColor:'#56a05f', stack:'s' },
          { label:'Low Lift Pump', data:m.llp, backgroundColor:'#1f7fa3', stack:'s' }
        ]},
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'},
          plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, boxHeight:12, padding:16, font:{size:11.5} } }, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.dataset.label+': '+ctx.raw.toLocaleString()+' ha' } } },
          scales:{ x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10}, maxRotation:38, minRotation:38} }, y:{ stacked:true, grid:{color:'#f0e2d0'}, ticks:{ callback:(v)=> (v/1000)+'k' } } } }
      });
    }
  }

  function renderSoilPropChart(){
    const el = document.getElementById('chartSoilProps');
    if(!el) return;
    const props = NRIP.soilProps;
    new Chart(el, {
      type:'bar',
      data:{ labels: props.map(p=>p.soil), datasets:[
        { label:'Wilting Point', data:props.map(p=>p.wp), backgroundColor:'#e7dcc4', stack:'m' },
        { label:'Available water', data:props.map(p=>p.fc-p.wp), backgroundColor:'#4fb0cf', stack:'m' },
        { label:'Saturation buffer', data:props.map(p=>p.sat-p.fc), backgroundColor:'#d65b3f', stack:'m' }
      ]},
      options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'},
        plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, boxHeight:12, padding:14, font:{size:11.5}, color:'#e9d6c3' } }, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.dataset.label+': '+ctx.raw+' vol%' } } },
        scales:{ x:{ grid:{display:false}, ticks:{color:'#e9d6c3'} }, y:{ title:{display:true, text:'Volumetric water content (vol%)', color:'#e9d6c3'}, grid:{color:'rgba(255,255,255,.08)'}, ticks:{color:'#e9d6c3'} } } }
    });
    const ksatEl = document.getElementById('chartKsat');
    if(ksatEl){
      new Chart(ksatEl, {
        type:'bar',
        data:{ labels: props.map(p=>p.soil), datasets:[{ data: props.map(p=>p.ksat), backgroundColor: props.map(p=>NRIP.soilColors[p.soil]), borderRadius:6, maxBarThickness:40 }]},
        options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y', animation:{duration:900,easing:'easeOutQuart'},
          plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.raw+' mm/day' } } },
          scales:{ x:{ type:'logarithmic', title:{display:true, text:'Ksat, mm/day (log scale)', color:'#e9d6c3'}, grid:{color:'rgba(255,255,255,.08)'}, ticks:{color:'#e9d6c3'} }, y:{ grid:{display:false}, ticks:{color:'#e9d6c3'} } } }
      });
    }
  }

  function renderClimateCharts(){
    const yieldEl = document.getElementById('chartClimateYield');
    if(yieldEl){
      const y = NRIP.climateYield;
      new Chart(yieldEl, { type:'bar', data:{ labels:['Historical','Near Future','Far Future'], datasets:[{ data:[y.hist,y.nf,y.ff], backgroundColor:['#b5a48d','#d99a3f','#2f5c3a'], borderRadius:8, maxBarThickness:70 }]},
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'}, plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.raw+' t/ha' } } },
          scales:{ y:{ suggestedMin:0, suggestedMax:10, grid:{color:'#f0e2d0'}, title:{display:true,text:'Mean grain yield (t/ha)'} }, x:{ grid:{display:false} } } } });
    }
    const cvEl = document.getElementById('chartClimateCV');
    if(cvEl){
      const cv = NRIP.climateCV;
      new Chart(cvEl, { type:'line', data:{ labels:['Historical','Near Future','Far Future'], datasets:[{ data:[cv.hist,cv.nf,cv.ff], borderColor:'#1f7fa3', backgroundColor:'rgba(31,127,163,.15)', fill:true, tension:.4, pointRadius:6, pointBackgroundColor:'#1f7fa3', borderWidth:3 }]},
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'}, plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.raw+'% CV' } } },
          scales:{ y:{ suggestedMin:0, title:{display:true,text:'Coefficient of variation (%)'}, grid:{color:'#f0e2d0'} }, x:{ grid:{display:false} } } } });
    }
    const wpEl = document.getElementById('chartClimateWP');
    if(wpEl){
      const wp = NRIP.climateWP;
      new Chart(wpEl, { type:'bar', data:{ labels:['Historical','Near Future','Far Future'], datasets:[{ data:[wp.hist,wp.nf,wp.ff], backgroundColor:['#b5a48d','#4fb0cf','#1f7fa3'], borderRadius:8, maxBarThickness:70 }]},
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'}, plugins:{ legend:{display:false}, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.raw+' kg/m³' } } },
          scales:{ y:{ suggestedMin:0, title:{display:true,text:'Water productivity (kg/m³)'}, grid:{color:'#f0e2d0'} }, x:{ grid:{display:false} } } } });
    }
    const irrEl = document.getElementById('chartClimateIrrET');
    if(irrEl){
      const d = NRIP.climateIrrET;
      new Chart(irrEl, { type:'bar', data:{ labels:['Historical','Near Future','Far Future'], datasets:[
          { label:'Irrigation applied (mm)', data:d.irrig, backgroundColor:'#c96f3c', borderRadius:6, maxBarThickness:32 },
          { label:'Reference ET (mm)', data:d.eto, backgroundColor:'#d99a3f', borderRadius:6, maxBarThickness:32 }
        ]},
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:900,easing:'easeOutQuart'}, plugins:{ legend:{ position:'bottom', labels:{boxWidth:12,boxHeight:12,font:{size:11.5}} }, tooltip:{ backgroundColor:'#23180f', padding:12, cornerRadius:10, callbacks:{ label:(ctx)=> ctx.dataset.label+': '+ctx.raw+' mm' } } },
          scales:{ y:{ suggestedMin:0, suggestedMax:600, grid:{color:'#f0e2d0'}, title:{display:true,text:'mm / season'} }, x:{ grid:{display:false} } } } });
    }
  }

})();
