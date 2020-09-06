import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACES_API_KEY } from 'react-native-dotenv'

class MapInput extends React.Component {
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder='Buscar'
        minLength={2}
        autoFocus={false}
        returnKeyType={'search'}
        listViewDisplayed={false}
        fetchDetails={true}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.props.notifyChange(details.geometry.location);
          }
        }
        nearbyPlacesAPI='GooglePlacesSearch'
        debounce={200}
        styles={{
          container: {
            zIndex: 1, 
            position: 'absolute', 
            left: 0, 
            right: 0
          },
          textInputContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            padding: 8
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            borderWidth: .5,
            borderColor: 'gray',
            height: 36,
            color: '#5d5d5d',
            fontSize: 16
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
            zIndex: 4,
            backgroundColor: '#ffffff',
          },
          listView: {
            marginTop: 14,
            backgroundColor: '#ffffff',
            borderRadius: 13,
            marginLeft: 8,
            marginRight: 8
          },
          poweredContainer: {
            display: 'none'
          }
        }}
        currentLocation={false}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'es'
        }}
      />
    );
  }
}
export default MapInput;