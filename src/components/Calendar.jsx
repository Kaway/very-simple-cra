import {useReducer, useRef} from 'react'
import './App.css'
import Grid from '@mui/material/Unstable_Grid2';
import {Card, CardContent, IconButton, Typography} from "@mui/material";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import LeftArrowIcon from '@mui/icons-material/ArrowBack';
import RightArrowIcon from '@mui/icons-material/ArrowForward';
import DoneIcon from '@mui/icons-material/Done';
import {Form, useNavigate} from "react-router-dom";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {DATE_KEY_FORMAT} from "../utils.js";
import 'dayjs/locale/fr';

dayjs.locale('fr')
dayjs.extend(weekday)
dayjs.extend(customParseFormat);


const WorkingTime = [
    {
        label: 1,
        percent: 100
    },
    {
        label: 0.75,
    },
    {
        label: 0.5,
    },
    {
        label: 0.25,
    },
    {
        label: 0,
    },
]

const isWeekend = (date) => {
    return (date.weekday() === 0 || date.weekday() === 6);
};

function DayBoxes({monthYear, workedTime, setWorkedTime}) {
    return Array(monthYear.daysInMonth()).fill(0)
        .map((_, i) => i + 1)
        .map(day => {
            const workedTimeElement = workedTime[monthYear.date(day).format(DATE_KEY_FORMAT)];
            return <DayBox key={day + monthYear}
                           date={monthYear.date(day)}
                           workedTime={workedTimeElement}
                           cycleWorkedTime={setWorkedTime}
            />;
        });

}

