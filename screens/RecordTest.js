import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, FlatList, TextInput, Animated, ScrollView } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
const audioRecorderPlayer = new AudioRecorderPlayer();
export default function Record() {
  const [recordSecs, setRecordSecs] = useState(0)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setCurrentDurationSec] = useState(0)
  const [recordTime, setRecordTime] = useState("00:00:00")
  const [playTime, setPlayTime] = useState("00:00:00")
  const [duration, setDuration] = useState("00:00:00")
  const [files, setFiles] = useState([])
  const [newFile, setNewFile] = useState('mindwrite')
  const [soundView, setSoundView] = useState([]);
  const [db, setDb] = useState(0)
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState("");
  const [partialResults, setPartialResults] = useState([]);
  const path = RNFS.CachesDirectoryPath+"/mindwrite";
  const documentPath = RNFS.DocumentDirectoryPath;
  const scale = useRef(new Animated.Value(1)).current
  useEffect(()=>{
	setInterval(()=>{
		var xVal = new Animated.Value(0)
		Animated.timing(xVal, {toValue:-150,useNativeDriver:true, duration:400}).start()
		arr = soundView
		arr.push({id: new Date().getTime(), xVal})
		setSoundView(arr)
	},1000)
      RNFS.exists(path)
        .then(e=>{
          if(!e){
            RNFS.mkdir(path).then(e=>{console.log("Path Created")})
          }else{
            console.log('Folder exisits')
          }
        })
        RNFS.readDir(path).then(e=>{
          var count = 0
          for(let file of e){
            if(file.name.split('.')[1] == 'm4a'){
              if(count == 0){
                count = parseInt(file.name.split('.')[0].replace('mindwrite',''))
              }else{
                var newCount = parseInt(file.name.split('.')[0].replace('mindwrite',''))
                if(newCount>count){
                  count = newCount
                }
              }
            }

          }
          setNewFile("mindwrite"+(count+1))
        })
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeC;
  },[])


  const  onSpeechStart = (e) => {
    console.log('jhdkkajs')
    setStarted('True')
};

const onSpeechVolumeC = (e) => {
  var s = ((e.value)/2) + 1
  if(e.value >5){
    Animated.sequence([
      Animated.spring(scale, {useNativeDriver:true, toValue:2, duration:1}),
    ]).start()
  }else{
    Animated.sequence([
      Animated.spring(scale, {useNativeDriver:true, toValue:1.5, duration:1}),
      Animated.spring(scale, {useNativeDriver:true, toValue:0.5, duration:1}),
    ]).start()
  }
  setDb(e.value)
}
const onSpeechEnd = () => {
  Animated.spring(scale, {useNativeDriver:true, toValue:1, duration:1}).start()
  setDb(0)
    setStarted(null);
    setEnd('True');
};
const onSpeechError = (e) => {
    setError(JSON.stringify(e.error));
};
const onSpeechResults = (e) => {
    setResults("    "+e.value[0])
};
const onSpeechPartialResults = (e) => {
    setPartialResults(e.value)
};
const onSpeechVolumeChanged = (e) => {
    setPitch(e.value)
};


  const onStartRecord = async () => {

    const result = await audioRecorderPlayer.startRecorder("/mindwrite/"+newFile+".m4a");
    try{
    await Voice.start('en-US');
    }catch(e){
      console.log(e)
    } 
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition)
      setRecordTime(audioRecorderPlayer.mmssss(
        Math.floor(e.currentPosition),))
    });
    console.log(result);
  };
  
  const onStopRecord = async () => {
    Animated.spring(scale, {useNativeDriver:true, toValue:1, duration:1}).start()
    setDb(0)
      setStarted(null);
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    try{
      await Voice.destroy()
      }catch(e){
        console.log(e)
      }
    setRecordSecs(0)
    await RNFS.writeFile(documentPath+"/"+newFile+".txt", results)
    setResults("")
    RNFS.readDir(path).then(e=>{
      var count = 0
      for(let file of e){
        if(file.name.split('.')[1] == 'm4a'){
          if(count == 0){
            count = parseInt(file.name.split('.')[0].replace('mindwrite',''))
          }else{
            var newCount = parseInt(file.name.split('.')[0].replace('mindwrite',''))
            if(newCount>count){
              count = newCount
            }
          }
        }
       
      }
      setNewFile("mindwrite"+(count+1))
    })
  };
  return (
    <SafeAreaView style={{backgroundColor: '#fff', width:"100%", height:"100%"}}>
        <Text style={styles.results} >
          {results}
        </Text>

    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent:"center"}}>
  
          <Button
            title="Stop"
            onPress={() => onStopRecord()}
          />
           
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {/* {soundView.map((item)=>{
        return (
            <View key={item.id} style={{...styles.sound, backgroundColor:"black",height:20, transform:[{translateX:item.xVal}]}}/> 

        )
      })} */}
	  		{soundView.map(item=>{
			return <Animated.View key={item.id} style={{...styles.sound, height:49, backgroundColor:"black",transform:[{translateX:item.xVal}]}}/>
		})}
    
    <Animated.View style={{...styles.sound1,borderRadius:75, backgroundColor:"black",transform:[{scale}]}}>
      <TouchableOpacity onPress={()=>onStartRecord()} style={{...styles.recButton, borderRadius:75, backgroundColor:"white"}}>
      <Ionicons style={{
        marginLeft:5
      }} name={"mic-outline"} size={80} color={"black"} />
      </TouchableOpacity>
    </Animated.View>
    
    </View>
    <View style={{}}><Text>{recordTime}</Text></View>

    {/* <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center'}}> */}
        {/* <View style={{ flex: 1,flexDirection: 'row', alignItems: 'center', justifyContent: 'center', maxHeight:100 }}>
          <View style={{...styles.sound, backgroundColor:"black",height:(((45*db)/10)+2)}}></View>
          <View style={{...styles.sound, backgroundColor:"black",height:(((65*db)/10)+3)}}></View>
          <View style={{...styles.sound, backgroundColor:"black",height:(((105*db)/10)+5)}}></View>
          <View style={{...styles.sound, backgroundColor:"black",height:(((65*db)/10)+3)}}></View>
          <View style={{...styles.sound, backgroundColor:"black",height:(((45*db)/10)+2)}}></View>
        </View> */}
    {/* </View> */}
		
      </View>
      </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, input: {
    width:200,
    borderWidth:1,
    borderColor:"gray",
    borderRadius:4,
    height:200
},
sound:{
  width:5,
  marginLeft:2,
  borderRadius:3
}
,
sound1:{
  width:150,
  height:150,
  marginLeft:2,
  borderRadius:3
}, recButton:{
  width:150,
  height:150,
  alignContent: 'center', 
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:"white",
  borderWidth:1,
  borderColor:"gray",

}, pauseButton:{
  width:50,
  height:50,
  alignContent: 'center', 
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:"red",
},results:{
  height:350,
  width:"100%",
  fontSize:30,
  fontFamily:"Helvetica Neue",
}
}); 
