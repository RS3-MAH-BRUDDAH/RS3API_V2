// Zero-dependency PokeAPI-style API. Run: node server.js  (PORT env optional)
const http = require('http');
const D = require('./data');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const END = 9999;
const overlap = (a1, a2, b1, b2) => a1 <= (b2 ?? END) && b1 <= (a2 ?? END);

// ---- build resources with ids ----
const model = D.models.map(([n, d], i) => ({ id: i + 1, name: n, display_name: d }));
const modelBy = Object.fromEntries(model.map(m => [m.name, m]));
const gen = D.generations.map((x, i) => ({ id: i + 1, name: x.slug, ...x, model: modelBy[x.model] }));
const genBy = Object.fromEntries(gen.map(x => [x.name, x]));
const variant = D.variants.map(([gs, n, f, t, ps, nm, notes], i) =>
  ({ id: i + 1, name: slug(`${gs}-${n}`), display_name: n, generation: genBy[gs], from: f, to: t, ps, nm, notes }));
const colour = D.colours.map(([n, finish, code, f, t], i) => ({ id: i + 1, name: slug(n), display_name: n, finish, code, from: f, to: t }));
const bodyNames = [...new Set(gen.flatMap(x => x.bodies))].sort();
const body = bodyNames.map((n, i) => ({ id: i + 1, name: n }));
const coloursFor = g => colour.filter(c => overlap(c.from, c.to, g.from, g.to));

// ---- representations ----
let base = '';
const url = (r, o) => `${base}/api/v2/${r}/${o.id}/`;
const ref = (r, o) => ({ name: o.name, url: url(r, o) });
const kw = ps => Math.round(ps * 0.7355);

const R = {
  model: {
    list: model,
    filter: (o, q) => !q.year || gen.some(g => g.model === o && overlap(+q.year, +q.year, g.from, g.to)),
    show: o => ({ id: o.id, name: o.name, display_name: o.display_name,
      first_year: Math.min(...gen.filter(g => g.model === o).map(g => g.from)),
      generations: gen.filter(g => g.model === o).map(g => ref('generation', g)) }),
  },
  generation: {
    list: gen,
    filter: (g, q) => (!q.model || g.model.name === q.model) && (!q.body || g.bodies.includes(q.body)) &&
      (!q.year || overlap(+q.year, +q.year, g.from, g.to)) && (!q.min_power || g.ps >= +q.min_power) &&
      (!q.max_0_100 || g.s <= +q.max_0_100) && (!q.colour || coloursFor(g).some(c => c.name === q.colour)),
    show: g => ({ id: g.id, name: g.name, model: ref('model', g.model), chassis_code: g.code,
      years: { from: g.from, to: g.to }, in_production: g.to === null,
      body_styles: g.bodies.map(b => ref('body-style', body.find(x => x.name === b))),
      engine: g.engine, power: { ps: g.ps, kw: kw(g.ps) }, torque_nm: g.nm,
      acceleration_0_100_kmh_s: g.s, top_speed_kmh: g.kmh, drivetrain: 'quattro', transmission: g.trans, notes: g.notes,
      variants: variant.filter(v => v.generation === g).map(v => ref('variant', v)),
      colours: coloursFor(g).map(c => ref('colour', c)) }),
  },
  variant: {
    list: variant,
    filter: (v, q) => (!q.generation || v.generation.name === q.generation) && (!q.model || v.generation.model.name === q.model),
    show: v => ({ id: v.id, name: v.name, display_name: v.display_name, generation: ref('generation', v.generation),
      years: { from: v.from, to: v.to }, power: { ps: v.ps, kw: kw(v.ps) }, torque_nm: v.nm, notes: v.notes }),
  },
  colour: {
    list: colour,
    filter: (c, q) => (!q.finish || c.finish === q.finish) && (!q.year || overlap(+q.year, +q.year, c.from, c.to)) &&
      (!q.generation || coloursFor(genBy[q.generation] || { from: 0, to: 0 }).includes(c)),
    show: c => ({ id: c.id, name: c.name, display_name: c.display_name, finish: c.finish, paint_code: c.code,
      available: { from: c.from, to: c.to },
      generations: gen.filter(g => overlap(c.from, c.to, g.from, g.to)).map(g => ref('generation', g)) }),
  },
  'body-style': {
    list: body, filter: () => true,
    show: b => ({ id: b.id, name: b.name, generations: gen.filter(g => g.bodies.includes(b.name)).map(g => ref('generation', g)) }),
  },
};

// ---- server ----
const send = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj, null, 2));
};

http.createServer((req, res) => {
  const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  base = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers['x-forwarded-host'] || u.host}`;
  const parts = u.pathname.split('/').filter(Boolean);
  const q = Object.fromEntries(u.searchParams);
  if (parts[0] !== 'api' || parts[1] !== 'v2') return send(res, 200, { name: 'Audi RS API', docs: `${base}/api/v2/` });
  if (parts.length === 2) return send(res, 200, Object.fromEntries(Object.keys(R).map(k => [k, `${base}/api/v2/${k}/`])));
  const r = R[parts[2]];
  if (!r) return send(res, 404, { detail: 'Unknown resource' });
  if (parts[3]) {
    const o = r.list.find(x => String(x.id) === parts[3] || x.name === parts[3]);
    return o ? send(res, 200, r.show(o)) : send(res, 404, { detail: 'Not found' });
  }
  let items = r.list.filter(o => r.filter(o, q));
  if (q.q) items = items.filter(o => o.name.includes(slug(q.q)));
  const limit = Math.max(1, +q.limit || 20), offset = Math.max(0, +q.offset || 0);
  const page = n => { const p = new URLSearchParams(q); p.set('limit', limit); p.set('offset', n); return `${base}/api/v2/${parts[2]}/?${p}`; };
  send(res, 200, {
    count: items.length,
    next: offset + limit < items.length ? page(offset + limit) : null,
    previous: offset > 0 ? page(Math.max(0, offset - limit)) : null,
    results: items.slice(offset, offset + limit).map(o => ref(parts[2], o)),
  });
}).listen(process.env.PORT || 3000, () => console.log(`Audi RS API on :${process.env.PORT || 3000}`));
