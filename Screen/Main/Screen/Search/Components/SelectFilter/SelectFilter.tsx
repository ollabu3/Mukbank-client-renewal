/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, List} from 'react-native-paper';
import {View, ScrollView, ToastAndroid} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import styles from './SelectFilterStyles';
import ChipList from './Components/ChipList';
import SelectedChip from './Components/SelectedChip';
import {ChipListData} from './Components/ChipListData';

type NavigationProp = StackNavigationProp<MainStackNaviParamList>;

interface ChipData {
  name: string;
  isSelected: boolean;
}

interface SelectFilterProps {
  navigation: NavigationProp;
  location: {latitude: number; longitude: number};
}

function SelectFilter({location, navigation}: SelectFilterProps) {
  const [chipListData] = useState<ChipData[]>(ChipListData); // 기존 선택사항 chip들
  const [select, setSelect] = useState<string[]>([]); // 선택된 chip의 name들
  const [canceledChip, setCanceledChip] = useState<string>(''); // SelectedChip에서 취소된 chip의 name 표시

  const sendFilterText = () => {
    if (select.length === 0) {
      // 필터 선택 한 것 없을 때
      ToastAndroid.showWithGravity(
        '필터를 선택 해 주세요.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      const filterText: string = select.join(', ');
      axios
        .post('http://192.168.0.4:5001/restaurant/selectFilter', {
          latitude: location.latitude, // 37.570652,
          longitude: location.longitude, // 127.007307,
          filterText: filterText,
        })
        .catch((error) => console.log(error));
      navigation.navigate('SearchList');
    }
  };

  useEffect(() => {
    // cancelChip과 chipListData[i].name이 같다면 chipListData[i].isSelected = false
    const toggleChips = () => {
      chipListData.forEach((curr: ChipData) => {
        if (canceledChip === curr.name) {
          curr.isSelected = false;
        }
      });
    };
    toggleChips();
  }, [canceledChip]);

  return (
    <>
      <View style={styles.selectedChipView as any}>
        <View style={styles.selectedChip as any}>
          <ScrollView horizontal={true}>
            {select.map((list: string) => (
              <SelectedChip
                key={JSON.stringify(list)}
                list={list}
                select={select}
                setSelect={setSelect}
                setCanceledChip={setCanceledChip}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.selectedChipBtnView as any}>
          <Button
            style={styles.selectedChipBtn}
            mode="contained"
            onPress={() => sendFilterText()}>
            검색
          </Button>
        </View>
      </View>

      <View style={styles.chipView as any}>
        <List.Section title="필터" style={styles.chipListTitle as any}>
          <View style={styles.row as any}>
            {chipListData.map((list: ChipData) => (
              <ChipList
                key={JSON.stringify(list)}
                list={list}
                select={select}
                setSelect={setSelect}
              />
            ))}
          </View>
        </List.Section>
      </View>
    </>
  );
}
export default SelectFilter;
