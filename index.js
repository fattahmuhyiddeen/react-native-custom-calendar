import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const Icon = <View style={{ backgroundColor: 'white', height: 20, width: 20 }} />

const frmt = n => String(n).padStart(2, '0');

const Calendar = ({
  monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dayList = ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  // startDay = 3, // which index from daylist array to start
  leftIcon,
  rightIcon,
  markedDates,
  onMonthChange,
  onDayPress,
  maxDate,
  style = {}
}) => {
  const today = new Date();

  const [{ month, year }, setMonthYear] = useState({ month: today.getMonth(), year: today.getFullYear() })

  const prevMonthYear = () => {
    const prev = month - 1;
    return { year: year - (prev < 0 ? 1 : 0), month: prev < 0 ? 11 : prev }
  }
  const nextMonthYear = () => {
    const next = month + 1;
    return { year: year + (next > 11 ? 1 : 0), month: next > 11 ? 0 : next }
  }

  const gotoPrevMonth = () => {
    const data = prevMonthYear();
    onMonthChange(data.year + "-" + frmt(data.month + 1) + "-" + frmt(today.getDate()))
    setMonthYear(data)
  }

  const gotoNextMonth = () => {
    const data = nextMonthYear();
    onMonthChange(data.year + "-" + frmt(data.month + 1) + "-" + frmt(today.getDate()))
    setMonthYear(data)
  }

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const lastDayLastMonth = new Date(year, month, 0);
  const numOfDaysToShowFromLastMonth = (firstDay.getDay() || 7) - 1
  const numOfDaysToShowFromNextMonth = 7 - lastDay.getDay()
  const dateList = [
    // need to find how to deduct with startDay
    ...numOfDaysToShowFromLastMonth > 0 ? [...Array(numOfDaysToShowFromLastMonth).keys()].reverse().map(i => ({ date: lastDayLastMonth.getDate() - i, ...prevMonthYear() })) : [],
    ...Array.from({ length: lastDay.getDate() }, (_, i) => ({ date: i + 1, month, year })),
    ...numOfDaysToShowFromNextMonth > 0 && numOfDaysToShowFromNextMonth < 7 ? Array.from({ length: numOfDaysToShowFromNextMonth }, (_, i) => ({ date: i + 1, ...nextMonthYear })) : [],
  ]

  const weekList = [...Array(Math.ceil(dateList.length / 7)).keys()].reduce((p, i) => [...p, dateList.slice(i * 7, 7 + (i * 7))], [])

  return (
    <View>
      <View style={{ ...styles.headerContainer, ...style.header }}>
        <Button onPress={gotoPrevMonth}>{leftIcon || Icon}</Button>
        <Text style={styles.title}>{monthList[month]} {year}</Text>
        <Button onPress={gotoNextMonth} disabled={maxDate?.getMonth() <= month && maxDate?.getFullYear() <= year}>{rightIcon || Icon}</Button>
      </View>
      <View style={styles.dayContainer}>
        {dayList.map(d => <Text style={styles.dayCell}>{d}</Text>)}
        {/* {[...dayList.slice(startDay), ...dayList.slice(0, startDay)].map(d => <Text style={styles.dayCell}>{d}</Text>)} */}
      </View>
      {weekList.map(w =>
        <View style={styles.weekRowContainer}>
          {w.map(d => {
            const fulldate = d.year + "-" + frmt(d.month + 1) + "-" + frmt(d.date);
            const data = markedDates?.[fulldate] || {};
            return <Button style={styles.pressableContainer} onPress={() => onDayPress?.(fulldate)}>
              <View style={{ ...styles.circleDay, opacity: d.month === month ? 1 : .2, backgroundColor: data.color }}>
                <Text style={{ color: data.textColor }}>{d.date}</Text>
              </View>
            </Button>
          })}
        </View>)}
    </View>
  )
}
export default Calendar;

const styles = StyleSheet.create({
  title: { textAlign: 'center', fontWeight: 'bold', color: 'white' },
  dayContainer: { flexDirection: 'row', backgroundColor: "#EBEBEB" },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10
  },
  pressableContainer: { flex: 1, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' },
  circleDay: {
    borderRadius: '50%', width: 25, height: 25, alignItems: 'center', justifyContent: 'center'
  },
  dayCell: { flex: 1, textAlign: 'center', paddingVertical: 5 },
  weekRowContainer: { flexDirection: 'row', justifyContent: 'space-between' },
})


const Button = (props) => {
  const [opacity, set] = useState(1)
  return (
    <Pressable
      onPressIn={() => set(0.5)}
      onPressOut={() => set(1)}
      {...props}
      style={{ ...props.style, opacity: props.disabled ? .5 : opacity }}
    />
  );
};