import * as Location from "expo-location";

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (data) => resolve(data.coords),
      (err) => reject(err)
    );
  });
};

export const getLocationCurrent = async () => {
  const timeout = new Promise((resolve, reject) => {
    return setTimeout(() => reject(new Error("Location timeout")), 20 * 1000);
  });
  const locationPromise = Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  const locations = await Promise.race([locationPromise, timeout]);
  let fullLocation = await Location.reverseGeocodeAsync({
    latitude: locations.coords.latitude,
    longitude: locations.coords.longitude,
  });
  const location = {
    latitude: locations.coords.latitude,
    longitude: locations.coords.longitude,
    city: fullLocation[0].city,
    country: fullLocation[0].country,
    isoCountryCode: fullLocation[0].isoCountryCode,
    name: fullLocation[0].name,
    postalCode: fullLocation[0].postalCode,
    region: fullLocation[0].region,
    street: fullLocation[0].street,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  };
  return location;
};
