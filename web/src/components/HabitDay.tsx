import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';
import dayjs from 'dayjs';
import { HabitsList } from './HabitDayPopover';

interface HabitDayProps {
    date: Date
    defaulCompleted?: number
    amount?: number
    
}

export function HabitDay({defaulCompleted = 0, amount = 0, date}: HabitDayProps){
    const [completed, setCompleted] = useState(defaulCompleted)
    const completedPercentage = amount > 0 ? Math.round( (completed / amount) * 100) : 0

    const dayAndMouth = dayjs(date).format('DD/MM')
    const dayOfWeek = dayjs(date).format('dddd')

    function handleCompletedChanged(completed: number){
        setCompleted(completed)
        // console.log(completed)
    }
    return (
        <Popover.Root>
            <Popover.Trigger className={clsx('w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background',{
                'bg-zinc-900 border-zinc-700': completedPercentage == 0,
                'bg-violet-900 border-violet-700': completedPercentage >   0 && completedPercentage < 20,
                'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
                'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
                'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
                'bg-violet-500 border-violet-400': completedPercentage >= 80 && completedPercentage < 100,
                'bg-violet-400 border-violet-300': completedPercentage == 100,
            })} />
            <Popover.Portal>
                <Popover.Content
                    className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                        <span className='font-semibold text-zinc-400'>{dayOfWeek}</span>
                        <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayAndMouth}</span>
                        <ProgressBar progress={completedPercentage} />
                            <HabitsList 
                                onCompletedChange={handleCompletedChanged}
                                date={date}/>
                        <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}