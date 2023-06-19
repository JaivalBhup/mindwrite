import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, FlatList, TouchableOpacity, Animated, Easing,Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useIsFocused } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RNFS from 'react-native-fs';
const audioRecorderPlayer = new AudioRecorderPlayer();
export default function MindWrites({navigation}) {
  const isFocused = useIsFocused();
  const [files, setFiles] = useState({})
  const [selectedMp3, setSelectedMp3] = useState(null)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setCurrentDurationSec] = useState(0)
  const [playTime, setPlayTime] = useState("00:00:00")
  const [duration, setDuration] = useState("00:00:00")
  const [playing, setPlaying] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [copySelected, setCopySelected] = useState(false);
  const path = RNFS.CachesDirectoryPath+"/mindwrite";
  const scale = useRef(new Animated.Value(0)).current

  useEffect(()=>{
    if(isFocused){
        RNFS.readDir(path).then(e=>{
          var mp3s = {}
          for(let file of e){
            if(file.name.split('.')[1] == 'm4a'){
              mp3s[file.name] = file
            }

          }
          setFiles(mp3s)
        })
      }
  },[isFocused])
  const deleteFile = (name)=>{
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to permenently delete '+name, 
      [
        {text: 'Confirm', onPress: () => {
          RNFS.unlink(path+"/"+name+".m4a").then(() => {
            RNFS.unlink(RNFS.DocumentDirectoryPath+"/"+name+".txt").then(()=>{
              var mapp = files
              delete mapp[name+".m4a"]
              setFiles(mapp)
              setRefresh(!refresh)
            })
          })
        }},
        {text: 'Deny', onPress: () => console.log('Denied')},
      ],
      {cancelable: false},
    );
  }
  const copy = (name) => {
    console.log(name)
    setCopySelected(true)
    setTimeout(()=>{setCopySelected(false)},2000)
  }
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
  const valueChanged  = async(val)=>{
    await onStartPlay(files[selectedMp3].name)
    seekTo(val)
  }
  const seekTo= async (val)=>{
    audioRecorderPlayer.seekToPlayer(val)
  }
  const resumePlayer = async () => {
    audioRecorderPlayer.resumePlayer();
  }

  const selectFile = (item) => {
    setCurrentPositionSec(0)
    setCurrentDurationSec(0)
    setPlayTime("00:00:00")
    setDuration("00:00:00")
    onStopPlay()
    Animated.timing(scale, {toValue:0,easing:Easing.linear,duration:100, useNativeDriver:true}).start()
    setTimeout(()=>{
      setSelectedMp3(item)

      Animated.timing(scale, {toValue:1,easing:Easing.linear,duration:100, useNativeDriver:true}).start()
    },200)
  }
  return (
    <SafeAreaView style={{backgroundColor: '#fff', width:"100%", height:"100%"}}>
      <Text style={{
        fontSize: 30,
        // fontFamily: "RobotoSerif-Bold",
        color:"#000",
        margin:10,
        fontWeight:"bold"
      }}>Your MindWrites</Text>
      <FlatList
          style={styles.list}
          data={Object.keys(files)}
          renderItem={({item}) => (
            <>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <View  style={{backgroundColor:"white", height:50, justifyContent: "space-between",width:"100%",display: 'flex', flexDirection: 'row'}}>

              <TouchableOpacity 
              style={{width:item == selectedMp3?"70%":"100%", paddingLeft:10}}
              onPress={()=>selectFile(item)}
              // onPress={()=>{navigation.navigate('MindWrite',{file:item.name})}}
              >
                <Text style={{fontSize:20, fontWeight:400}}> {files[item].name.split('.')[0]}</Text>


              </TouchableOpacity>
              {item == selectedMp3?( <TouchableOpacity 
              onPress={()=>{navigation.navigate('MindWrite',{file:files[item].name})}}
              >
                <Ionicons name={"information-circle-outline"} size={30} color={"gray"} style={{...styles.playPause,paddingRight:10}}/>
              </TouchableOpacity>):
              (<TouchableOpacity><Text style={{fontSize:17, fontWeight:200}}>{files[item].ctime.toDateString()}</Text></TouchableOpacity>)}
             
              </View>
              {item == selectedMp3?(
                <Animated.View style={{borderBottomWidth:1, borderBottomColor:"lightgray",flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent:"center", transform:[{scaleY:scale}], marginBottom:20}}>


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
                      <View
                        style={{ 
                          width:"33%",
                          flexDirection:"row",
                          justifyContent:"center",
                        }}
                      >
                                        
                        {copySelected?(
                           <TouchableOpacity onPress={()=>{copy(item)}} style={{...styles.playPause}}>
                           <Ionicons name={"checkmark-done-outline"} size={30} color={"gray"} />
                                   </TouchableOpacity>
                        ):(
 <TouchableOpacity onPress={()=>{copy(item)}} style={{...styles.playPause}}>
 <Ionicons name={"copy-outline"} size={30} color={"gray"} />
         </TouchableOpacity>
                        )}
                       
                        </View>
                              <View
                        style={{ 
                          width:"33%",
                          flexDirection:"row",
                          justifyContent:"center",
                        }}
                      ><TouchableOpacity onPress={()=>playing?onPausePlay():onStartPlay(files[item].name)} style={{...styles.playPause}}>
                      <Ionicons name={playing?"pause":"play"} size={30} color={"gray"} />
                              </TouchableOpacity></View>
                              <View
                        style={{ 
                          width:"33%",
                          flexDirection:"row",
                          justifyContent:"center",

                        }}
                      ><TouchableOpacity onPress={()=>deleteFile(item.split(".")[0])} style={{...styles.playPause}}>
                      <Ionicons name={"trash"} size={30} color={"gray"} />
                              </TouchableOpacity></View>
                    
                    </View>

                  </Animated.View>

              ):(<View style={{borderBottomWidth:1, borderBottomColor:"lightgray", width:"100%", marginBottom:20}}></View>)}
              


          </View>
                      </>
            )}
          keyExtractor={item => item}
          extraData={refresh}
      />
      </SafeAreaView>
  );
}


const hr = () => {
  return (
    <View
  style={{
    marginTop:10,
    marginBottom:10,
    borderBottomColor: 'red',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }}
/>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list:{
    marginTop:20
  },
  slider_view:{

    width:"100%",
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-evenly",
  },
  slider_style:{
    height:"70%",
    width:"60%"
  },
  slider_time:{
    fontSize:15,
    color:"#808080"
  },buttons:{
    height:50,
    width:"100%",
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-evenly",
  },
  playPause:{
    alignItems:"center",
    alignItems:"center",
  }
});
