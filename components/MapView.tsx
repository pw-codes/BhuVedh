"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { Site } from "@/app/page";

const COLORS = { Prioritize: "#2B6A33", "Verify first": "#C78A0B", Defer: "#6B5E4E" };

export default function MapView({ sites, selected, onSelect, show }: {
  sites: Site[]; selected: number | null; onSelect: (id: number) => void; show: { ws: boolean; rh: boolean };
}) {
  const el = useRef<HTMLDivElement>(null), map = useRef<maplibregl.Map | null>(null), ready = useRef(false);

  useEffect(() => {
    const m = new maplibregl.Map({
      container: el.current!, center: [79.68, 29.65], zoom: 10.2,
      style: { version: 8, sources: { osm: { type: "raster", tileSize: 256, attribution: "© OpenStreetMap contributors",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"] } }, layers: [{ id: "osm", type: "raster", source: "osm" }] },
    });
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }));
    m.on("load", () => {
      const empty = { type: "FeatureCollection", features: [] } as any;
      m.addSource("ws", { type: "geojson", data: empty }); m.addSource("rh", { type: "geojson", data: empty }); m.addSource("pts", { type: "geojson", data: empty });
      m.addLayer({ id: "ws", type: "line", source: "ws", paint: { "line-color": "#0B6A8A", "line-width": 2, "line-dasharray": [3, 2] } });
      m.addLayer({ id: "rh-fill", type: "fill", source: "rh", paint: { "fill-color": "#2B6A33", "fill-opacity": 0.22 } });
      m.addLayer({ id: "rh", type: "line", source: "rh", paint: { "line-color": "#2B6A33", "line-width": 2 } });
      m.addLayer({ id: "pts", type: "circle", source: "pts", paint: {
        "circle-radius": ["case", ["get", "sel"], 11, 7], "circle-color": ["get", "c"], "circle-stroke-width": 3, "circle-stroke-color": "#241A10" } });
      m.on("click", "pts", (e) => onSelect(e.features![0].properties!.id));
      m.on("mouseenter", "pts", () => (m.getCanvas().style.cursor = "pointer"));
      m.on("mouseleave", "pts", () => (m.getCanvas().style.cursor = ""));
      ready.current = true; map.current = m; m.fire("data-ready" as any);
    });
    return () => m.remove();
  }, []); // eslint-disable-line

  useEffect(() => {
    const m = map.current; if (!m || !ready.current) { const t = setTimeout(() => map.current?.fire("noop" as any), 300); return () => clearTimeout(t); }
    const vis = sites.filter((s) => selected === null || s.spring.id === selected);
    const polys = (k: "watershed" | "recharge") => ({ type: "FeatureCollection", features: vis.map((s) => ({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: s[k] } })) });
    (m.getSource("ws") as any).setData(polys("watershed")); (m.getSource("rh") as any).setData(polys("recharge"));
    (m.getSource("pts") as any).setData({ type: "FeatureCollection", features: sites.map((s) => ({ type: "Feature",
      properties: { id: s.spring.id, c: COLORS[s.assessment.verdict], sel: s.spring.id === selected },
      geometry: { type: "Point", coordinates: [s.spring.lon, s.spring.lat] } })) });
    m.setLayoutProperty("ws", "visibility", show.ws ? "visible" : "none");
    ["rh", "rh-fill"].forEach((l) => m.setLayoutProperty(l, "visibility", show.rh ? "visible" : "none"));
    const sel = sites.find((s) => s.spring.id === selected);
    if (sel) m.easeTo({ center: [sel.spring.lon, sel.spring.lat], zoom: 12.5 });
  }, [sites, selected, show, ready.current]);

  return <div id="map" ref={el} />;
}
