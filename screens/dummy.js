import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, FlatList } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
const audioRecorderPlayer = new AudioRecorderPlayer();


const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);


export default function App() {
  const [recordSecs, setRecordSecs] = useState(0)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setCurrentDurationSec] = useState(0)
  const [recordTime, setRecordTime] = useState("00:00:00")
  const [playTime, setPlayTime] = useState("00:00:00")
  const [duration, setDuration] = useState("00:00:00")
  const [files, setFiles] = useState([])
  const [newFile, setNewFile] = useState('mindwrite')
  const path = RNFS.CachesDirectoryPath+"/mindwrite";
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
          var mp3s = []
          for(let file of e){
            if(file.name.split('.')[1] == 'm4a'){
              mp3s.push(file)
              if(count == 0){
                count = parseInt(file.name.split('.')[0][file.name.split('.')[0].length-1])
              }else{
                var newCount = parseInt(file.name.split('.')[0][file.name.split('.')[0].length-1])
                if(newCount>count){
                  count = newCount
                }
              }
            }

          }
          setFiles(mp3s)
          setNewFile("mindwrite"+(count+1))
        })
  },[])
  const onStartRecord = async () => {

    const result = await audioRecorderPlayer.startRecorder("/mindwrite/"+newFile+".m4a");
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition)
      setRecordTime(audioRecorderPlayer.mmssss(
        Math.floor(e.currentPosition),))
    });
    console.log(result);
  };
  
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0)
    console.log(result);
    RNFS.readDir(path).then(e=>{
      var mp3s = []

      var count = 0
      for(let file of e){
        if(file.name.split('.')[1] == 'm4a'){
          mp3s.push(file)
          if(count == 0){
            count = parseInt(file.name.split('.')[0][file.name.split('.')[0].length-1])
          }else{
            var newCount = parseInt(file.name.split('.')[0][file.name.split('.')[0].length-1])
            if(newCount>count){
              count = newCount
            }
          }
        }
       
      }
      setFiles(mp3s)
      setNewFile("mindwrite"+(count+1))
    })
  };
  
  const onStartPlay = async (name) => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer("/mindwrite/"+name);
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)))
      setCurrentPositionSec(e.currentPosition)
      setCurrentDurationSec(e.duration)
    });
  };
  
  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };
  
  const onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
  return (
    <SafeAreaView style={{backgroundColor: '#fff', width:"100%", height:"100%"}}>
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}>
          <Text>{recordTime}{"\n"}</Text>

          <Button title="Record" onPress={() => onStartRecord()} />
          <Button
            title="Stop"
            onPress={() => onStopRecord()}
          />
      </View>
      <Text>{"\n"}{playTime} / {duration}{"\n"}</Text>
      <FlatList
          data={files}
          renderItem={({item}) => (
          <View style={{marginBottom:20, backgroundColor:"gray"}}>
            <Item title={item.name.split('.')[0]} />
            <View style={{flexDirection: 'row'}}>
            <Button
              title="Play"
                onPress={() => onStartPlay(item.name)}
              />
              <Button
              title="Pause"
                onPress={() => onPausePlay()}
              />
              <Button
              title="Stop"
                onPress={() => onStopPlay()}
              />
            </View>
            
          </View>
            )}
          keyExtractor={item => item.ctime}
      />
      </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
