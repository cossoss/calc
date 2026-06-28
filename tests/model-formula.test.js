const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'docs', 'index.html'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

const expectedHtmlFormula = '1/(1+Math.exp(-1.867*bc-0.373*niss-0.016*fbg*fbg_unit-0.02*ldl*ldl_unit+7.641))';
const expectedReadmeFormula = 'P(0)=1/(1+e^(-1.867*X侧枝-0.373*XNISS-0.016*FBG-0.02*LDL+7.641))';

assert(html.includes(expectedHtmlFormula), 'docs/index.html must use the revised model formula');
assert(readme.includes(expectedReadmeFormula), 'README.md must document the revised model formula');
assert(!html.includes('-1.851*bc-0.358*niss-0.017*fbg*fbg_unit-0.021*ldl*ldl_unit+7.875'), 'docs/index.html must not keep the old formula');
assert(!readme.includes('-1.851*X侧枝-0.358*XNISS-0.017*FBG-0.021*LDL+7.875'), 'README.md must not keep the old formula');
assert(html.includes('风险提示：本预测平台仅为临床参考，不能替代医师诊断，最终决定由临床医生和患者根据实际情况审慎思考后作出'), 'docs/index.html must show the revised risk notice');

function predict({ bc, niss, fbg, fbgUnit = 1, ldl, ldlUnit = 1 }) {
  return 1 / (1 + Math.exp(-1.867 * bc - 0.373 * niss - 0.016 * fbg * fbgUnit - 0.02 * ldl * ldlUnit + 7.641));
}

function renderedPercent(input) {
  return Math.round(10000 * predict(input)) / 100 + '%';
}

assert.strictEqual(renderedPercent({ bc: 0, niss: 0, fbg: 0, ldl: 0 }), '0.05%');
assert.strictEqual(renderedPercent({ bc: 1, niss: 8, fbg: 242, ldl: 212 }), '99.51%');
assert.strictEqual(renderedPercent({ bc: 1, niss: 4, fbg: 6, fbgUnit: 18, ldl: 3, ldlUnit: 38.66 }), '44.17%');

console.log('Model formula tests passed.');
