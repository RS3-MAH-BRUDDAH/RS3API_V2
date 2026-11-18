import requests

BASE = "https://YOUR-APP-URL/api/v2"   # use http://localhost:3000/api/v2 locally

# List every RS6 generation
r = requests.get(f"{BASE}/generation/", params={"model": "rs6"}, timeout=30)
r.raise_for_status()
data = r.json()
print("count:", data["count"])

# Follow each link, PokeAPI-style
for item in data["results"]:
    g = requests.get(item["url"], timeout=30).json()
    print(g["name"], g["power"]["ps"], "PS,", g["acceleration_0_100_kmh_s"], "s,",
          len(g["colours"]), "colours")

# Filters
fast = requests.get(f"{BASE}/generation/", params={"max_0_100": 3.8, "min_power": 500}, timeout=30).json()
print([x["name"] for x in fast["results"]])
