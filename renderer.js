// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const NO3 = 0;
const NH4 = 1;
const P   = 2;
const K   = 3;
const Ca  = 4;
const Mg  = 5;
const S   = 6;
const ELEMENTS_NO   = 7;

const elements  = ['NH4', 'NO3', 'P', 'K', 'Ca', 'Mg', 'S'];

const profile = [12.43, 165.7, 60, 226.840, 141.83, 32.25, 42.543];
updateProfileInputs();

let fCaN2O6    = [    0.7,  14.176,         0,       0,  19.28,      0,      0];
let fKNO3      = [      0,  13.649,         0,    38.1,      0,      0,      0];
let fNH4NO3    = [ 16.520,  16.520,         0,       0,      0,      0,      0];
let fMgSO4     = [      0,       0,         0,       0,      0, 10.221, 13.484];
let fKH2PO4    = [      0,       0,      21.8,  27.518,      0,      0,      0];
let fK2SO4     = [      0,       0,         0,  44.874,      0,      0, 18.401];

const fertilisersPercent = math.matrixFromRows(fCaN2O6, fKNO3, fNH4NO3, fMgSO4, fKH2PO4, fK2SO4);
const fertilisers = math.multiply(fertilisersPercent, 0.01);
const fertilisersInv = math.inv(math.transpose(math.resize(fertilisers, [6,6], 0)));

updateFertilisersInputs();
onProfileChange();



for (let i = 0; i < ELEMENTS_NO; i++) {
    document.getElementById('pr' + elements[i]).addEventListener('input', e => {onProfileChange()});
}

function onProfileChange() {
    updateProfileMatrix();

    let p = [parseFloat(profile[NO3]) + parseFloat(profile[NH4]), profile[P], profile[K], profile[Ca], profile[Mg], profile[S]];
    let m = math.matrixFromRows(p, p, p, p, p, p);
    let m2 = math.matrixFromColumns(p, p, p, p, p, p);

    let ratios = math.dotDivide(m, m2);
    for (let r = 1; r < ELEMENTS_NO; r++) {
        for (let c = 1; c < ELEMENTS_NO; c++) {
            document.getElementById('r' + r + c).textContent = ratios[r - 1][c - 1].toFixed(3);
        }
    }

    weights = math.multiply(fertilisersInv, math.multiply(math.resize(profile, [6], 0), 0.001));
    for (let w = 1; w < ELEMENTS_NO; w++) {
        document.getElementById('w' + w).textContent = weights[w - 1].toFixed(3);
    }
}

function combineN() {
    
    for (let i = 0; i < ELEMENTS_NO; i++) {
        profile[i] = document.getElementById('pr' + elements[i]).value;    
    }
    
}

function updateProfileMatrix() {
    for (let i = 0; i < ELEMENTS_NO; i++) {
        profile[i] = document.getElementById('pr' + elements[i]).value;    
    }
}

function updateProfileInputs() {
    for (let i = 0; i < ELEMENTS_NO; i++) {
        document.getElementById('pr' + elements[i]).value = profile[i];    
    }
}

function updateFertilisersInputs() {
    for (let r = 1; r < ELEMENTS_NO; r++) {
      for (let c = 1; c < ELEMENTS_NO; c++) {
          document.getElementById('f' + r + c).textContent = fertilisersPercent[r-1][c-1].toFixed(3);    
      }
    }
}