function DayBox({date, workedTime, cycleWorkedTime}) {

    const weekend = isWeekend(date);

    return (
        <Grid xs={1} onClick={() => cycleWorkedTime(date.format(DATE_KEY_FORMAT))}>
            <Card variant="outlined" sx={{padding: 0}}>
                <CardContent sx={{padding: 0}}>
                    <Typography gutterBottom variant="h5" component="div"
                                sx={{backgroundColor: weekend ? 'red' : '#34b4eb', padding: 1}}>
                        <b>{date.format('DD')}</b>
                    </Typography>
                    <Typography gutterBottom component="div">
                        <input type="hidden" value={workedTime.label} name={date.format(DATE_KEY_FORMAT)}/>
                        {workedTime.label}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

function reducer(state, action) {
    switch (action.type) {
        case 'NEXT':
            return {
                monthYear: state.monthYear.add(1, 'month'),
                workedTime: workedTimee(state.monthYear.add(1, 'month'))
            };
        case 'PREVIOUS':
            return {
                monthYear: state.monthYear.subtract(1, 'month'),
                workedTime: workedTimee(state.monthYear.subtract(1, 'month'))
            };
        case 'CYCLE':
            return {
                ...state,
                workedTime: cycleWorkedTime(state.workedTime, action.day)
            };
    }
    throw Error('Unknown action ' + action.type);
}

function cycleWorkedTime(workedTime, day) {
    return {
        ...workedTime,
        [day]: changeWorkedTime(workedTime, day)
    }
        ;
}

function changeWorkedTime(workedTime, day) {
    const index = WorkingTime.findIndex(a => a === workedTime[day]);
    return index === 4 ? WorkingTime[0] : WorkingTime[index + 1];
}

function workedTimee(monthYear) {
    return Array(monthYear.daysInMonth()).fill(0)
        .map((_, i) => i + 1)
        .map(day => monthYear.date(day))
        .reduce((accu, value) => ({
                ...accu,
                [value.format(DATE_KEY_FORMAT)]: isWeekend(value) ? WorkingTime[4] : WorkingTime[0]
            }),
            {}
        );
}

function Calendar() {

    const navigate = useNavigate();
    const form = useRef(null);
    const [calendarState, dispatch] = useReducer(reducer, {
        monthYear: dayjs().date(1),
        workedTime: workedTimee(dayjs().date(1))
    });

    const dayShift = (monthDate) => {
        const weekday = monthDate.weekday();
        return weekday === 0 ? 6 : weekday - 1;
    };

    const initialUpperCase = (word) => {
        const firstLetter = word.charAt(0).toUpperCase();
        return firstLetter.concat(word.slice(1))
    }

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const data = {
            reporting: {
                absence: {
                    days: {}
                },
                weekend: {
                    days: {}
                }
            },
            company: {
                name: "YOUR COMPANY NAME",
                address: "your company address",
                city: "City",
                country: "FRANCE",
                legal: "Siret : XXX XXX XXX XXXXX - RCS : CRETEIL - NAF : XXXXX",
                phoneNumber: "+33 (X) X XX XX XX XX",
                mail: "your.mail@company.com",
                other: "whaterever your want"
            },
            client: {
                name: "YOUR CLIENT",
                contractor: "You or the contractor"
            }
        };

        const monthYear = calendarState.monthYear.format('MMMM YYYY');
        data.reporting.monthYear = initialUpperCase(monthYear);
        let workedTime = 0;
        let weekendTime = 0;
        let absenceTime = 0;
        const workedDays = {};
        const weekendWorkedDays = {};
        const absence = {};

        for (const pair of formData.entries()) {
            const currentDayWorkedTime = pair[1];
            const date = dayjs(pair[0], DATE_KEY_FORMAT);
            const dayWorkedTime = parseFloat(currentDayWorkedTime);
            if (isWeekend(date) && dayWorkedTime > 0) {
                weekendTime += dayWorkedTime;
                weekendWorkedDays[date.format(DATE_KEY_FORMAT)] = pair[1];
                workedTime+=dayWorkedTime;
            } else if (!isWeekend(date)) {
                if(dayWorkedTime < 1) {
                    absence[date.format(DATE_KEY_FORMAT)] = (1 - dayWorkedTime);
                    absenceTime += (1 - dayWorkedTime);
                }
                workedTime += dayWorkedTime;
                workedDays[date] = pair[1];
            }
        }
        data.reporting.workedTime = workedTime;
        data.reporting.days = workedDays;

        data.reporting.absence.days = absence;
        data.reporting.absence.time = absenceTime;
        data.reporting.weekend = {time: weekendTime, days: weekendWorkedDays};

        navigate('/summary', {state: data});
    }

    return (
        <>
            <Grid container>
                <Grid xsOffset={3} xs={1}>
                    <IconButton onClick={() => dispatch({type: 'PREVIOUS'})}>
                        <LeftArrowIcon sx={{fontSize: 50}}/>
                    </IconButton>
                </Grid>
                <Grid xs={4}><Typography fontSize={40}>{initialUpperCase(calendarState.monthYear.format('MMMM YYYY'))}</Typography></Grid>
                <Grid xs={1}>
                    <IconButton onClick={() => dispatch({type: 'NEXT'})}>
                        <RightArrowIcon sx={{fontSize: 50}}/>
                    </IconButton>
                </Grid>
            </Grid>
            <Form method="post" ref={form}>
                <Grid container spacing={2} columns={7}>
                    <Grid xs={1}><h2>Monday</h2></Grid>
                    <Grid xs={1}><h2>Tuesday</h2></Grid>
                    <Grid xs={1}><h2>Wednesday</h2></Grid>
                    <Grid xs={1}><h2>Thursday</h2></Grid>
                    <Grid xs={1}><h2>Friday</h2></Grid>
                    <Grid xs={1}><h2>Saturday</h2></Grid>
                    <Grid xs={1}><h2>Sunday</h2></Grid>
                    {
                        [...Array(dayShift(calendarState.monthYear))]
                            .map((a, i) => <Grid key={i} xs={1}></Grid>)
                    }
                    <DayBoxes monthYear={calendarState.monthYear} workedTime={calendarState.workedTime}
                              setWorkedTime={(day) => dispatch({type: 'CYCLE', day: day})}/>
                </Grid>
                <IconButton color={'success'} onClick={submit}>
                    <DoneIcon sx={{fontSize: 50}}/> Next
                </IconButton>
            </Form>
        </>
    );
}

export default Calendar
