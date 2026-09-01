-- Create driver_locations table to store driver geolocation updates
CREATE TABLE IF NOT EXISTS driver_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  speed double precision,
  heading double precision,
  vehicle_registration varchar(128),
  shipment_tracking_code varchar(128),
  recorded_at timestamp without time zone NOT NULL DEFAULT now()
);

-- index for quick latest lookup per driver
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_recorded_at ON driver_locations(driver_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_driver_locations_shipment_tracking_code ON driver_locations(shipment_tracking_code);
