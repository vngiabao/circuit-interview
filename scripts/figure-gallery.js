/* Local visual inspection surface, omitted from dist. */
(function () {
  const groups = [
    ['inverter','nand','nor','aoi','oai'],
    ['transmission-gate','tristate','domino','tg-latch','master-slave'],
    ['sram6t','sram8t','sense-amplifier','precharge-equalize','nor-rom'],
    ['mirror','cascode-mirror','ota5t','strongarm','level-shifter'],
    ['id-vgs','id-vds','vtc-noise','butterfly-snm','gm-id'],
    ['bode-margin','step-ringing','fo4-vdd','leakage-vt-temp','crosstalk-glitch'],
    ['ir-heatstrip','em-lifetime','mc-histogram','sigma-yield','liberty-surface'],
    ['elmore-response','shmoo','dvfs-power','timing-setup-hold','timing-handshake'],
    ['handshake','async-fifo','pll','ntt-butterfly','timing-handshake']
  ];
  const group = Number(new URLSearchParams(location.search).get('group') || 0);
  T.state.settings.theme = new URLSearchParams(location.search).get('theme') || 'dark'; T.applyTheme();
  document.querySelector('#main').innerHTML = `<div class="page"><header class="head"><h1>Figure inspection</h1><nav class="row">${groups.map((g,i)=>`<a class="btn ghost sm" href="scripts/figure-gallery.html?group=${i}">Group ${i+1}</a>`).join('')}</nav></header><div class="figure-strip">${groups[group].map(id=>T.figure(T.schematics[id] ? {schematic:id,cap:id} : {plot:id,cap:id})).join('')}</div></div>`;
})();
