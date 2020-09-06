import React from 'react';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons'
import HomeScreen from '../screens/Home'
import SinglePostScreen from '../screens/SinglePost'
import SearchScreen from '../screens/Search'
import PostScreen from '../screens/Post'
import ActivityScreen from '../screens/Activity'
import ProfileScreen from '../screens/Profile'
import AccountScreen from '../screens/Account'
import CameraScreen from '../screens/Camera'
import MapScreen from '../screens/Map'
import DonateScreen from '../screens/Donate'
import EditScreen from '../screens/Signup'
import CommentScreen from '../screens/Comment'
import ChatScreen from '../screens/Chat'
import MessagesScreen from '../screens/Conversations'
import PendingScreen from "../screens/Pending";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { TouchableOpacity, Image, Text, Platform } from 'react-native'
import styles from '../styles'

export const HomeNavigator = createAppContainer(createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: (
          <>
            {/*<Image style={{ width: 120, height: 35 }} source={require('../assets/timelend.png')} />*/}
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>Favors</Text>
          </>
        ),
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.navigate('Post')} >
            <Feather style={[{ marginLeft: 12 }, styles.darkGray]} name={'edit'} size={25} />
          </TouchableOpacity>
        ),
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate('Search')} >
            <Ionicons style={[{ marginRight: 12 }, styles.darkGray]} name='md-search' size={25} />
          </TouchableOpacity>
        ),
        /*headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate('Messages')} >
            {navigation.getParam('newMessages') ? (
              <FontAwesome name="circle" size={15} style={{ color: 'red', marginRight: -7, marginBottom: -7 }} />
            ) : null}
            <Ionicons style={[{ marginRight: 12 }, styles.darkGray]} name='ios-search' size={25} />
          </TouchableOpacity>
        ),*/
      })
    },
    SinglePost: {
      screen: SinglePostScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Post',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Comment: {
      screen: CommentScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Comentarios',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Busca tus vecinos',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name='ios-arrow-back' size={30} />
          </TouchableOpacity>
        )
      })
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        title: null,
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Donate: {
      screen: DonateScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Pagar',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    PendingChat: {
      screen: PendingScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Pendiente',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack() } >
            <Ionicons style={[styles.icon, { marginLeft: 12}]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    }
  }, {
    defaultNavigationOptions: {
      headerForceInset: Platform.select({
        android: { top: "never", bottom: "never" }
      })
    }
  }
));

HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.routes.some(route => route.routeName === 'Camera')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Profile')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Comment')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'SinglePost')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Donate')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Messages')) {
    tabBarVisible = true
  }
  if (navigation.state.routes.some(route => route.routeName === 'Search')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Chat')) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

export const SearchNavigator = createAppContainer(createStackNavigator(
  {
    Search: {
      screen: SearchScreen,
      navigationOptions: ({navigation}) => ({
        title: 'Busca tus vecinos',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name='ios-arrow-back' size={30} />
          </TouchableOpacity>
        )
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Donate: {
      screen: DonateScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Pagar',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: ({ navigation }) => ({
        title: null,
      })
    },
  }, {
    defaultNavigationOptions: {
      headerForceInset: Platform.select({
        android: { top: "never", bottom: "never" }
      })
    }
  }
));

SearchNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.routes.some(route => route.routeName === 'Donate')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Chat')) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

export const PostNavigator = createAppContainer(createStackNavigator(
  {
    Post: {
      screen: PostScreen,
    },
    Camera: {
      screen: CameraScreen,
      navigationOptions: {
        header: null
      }
    }
  }, {
    defaultNavigationOptions: {
      headerForceInset: Platform.select({
        android: { top: "never", bottom: "never" }
      })
    }
  }
));

export const ActivityNavigator = createAppContainer(createStackNavigator(
  {
    Activity: {
      screen: ActivityScreen,
      navigationOptions: ({navigation}) => ({
        title: `Tiempo disponible: ${navigation.getParam('hours')} h ${navigation.getParam('minutes')} m`
        
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
  }, {
    defaultNavigationOptions: {
      headerForceInset: Platform.select({
        android: { top: "never", bottom: "never" }
      })
    }
  }
));

ActivityNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.routes.some(route => route.routeName === 'Profile')) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

export const ProfileNavigator = createAppContainer(createStackNavigator(
  {
    MyProfile: {
      screen: AccountScreen,
      navigationOptions: {
        title: 'Mi Perfil',        
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Perfil',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Editar Perfil',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
    Map: {
      screen: MapScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Map',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons style={[styles.icon, { marginLeft: 12 }]} name={'ios-arrow-back'} size={30} />
          </TouchableOpacity>
        )
      })
    },
  }, {
    defaultNavigationOptions: {
      headerForceInset: Platform.select({
        android: { top: "never", bottom: "never" }
      })
    }
  }
));

ProfileNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.routes.some(route => route.routeName === 'Map')) {
    tabBarVisible = false
  }
  if (navigation.state.routes.some(route => route.routeName === 'Profile')) {
    tabBarVisible = false
  }
  return {
    tabBarVisible,
  }
}

export const MessageNavigation = createAppContainer(createStackNavigator({
  Message: {
    screen: MessagesScreen,
    navigationOptions: {
      title: 'Conversaciones'
    }
  }, 
  Chat: {
    screen: ChatScreen,
    navigationOptions: ({ navigation }) => ({
      title: null,
    })
  },
  PendingChat: {
    screen: PendingScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Pendiente',
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack() } >
          <Ionicons style={[styles.icon, { marginLeft: 12}]} name={'ios-arrow-back'} size={30} />
        </TouchableOpacity>
      )
    })
  }
}, {
  defaultNavigationOptions: {
    headerForceInset: Platform.select({
      android: { top: "never", bottom: "never" }
    })
  }
}))

MessageNavigation.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.routes.some(route => route.routeName == 'Chat')){
    tabBarVisible = false
  } else if (navigation.state.routes.some(route => route.routeName == 'PendingChat')){
    tabBarVisible = false
  }
  return {
    tabBarVisible
  }
}