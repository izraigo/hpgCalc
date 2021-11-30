const NH4 = 0;
const NO3 = 1;
const P   = 2;
const K   = 3;
const Ca  = 4;
const Mg  = 5;
const S   = 6;
const CL  = 7
const ELEMENTS_NO   = 8;

const elements  = ['NH4',    'NO3',       'P',     'K',   'Ca',   'Mg',    'S',  'Cl'];

const molarMass = [14.0067, 14.0067, 30.973762, 39.0983, 40.078, 24.305, 32.065, 135.453];
const catCharge = [      1,       0,         0,       1,      2,      2,      0,       0];
const mEC = math.dotMultiply(math.dotPow(molarMass, -1), catCharge);




let fCaN2O6    = [    0.7,  14.176,         0,       0,  19.28,      0,      0,      0];
let fKNO3      = [      0,  13.649,         0,    38.1,      0,      0,      0,      0];
let fNH4NO3    = [ 16.520,  16.520,         0,       0,      0,      0,      0,      0];
let fMgSO4     = [      0,       0,         0,       0,      0, 10.221, 13.484,      0];
let fKH2PO4    = [      0,       0,      21.8,  27.518,      0,      0,      0,      0];
let fK2SO4     = [      0,       0,         0,  44.874,      0,      0, 18.401,      0];
let fCaCl2     = [      0,       0,         0,       0, 18.294,      0,      0, 32.336];
let fMgNO3     = [      0,  10.925,         0,       0,      0,  9.479,      0,      0];

let profile = [];
let fertilisers = [];
let mInvFreeS  = [];
let mInvFreeCa = [];

setFertilisers(math.matrixFromRows(fCaN2O6, fKNO3, fNH4NO3, fMgSO4, fKH2PO4, fK2SO4, fCaCl2));
setProfile([12.428, 165.702, 60, 226.840, 141.83, 32.25, 42.543, 0]);

document.getElementById('pN').addEventListener('input', e => {onNchange()});
document.getElementById('pNRatio').addEventListener('input', e => {onNchange()});
document.getElementById('pNO3').addEventListener('input', e => {onNO3change()});
document.getElementById('pNH4').addEventListener('input', e => {onNH4change()});
document.getElementById('pP').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pK').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pCa').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pMg').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pS').addEventListener('input', e => {onProfileChangeFreeCa()});
document.getElementById('pCl').addEventListener('input', e => {onProfileChangeFreeS()});
document.getElementById('pEC').addEventListener('input', e => {calculateFromEC(parseFloat(document.getElementById('pEC').value), solverFreeS);});

document.querySelectorAll('input[id^="r"]').forEach((e) => e.addEventListener('input', e => {onRatioChange(e)}));

function solverFreeCa() {
    return math.multiply(mInvFreeCa, profile.filter((value, index, arr) => index != Ca));
} 

function solverFreeS() {
    return math.multiply(mInvFreeS, profile.filter((value, index, arr) => index != S));
} 

function onProfileChangeFreeS() {
    onProfileChange(solverFreeS);
}

function onProfileChangeFreeCa() {
    onProfileChange(solverFreeCa);
}

function onProfileChange(solver) {
    updateProfileMatrix();
    updateRatios();
    let weights = solver();
    updateWeightInputs(weights)
    profile = math.multiply(fertilisers, weights);
    updateProfileInputs();
    document.getElementById('pEC').value = calculateEC().toFixed(3);    
}

function updateWeightInputs(weights) {
    for (let w = 1; w < ELEMENTS_NO; w++) {
        document.getElementById('w' + w).textContent = (weights[w - 1] * 0.001).toFixed(3);
    }
}

function setProfile(p) {
    profile = p;
    updateProfileInputs();
    onProfileChange(solverFreeS);
}

function setFertilisers(f) {
    updateFertilisersInputs(f);
    fertilisers = math.transpose(math.multiply(f, 0.01));
    mInvFreeS  = math.inv(fertilisers.filter((value, index, arr) => index != S));
    mInvFreeCa = math.inv(fertilisers.filter((value, index, arr) => index != Ca));
}

function updateRatios() {
    let p = [profile[NO3] + profile[NH4], profile[P], profile[K], profile[Ca], profile[Mg], profile[S]];
    let m = math.matrixFromRows(p, p, p, p, p, p);
    let m2 = math.matrixFromColumns(p, p, p, p, p, p);
    let size = p.length;
    let ratios = math.dotDivide(m, m2);
    for (let r = 1; r <= size; r++) {
        for (let c = 1; c <= size; c++) {
            if (r != c) document.getElementById('r' + r + c).value = ratios[r - 1][c - 1].toFixed(3);
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
    document.getElementById('pNRatio').value = (profile[NH4] / profile[NO3]).toFixed(3);
}

function updateFertilisersInputs(f) {
    for (let r = 1; r <= f.length; r++) {
      for (let c = 1; c <= ELEMENTS_NO; c++) {
          document.getElementById('f' + r + c).textContent = f[r-1][c-1].toFixed(3);    
      }
    }
}

function calculateEC() {
    return 0.095 * (math.multiply(profile, mEC) + 2);
}

function calculateFromEC(targetEC, solver) {
    let currentEC = calculateEC();
    let p = profile[P];
    profile = math.multiply(profile, targetEC / currentEC);
    profile[P] = p;

    updateProfileInputs();
    onProfileChange(solver);
}

function onRatioChange(e) {
    let indTo = parseInt(e.srcElement.id.charAt(1));
    let indFrom = parseInt(e.srcElement.id.charAt(2));
    let r = 1 / parseFloat(e.srcElement.value);
    let targetEC = parseFloat(document.getElementById('pEC').value);

    if (indTo == P) {
        indTo = indFrom;
        indFrom = P;
        r = 1 / r;
    }

    const N = 1;
    if (indTo == N) {
        let n = profile[indFrom] * r;
        let ratio = parseFloat(document.getElementById('pNRatio').value);
        profile[NH4] = (n / (1 + 1 / ratio))
        profile[NO3] = n - profile[NH4];
    } else if (indFrom == N) {
        profile[indTo] = (profile[NH4] + profile[NO3]) * r;
    } else {
        profile[indTo] = profile[indFrom] * r;
    }

    updateProfileInputs();
    updateRatios();
    calculateFromEC(targetEC, indTo == S ? solverFreeCa : solverFreeS);
}