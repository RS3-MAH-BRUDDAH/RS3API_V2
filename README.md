# Audi RS API V2
#Copyright The Chowz & Ma Brudahz & Azeem and Freidns & Free da guys HMP Shewsbury

Open the docs file on how to use the API

PokeAPI-style REST API. `npm start` (Node 16+, no dependencies) then open http://localhost:3000/api/v2/

Resources: `model`, `generation`, `variant`, `colour`, `body-style`
- `GET /api/v2/{resource}/?limit=20&offset=0` paginated `{count,next,previous,results[{name,url}]}`
- `GET /api/v2/{resource}/{id|name}/` full detail with linked resources
- Filters: generation `?model=rs6&body=avant&year=2020&min_power=500&max_0_100=3.8&colour=nardo-grey`; colour `?finish=pearl&year=2015&generation=rs6-c8`; variant `?generation=rs6-c8`; any list `?q=text`

Add data in `data.js` only. Colour `paint_code: null` means "to verify".
