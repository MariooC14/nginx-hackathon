import DottedMap from 'dotted-map';
import type { LocationData } from "@/services/gpsService.ts";
interface GeoMapProps {
  locations: LocationData[];
  className?: string;
}

const GeoMap = ({ locations, className }: GeoMapProps) => {
  const map = new DottedMap({ height: 60, grid: 'diagonal' });
  for (const location of locations) {
    const { latitude, longitude } = location;
    map.addPin({
      lng: longitude,
      lat: latitude,
      svgOptions: { color: '#d6ff79', radius: 0.4 },
    });
  }

  const svgMap = map.getSVG({
    radius: 0.22,
    color: '#423B38',
    shape: 'circle',
    backgroundColor: '#020300',
  });

  return (
    <div className={className}>
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`} />
    </div>
  );
};

export default GeoMap;

