import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, FlatList, TextInput, Animated, ScrollView } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { Easing } from 'react-native';
const audioRecorderPlayer = new AudioRecorderPlayer();
export default function Record() {
  const [recordSecs, setRecordSecs] = useState(0)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setCurrentDurationSec] = useState(0)
  const [recordTime, setRecordTime] = useState("00:00:00")
  const [playTime, setPlayTime] = useState("00:00:00")
  const [duration, setDuration] = useState("00:00:00")
  const [newFile, setNewFile] = useState('mindwrite')
  const [db, setDb] = useState(0)
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState("");
  const [genSa, setGenSa] = useState(false)
  const [tts, setTts] = useState(false)
  const [partialResults, setPartialResults] = useState([]);
  const path = RNFS.CachesDirectoryPath+"/mindwrite";
  const documentPath = RNFS.DocumentDirectoryPath;
  const scale = useRef(new Animated.Value(1)).current
  const scale1 = useRef(new Animated.Value(1)).current
  const scale2 = useRef(new Animated.Value(1)).current
  const scale3 = useRef(new Animated.Value(1)).current
  const scale4 = useRef(new Animated.Value(1)).current
  useEffect(()=>{
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
              count += 1
            }

          }
          setNewFile("New Mindwrite "+(count+1))
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
  var r = 6
  var R = 0.5
  var x = e.value - 1
  var y = ((R/r)*x)
  var output = y + 1

  var R1 = 0.1
  var y1 = ((R1/r)*x)
  var output1 = y1 + 0.1

    Animated.sequence([
      Animated.timing(scale1,{useNativeDriver:true, toValue:output, duration:25,easing:Easing.bounce}),
      Animated.timing(scale2,{useNativeDriver:true, toValue:output-output1, duration:60,easing:Easing.bounce}),
      Animated.timing(scale3,{useNativeDriver:true, toValue:output-(2*output1), duration:95,easing:Easing.bounce}),
      Animated.timing(scale4,{useNativeDriver:true, toValue:output-(3*output1), duration:130,easing:Easing.bounce}),
      Animated.timing(scale1,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
      Animated.timing(scale2,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
      Animated.timing(scale3,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
      Animated.timing(scale4,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
    ]).start()
  // if(e.value >3){

  //   Animated.sequence([
  //     Animated.timing(scale1,{useNativeDriver:true, toValue:2, duration:25,easing:Easing.bounce}),
  //     Animated.timing(scale2,{useNativeDriver:true, toValue:1.75, duration:60,easing:Easing.bounce}),
  //     Animated.timing(scale3,{useNativeDriver:true, toValue:1.5, duration:95,easing:Easing.bounce}),
  //     Animated.timing(scale4,{useNativeDriver:true, toValue:1.25, duration:130,easing:Easing.bounce}),
  //     Animated.timing(scale1,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //     Animated.timing(scale2,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //     Animated.timing(scale3,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //     Animated.timing(scale4,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //   ]).start()
   
  // }else{
  //   Animated.sequence([
  //     Animated.timing(scale1,{useNativeDriver:true, toValue:2, duration:100,easing:Easing.bounce}),
  //     Animated.timing(scale2,{useNativeDriver:true, toValue:1.75, duration:200,easing:Easing.bounce}),
  //     Animated.timing(scale3,{useNativeDriver:true, toValue:1.5, duration:300,easing:Easing.bounce}),
  //     Animated.timing(scale4,{useNativeDriver:true, toValue:1.25, duration:400,easing:Easing.bounce}),
  //     Animated.timing(scale1,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //     Animated.timing(scale2,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //     Animated.timing(scale3,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //     Animated.timing(scale4,{useNativeDriver:true, toValue:1, duration:1,easing:Easing.bounce}),
  //   ]).start()
  //   // Animated.sequence([
  //   //   Animated.spring(scale, {useNativeDriver:true, toValue:2}),
  //   //   Animated.spring(scale, {useNativeDriver:true, toValue:1})
  //   // ]).start()
  // }
  setDb(e.value)
}
const onSpeechEnd = () => {
    setStarted(null);
    setEnd('True');
};
const onSpeechError = (e) => {
    setError(JSON.stringify(e.error));
};
const onSpeechResults = (e) => {
    setResults(e.value[0])
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


  const onStartRecordTest = async () => {

    // const result = await audioRecorderPlayer.startRecorder("/mindwrite/"+newFile+".m4a");
    try{
    await Voice.start('en-US');
    }catch(e){
      console.log(e)
    } 
    // audioRecorderPlayer.addRecordBackListener((e) => {
    //   setRecordSecs(e.currentPosition)
    //   setRecordTime(audioRecorderPlayer.mmssss(
    //     Math.floor(e.currentPosition),))
    // });
    // console.log(result);
  };
  const onStopRecordTest = async () => {

    Animated.spring(scale, {useNativeDriver:true, toValue:1, duration:1}).start()
    setDb(0)
    setStarted(null);
    try{
      await Voice.destroy()
      }catch(e){
        console.log(e)
      }

      setRecordSecs(0)
      setResults("")

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
          count += 1
        }
      }
      setNewFile("New Mindwrite "+(count+1))
    })
  };
  return (
    <SafeAreaView style={{backgroundColor: 'rgb(215,238,235)', width:"100%", height:"100%"}}>


        <View style={{alignItems:"center"}}><Text style={styles.recordTimeText}>{recordTime.replace(/\:/g,".")}</Text></View>
          <View style={{display: 'flex',justifyContent: "space-around",flexDirection: 'column', height: "100%"}}>
          <View  style={{height:"80%"}}>
          <TextInput editable={false} style={{...styles.results, height:"100%"}} multiline={true}  value={results}/>
          </View>
        {/* <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingLeft:20, paddingRight:20}}>
        <View style={{flexDirection:"column", alignItems:"center"}}>
        <TouchableOpacity style={genSa?styles.smBtnGreen:styles.smBtn} onPress={()=> setGenSa(!genSa)}>
          <Ionicons 
            name={"stats-chart-outline"}
            size={30}
          />
          </TouchableOpacity>
          <Text>Speech Analysis</Text>
        </View>
        <View style={{flexDirection:"column", alignItems:"center"}}>
        <TouchableOpacity style={tts?styles.smBtnGreen:styles.smBtn} onPress={()=> setTts(!tts)}>
          <Ionicons 
            name={"receipt-outline"}
            size={30}
          />
          </TouchableOpacity>
          <Text>Speech To Text</Text>
        </View>
      </View> */}
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent:"flex-end", bottom:100}}>
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {/* {soundView.map((item)=>{
        return (
            <View key={item.id} style={{...styles.sound, backgroundColor:"black",height:20, transform:[{translateX:item.xVal}]}}/> 

        )
      })} */}
    <View>
    

    {/* {started=="True"?(<TouchableOpacity onPress={()=>onStopRecordTest()} style={{...styles.stopButton, borderRadius:75, backgroundColor:"white", transform:[{translateX:190},{translateY:30}]}}>
      <Ionicons name={"pause-outline"} size={20} color={"black"} />
      </TouchableOpacity>):<View style={{...styles.stopButton,borderWidth:0 ,borderRadius:75, backgroundColor:"white", transform:[{translateX:140},{translateY:30}]}}></View>} */}
      

      <View style={{...styles.sound1,borderRadius:50, backgroundColor:"white"}}>
    
      <Animated.View style={{...styles.sound1Back,borderRadius:50, backgroundColor:"white",transform:[{scale}], position:"absolute"}}>

      </Animated.View>
      <Animated.View style={{...styles.sound1Back,borderRadius:50,
         backgroundColor:"#666666",
        // borderWidth:2,
        // borderColor:"gray",
         transform:[{scale:scale1}], position:"absolute"}}>

            </Animated.View>
            <Animated.View style={{...styles.sound1Back,borderRadius:50, 
              backgroundColor:"#999999",
              // borderWidth:2,
              // borderColor:"gray",
              transform:[{scale:scale2}], position:"absolute"}}>

            </Animated.View>
            <Animated.View style={{...styles.sound1Back,borderRadius:50, 
              backgroundColor:"#EEEEEE",
              // borderWidth:2,
              // borderColor:"gray",
              transform:[{scale:scale3}], position:"absolute"}}>

            </Animated.View>
            <Animated.View style={{...styles.sound1Back,borderRadius:50, 
              backgroundColor:"#FFFFFF",
              // borderWidth:2,
              // borderColor:"gray",
              transform:[{scale:scale4}], position:"absolute"}}>

            </Animated.View>
                  <TouchableOpacity onPress={()=> started == "True"?onStopRecordTest():onStartRecordTest()} style={{...styles.recButton, borderRadius:75, position:"absolute"}}>
                  <Ionicons style={{
                    
                    marginLeft:8
                  }} name={started == "True"?"stop-circle-outline":"mic-outline"} size={50} color={"black"} />
                  </TouchableOpacity>
    </View> 
     
    
    
    
    </View>

    </View>

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
  width:100,
  height:100,
  marginLeft:2,
  borderRadius:3
},
sound1Back:{
  width:100,
  height:100,
  marginLeft:2,
  borderRadius:3, 
  borderWidth:1,
}, recButton:{
  width:100,
  height:100,
  alignContent: 'center', 
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:"transparent",

},
stopButton:{
  width:40,
  height:40,
  alignContent: 'center', 
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:"transparent",
  borderWidth:1,
  borderColor:"gray"
}, pauseButton:{
  width:50,
  height:50,
  alignContent: 'center', 
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:"red",
},results:{
  marginTop:40,
  height:300,
  fontSize:20,
  width:"90%",
  padding:30,
  borderWidth:1,
  backgroundColor:"rgb(255,255,255)",
  borderRadius:10,
  margin:"5%",
  fontFamily:"Helvetica Neue",
},recordTimeText:{
  fontFamily:"Helvetica Neue",
  fontWeight:"bold",
  fontSize:20
},
label:{
  fontFamily:"Helvetica Neue",
  fontSize:16
},
smBtn:{
  margin:10,
  backgroundColor:"lightgray",
  padding:4,
  borderWidth:2,
  borderColor:"gray",
  borderRadius:10
},
smBtnGreen:{
  margin:10,
  backgroundColor:"lightgreen",
  padding:4,
  borderWidth:2,
  borderColor:"green",
  borderRadius:10
},
smBtnRed:{
  margin:10,
  backgroundColor:"#FFCCCB",
  padding:4,
  borderWidth:2,
  borderColor:"red",
  borderRadius:10
}
}); 
