import React from "react";
import MapView from "react-native-maps";

const MyMapView = (props) => {
  return (
    <MapView
      style={{ flex: 1 }}
      region={props.region ? props.region : null}
      showsUserLocation={true}
      //onRegionChange={(reg) => props.onRegionChange(reg)}
    >
      <MapView.Marker coordinate={props.region ? props.region : null} />
    </MapView>
  );
};

export default MyMapView;
