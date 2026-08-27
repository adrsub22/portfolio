const kpis = [
  { value: "317", label: "named OSM locations" },
  { value: "16", label: "industrial employment centers" },
  { value: "15", label: "planner categories" },
  { value: "3", label: "search polygons" },
];

const categories = [
  { name: "Food and Beverage", count: 71, color: "#d73027" },
  { name: "Retail", count: 42, color: "#7b3294" },
  { name: "Automotive", count: 35, color: "#636363" },
  { name: "Government and Community", count: 34, color: "#01665e" },
  { name: "Education", count: 33, color: "#5e4fa2" },
  { name: "Grocery and Convenience", count: 25, color: "#1a9850" },
  { name: "Industrial Employment Center", count: 16, color: "#ff7f00" },
  { name: "Medical and Healthcare", count: 14, color: "#e31a1c" },
  { name: "Lodging", count: 13, color: "#542788" },
  { name: "Professional Services", count: 11, color: "#4575b4" },
  { name: "Personal Services", count: 10, color: "#c51b7d" },
  { name: "Financial Services", count: 5, color: "#fdae61" },
  { name: "Recreation and Entertainment", count: 5, color: "#00a6ca" },
  { name: "Industrial and Trade", count: 2, color: "#8c510a" },
  { name: "Tourism and Attractions", count: 1, color: "#3288bd" },
];

const maxCount = Math.max(...categories.map((c) => c.count));

export function OsmBusinessLocator() {
  return (
    <div className="osm-demo">
      <p className="kicker">Pipeline export · OpenStreetMap</p>
      <h3>Interactive inventory map</h3>
      <p className="muted">
        This is the Leaflet map the pipeline wrote for one run: 317 named
        locations inside three search polygons (Zone 1, Zone 2, and Zone 3).
        Toggle categories, open popups, and use the export control for CSV,
        KML, KMZ, GeoJSON, or shapefile. Completeness follows OSM tagging, not a
        licensed business registry.
      </p>

      <div className="kpi-row kpi-row-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi">
            <b>{kpi.value}</b>
            <span className="muted">{kpi.label}</span>
          </div>
        ))}
      </div>

      <p className="osm-map-actions">
        <a
          href="/osm-business-locator/osm_business_inventory_map.html"
          target="_blank"
          rel="noreferrer"
        >
          Open map in a new tab
        </a>
      </p>

      <iframe
        className="osm-map"
        title="OpenStreetMap business inventory map"
        src="/osm-business-locator/osm_business_inventory_map.html?v=2"
        loading="lazy"
      />
      <p className="muted osm-map-credit">
        Map data © OpenStreetMap contributors, ODbL. Three records in this run
        were flagged for boundary-edge review; none were flagged as potential
        duplicates.
      </p>

      <h3>Category mix for this run</h3>
      <p className="muted">
        Colors match the map legend. Food and beverage, retail, and automotive
        account for 148 of the 317 named locations.
      </p>
      <div className="osm-cats" role="list">
        {categories.map((category) => (
          <div key={category.name} className="osm-cat" role="listitem">
            <span className="osm-cat-name">{category.name}</span>
            <span className="osm-cat-track">
              <i
                style={{
                  width: `${(category.count / maxCount) * 100}%`,
                  background: category.color,
                }}
              />
            </span>
            <span className="osm-cat-count">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
