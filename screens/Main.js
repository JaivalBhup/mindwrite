import  React, {useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MindWrites from './MindWrites';
import Record from './Record';
const Tab = createBottomTabNavigator();
const App =  ({navigation}) => {
		return (
			<Tab.Navigator 
			screenOptions={({ route }) => ({
				tabBarStyle:[{ 
					// position: "absolute",
					// bottom:15,
					// left:20,
					// right:20,
					// elevation:0,
					// backgroundColor:"#fff",
					// borderRadius:30,
					// height:90,
					// paddingBottom:6,
				}],
				tabBarIcon: ({ focused, color, size }) => {
				  let iconName;
	  
				  if (route.name === 'Record') {
					iconName = focused
					  ? 'mic'
					  : 'mic-outline';
				  } else if (route.name === 'MindWrites') {
					iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
				  }
	  
				  // You can return any component that you like here!
				  return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: '#1987ff',
				tabBarInactiveTintColor: 'gray',
			  })}
			
			>
			  <Tab.Screen name="Record" component={Record} options={{headerShown:false}}/>
			  <Tab.Screen name="MindWrites" component={MindWrites} options={{headerShown:false}}/>
			</Tab.Navigator>
			);
  };

export default App;





