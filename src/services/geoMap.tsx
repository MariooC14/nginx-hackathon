import DottedMap from 'dotted-map';
import type {LocationData} from "@/services/gpsService.ts";

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
      svgOptions: { color: '#00BC7DFF', radius: 0.44 },
    });
  }

  const svgMap = map.getSVG({
    radius: 0.22,
    color: '#696666',
    shape: 'circle',
    backgroundColor: '#09090BFF',
  });

  return (
    <div className={className}>
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}  alt={"Geo location map"}/>
    </div>
  );
};

export default GeoMap;

