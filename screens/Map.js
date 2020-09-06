import React from "react";
import styles from "../styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Text, TouchableOpacity } from "react-native";
import MapInput from "../components/MapInput";
import MyMapView from "../components/MapView";
import { getLocation } from "../services/locationService";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import { getUser } from "../actions/user";

import { updateLocationUser } from "../querysFirebase/querysUser";

class Map extends React.Component {
  state = {
    region: {},
    isFocused: false,
    user: null,
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params) {
      console.log(params.user.location);
      this.setState({
        region: params.user.location,
        user: params.user,
      });
    } else {
      this.getInitialState();
    }
  }

  getInitialState = async () => {
    const permission = await Permissions.askAsync(Permissions.LOCATION);

    if (permission.status === "granted") {
      getLocation().then((data) => {
        this.updateState({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      });
    }
  };

  updateState = async (location) => {
    let loc = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    let fullLocation = await Location.reverseGeocodeAsync(loc);

    this.setState({
      region: {
        latitude: location.latitude,
        longitude: location.longitude,
        city: fullLocation[0].city,
        country: fullLocation[0].country,
        isoCountryCode: fullLocation[0].isoCountryCode,
        name: fullLocation[0].name,
        postalCode: fullLocation[0].postalCode,
        region: fullLocation[0].region,
        street: fullLocation[0].street,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
    });
  };

  onFocusChange = () => {
    this.setState({ isFocused: true });
  };

  setLocation = async () => {
    await updateLocationUser(this.state.user, this.state.region);
    this.props.getUser(this.state.user.uid, "LOGIN");
    console.log("save locatio");
    this.props.navigation.goBack();
  };

  getCoordsFromName(loc) {
    this.updateState({
      latitude: loc.lat,
      longitude: loc.lng,
    });
  }

  onMapRegionChange(region) {
    console.log("change region");
    this.updateState({
      latitude: region.lat,
      longitude: region.lng,
    });
    //this.props.getUser(this.state.user.uid, "LOGIN");
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 155,
            zIndex: 1,
            position: "absolute",
            left: 0,
            right: 0,
          }}
        >
          <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)} />
        </View>
        {this.state.region && this.state.region["latitude"] ? (
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.center,
                {
                  position: "absolute",
                  alignSelf: "center",
                  bottom: 0,
                  zIndex: 1,
                  marginBottom: 18,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => console.log(this.setLocation())}
              >
                <Text style={styles.primaryButtonText}>
                  Guardar localización
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.user && (
              <MyMapView
                region={this.state.region}
                onRegionChange={(reg) => this.onMapRegionChange(reg)}
              />
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
