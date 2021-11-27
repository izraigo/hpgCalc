const NO3 = 0;
const NH4 = 1;
const P   = 2;
const K   = 3;
const Ca  = 4;
const Mg  = 5;
const S   = 6;
const ELEMENTS_NO   = 7;

const elements  = ['NH4', 'NO3', 'P', 'K', 'Ca', 'Mg', 'S'];

let profile = [12.428, 165.702, 60, 226.840, 141.83, 32.25, 42.543];
updateProfileInputs();

let fCaN2O6    = [    0.7,  14.176,         0,       0,  19.28,      0,      0];
let fKNO3      = [      0,  13.649,         0,    38.1,      0,      0,      0];
let fNH4NO3    = [ 16.520,  16.520,         0,       0,      0,      0,      0];
let fMgSO4     = [      0,       0,         0,       0,      0, 10.221, 13.484];
let fKH2PO4    = [      0,       0,      21.8,  27.518,      0,      0,      0];
let fK2SO4     = [      0,       0,         0,  44.874,      0,      0, 18.401];

const fertilisersPercent = math.matrixFromRows(fCaN2O6, fKNO3, fNH4NO3, fMgSO4, fKH2PO4, fK2SO4);
const fertilisers = math.transpose(math.multiply(fertilisersPercent, 0.01));
const mInvFreeS  = math.inv(fertilisers.filter((value, index, arr) => index != S));
const mInvFreeCa = math.inv(fertilisers.filter((value, index, arr) => index != Ca));


updateFertilisersInputs();

let no3 = parseFloat(document.getElementById('pNO3').value);
let nh4 = parseFloat(document.getElementById('pNH4').value);
console.log(no3 + " " + nh4);
document.getElementById('pN').value = nh4 + no3;
document.getElementById('pNRatio').value = (nh4 / no3).toFixed(3);
onProfileChangeFreeS();

document.getElementById('pN').addEventListener('input', e => {onNchange()});
document.getElementById('pNRatio').addEventListener('input', e => {onNchange()});
document.getElementById('pNO3').addEventListener('input', e => {onNO3change()});
document.getElementById('pNH4').addEventListener('input', e => {onNH4change()});
document.getElementById('pP').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pK').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pCa').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pMg').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pS').addEventListener('input', e => {onProfileChangeFreeCa()});

function onProfileChangeFreeS() {
    solver = () => math.multiply(mInvFreeS, profile.filter((value, index, arr) => index != S));
    onProfileChange(solver);
}

function onProfileChangeFreeCa() {
    solver = () => math.multiply(mInvFreeCa, profile.filter((value, index, arr) => index != Ca));
    onProfileChange(solver);
}

function onProfileChange(solver) {
    updateProfileMatrix();
    updateRatios();
    let weights = solver();
    for (let w = 1; w < ELEMENTS_NO; w++) {
        document.getElementById('w' + w).textContent = (weights[w - 1] * 0.001).toFixed(3);
    }

    profile = math.multiply(fertilisers, weights);
    updateProfileInputs();
}


function updateRatios() {
    let p = [parseFloat(profile[NO3]) + parseFloat(profile[NH4]), profile[P], profile[K], profile[Ca], profile[Mg], profile[S]];
    let m = math.matrixFromRows(p, p, p, p, p, p);
    let m2 = math.matrixFromColumns(p, p, p, p, p, p);

    let ratios = math.dotDivide(m, m2);
    for (let r = 1; r < ELEMENTS_NO; r++) {
        for (let c = 1; c < ELEMENTS_NO; c++) {
            document.getElementById('r' + r + c).textContent = ratios[r - 1][c - 1].toFixed(3);
        }
    }
}

function onNchange() {
    let ratio = parseFloat(document.getElementById('pNRatio').value);
    let n = parseFloat(document.getElementById('pN').value);
    nh4 = (n / (1 + 1 / ratio))
    no3 = n - nh4;
    document.getElementById('pNH4').value = nh4.toFixed(3);
    document.getElementById('pNO3').value = no3.toFixed(3);
    onProfileChangeFreeS();
}

function onNH4change() {
    let nh4 = parseFloat(document.getElementById('pNH4').value);
    let n = parseFloat(document.getElementById('pN').value);
    let no3 = n - nh4
    document.getElementById('pNO3').value = no3;
    document.getElementById('pNRatio').value = (nh4 / no3).toFixed(3);
    onProfileChangeFreeS();
}

function onNO3change() {
    let no3 = parseFloat(document.getElementById('pNO3').value);
    let n = parseFloat(document.getElementById('pN').value);
    let nh4 = n - no3
    document.getElementById('pNH4').value = nh4;
    document.getElementById('pNRatio').value = (nh4 / no3).toFixed(3);
    onProfileChangeFreeS();
}

function updateProfileMatrix() {
    for (let i = 0; i < ELEMENTS_NO; i++) {
        profile[i] = parseFloat(document.getElementById('p' + elements[i]).value);    
    }
}

function updateProfileInputs() {
    for (let i = 0; i < ELEMENTS_NO; i++) {
        document.getElementById('p' + elements[i]).value = profile[i].toFixed(3);
    }
    document.getElementById('pN').value = (profile[NH4] + profile[NO3]).toFixed(3);
}

function updateFertilisersInputs() {
    for (let r = 1; r < ELEMENTS_NO; r++) {
      for (let c = 1; c <= ELEMENTS_NO; c++) {
          document.getElementById('f' + r + c).textContent = fertilisersPercent[r-1][c-1].toFixed(3);    
      }
    }
}
