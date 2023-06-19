import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

const audioRecorderPlayer = new AudioRecorderPlayer();
const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);


export default function MindWrite({navigation, route}) {

  const [recordSecs, setRecordSecs] = useState(0)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setCurrentDurationSec] = useState(0)
  const [recordTime, setRecordTime] = useState("00:00:00")
  const [playTime, setPlayTime] = useState("00:00:00")
  const [duration, setDuration] = useState("00:00:00")
  const [file, setFile] = useState({})
  const [name, setName] = useState("Loading...")
  const [newName, setNewName] = useState("Loading...")
  const [newFile, setNewFile] = useState('mindwrite')
  const [text, setText] = useState("");
  const [playing, setPlaying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [input, setInput] = useState(null);
  const inputRef = React.useRef(null);
  const path = RNFS.CachesDirectoryPath+"/mindwrite";
  const documentPath = RNFS.DocumentDirectoryPath;
  useEffect(()=>{
	if(RNFS.exists(path+"/"+route.params.file)){
		RNFS.stat(path+"/"+route.params.file)
			.then((file)=>{
				setFile(file)
				setName(route.params.file)
				setNewName(route.params.file)
			})
		if(RNFS.exists(documentPath+"/"+route.params.file.split('.')[0]+".txt")){
			RNFS.readFile(documentPath+"/"+route.params.file.split('.')[0]+".txt")
				.then(s=>{
					setText(s)
				})
		}
	}else{
		navigation.goBack()
	}
  },[])
  
  const onStartPlay = async (name) => {
    setPlaying(true)
    if(currentPositionSec>0 && currentPositionSec<currentDurationSec) {
      resumePlayer()
      return;
    }
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer("/mindwrite/"+name);
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)))
      setCurrentPositionSec(e.currentPosition)
      setCurrentDurationSec(e.duration)
      if(e.currentPosition>=e.duration){
        setPlaying(false);
      }
    });
  };
  
  const onPausePlay = async () => {
    setPlaying(false)
    await audioRecorderPlayer.pausePlayer();
  };
  
  const onStopPlay = async () => {
    setPlaying(false)
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
  const resumePlayer = async () => {
    audioRecorderPlayer.resumePlayer();
  }
  const seekTo= async (val)=>{
    audioRecorderPlayer.seekToPlayer(val)
  }
  const valueChanged  = async(val)=>{
    await onStartPlay(name)
    setPlayTime(audioRecorderPlayer.mmssss(Math.floor(val)))
    seekTo(val)
  }
  const navBack=()=>{
    onStopPlay()
    navigation.goBack()
  }
  const startEMode = ()=>{
    setEditMode(true)
    input.focus()
  }
  const edit=  async () =>{
    if(newName == name.split('.')[0])
      return;
    try{
      await RNFS.moveFile(path+"/"+name,path+"/"+newName.split('.')[0]+".m4a")
      await RNFS.moveFile(documentPath+"/"+name.split('.')[0]+".txt",documentPath+"/"+newName.split('.')[0]+".txt")
      setName(newName)
    }catch(e){
      console.log(e)
    }
    setEditMode(false)
  }
  return (
    <SafeAreaView style={{backgroundColor: '#fff', width:"100%", height:"100%"}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between"}}>
     
            <TouchableOpacity style={{marginTop:12}} onPress={() => navBack()}>
         <Ionicons
                  style={{color:"gray"}}
                  name={"chevron-back"}
                  size={30}
                />
                </TouchableOpacity>
      {editMode?(
        <TextInput onChangeText={(r)=>setNewName(r)} value={newName.split('.')[0]} style={{
        fontSize: 30,
        // fontFamily: "RobotoSerif-Bold",
        color:"#000",
        margin:10,
        fontWeight: "bold"
      }}/>
      ):( <Text
      selectTextOnFocus
        onPress={()=> setEditMode(true)}
        style={{
        fontSize: 30,
        // fontFamily: "RobotoSerif-Bold",
        color:"#000",
        margin:10,
        fontWeight: "bold"
      }}>{name.split('.')[0]}</Text>)}
     
        <View style={styles.butList2}>
        {editMode?(
         <TouchableOpacity onPress={() => edit()}>
         <Ionicons
                 style={{color:"gray"}}
                 name={"checkmark"}
                 size={30}
               />
         </TouchableOpacity>
        ):(
          // <TouchableOpacity onPress={() => setEditMode(true)}>
          // <Ionicons
          //         style={{color:"gray"}}
          //         name={"pencil"}
          //         size={30}
          //       />
          // </TouchableOpacity>
          <></>
          )}
        </View>
        </View>
      <TextInput editable={false} style={styles.results} multiline={true}  value={text}/>

    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', justifyContent:"center"}}>


      <View style={styles.slider_view}>
          <Text style={styles.slider_time}> {playTime.split(":")[0]+":"+playTime.split(":")[1]} </Text>
            <Slider
                  style={styles.slider_style}
                  minimumValue={0}
                  maximumValue={currentDurationSec}
                  minimumTrackTintColor="#1987ff"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="white"
                  value={currentPositionSec}
                  onValueChange={val=>valueChanged(val)}
                />
          <Text style={styles.slider_time}>{duration.split(":")[0]+":"+duration.split(":")[1]}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={()=>playing?onPausePlay():onStartPlay(name)} style={{...styles.playPause}}>
          <Ionicons name={playing?"pause":"play"} size={30} color={"gray"} />
                  </TouchableOpacity>
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
  },input: {
    width:200,
    borderWidth:1,
    borderColor:"gray",
    borderRadius:4,
    height:200
},title:{
  fontFamily:"Helvetica",
  fontSize:40,
  marginBottom:30
},  butList2: {
  flex: 1,

  alignItems: "flex-end",
  justifyContent: "center",

  paddingVertical: 5,
  paddingHorizontal: 25,
  width: "100%",
  marginVertical: 1,

  marginHorizontal: "auto",

},
slider_view:{
  height:"10%",
  width:"100%",
  alignItems:"center",
  flexDirection:"row",
  justifyContent:"center",
},
slider_style:{
  height:"70%",
  width:"60%"
},
slider_time:{
  fontSize:15,
  marginLeft:"0%",
  color:"#808080"
},buttons:{
  height:50,
  width:"100%",
  alignItems:"center",
  flexDirection:"row",
  justifyContent:"center",
},
playPause:{
  alignItems:"center",
  alignItems:"center",
}
,results:{
  marginTop:40,
  height:300,
  fontSize:20,
  width:"100%",
  padding:30,

  fontFamily:"Helvetica Neue",
}
});