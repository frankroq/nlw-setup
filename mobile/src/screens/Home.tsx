import { View, Text, ScrollView, Alert } from "react-native";
import { useState, useCallback } from "react";
import { Header } from "../components/Header";
import { DAY_SIZE, HabitDay } from '../components/HabitDay'
import { Loading } from "../components/Loading";
import { api } from '../lib/axios'
import { useNavigation, useFocusEffect} from '@react-navigation/native'

import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning';
import dayjs from "dayjs";

type SummaryProps = Array<{
    id: string
    date: string
    amount: number
    completed: number
}>
const weekDays = ['D','S','T','Q','Q','S','S'];
const datesFromYearStart = generateDatesFromYearBeginning();
const mininumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = mininumSummaryDatesSizes - datesFromYearStart.length;

export function Home(){
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps |null>(null)
    
    async function fetchData(){
        try{
            const response = await api.get('summary')
            setLoading(true)
            setSummary(response.data)
        } catch (error){
            Alert.alert('Ops','Não foi possível carregar o sumário de hábitos.')
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(()=>{
        fetchData()
    },[]))

    if(loading){
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />
            <View
                className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay,i)=>(
                        <Text key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{width: DAY_SIZE}}>
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100 }}>
            {           
            <View className="flex-row flex-wrap">
                {
                    summary &&
                    datesFromYearStart.map(date => {
                        const dayWithHabits = summary.find(day =>{
                            return dayjs(date).isSame(day.date, 'day')
                        })
                        return (
                        <HabitDay
                            amountCompleted={dayWithHabits?.completed}
                            date={date}
                            amountOfHabits={dayWithHabits?.amount}
                            key={date.toISOString()}
                            onPress={() => navigate('habit', {date: date.toISOString()})}
                            />
                        )
                    })
                }
                {
                    amountOfDaysToFill > 0 &&
                    Array.from({ length: amountOfDaysToFill})
                    .map((_, index)=>(
                        <View 
                        key={index}
                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                        style={{ width: DAY_SIZE, height: DAY_SIZE}}
                        ></View>
                    ))
                }
            </View>

        }    
        </ScrollView>
    </View>
)
}