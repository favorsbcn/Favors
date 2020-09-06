import Reactotron, {
  networking
} from 'reactotron-react-native';

Reactotron.configure({
    host: '192.168.1.5'
  })
  .useReactNative()
  .use(networking())
  .connect();