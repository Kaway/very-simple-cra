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

dayjs.extend(weekday)

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

const weekend = (date) => {
    return (date.weekday() === 0 || date.weekday() === 6);
};

function DayBoxes({monthYear, workedTime, setWorkedTime}) {
    return Array(monthYear.daysInMonth()).fill(0)
        .map((_, i) => i + 1)
        .map(day => {
            const workedTimeElement = workedTime[monthYear.date(day).format('DDMMYYYY')];
            return <DayBox key={day + monthYear}
                           date={monthYear.date(day)}
                           workedTime={workedTimeElement}
                           cycleWorkedTime={setWorkedTime}
            />;
        });

}
function DayBox({date, workedTime, cycleWorkedTime}) {

    const isWeekend = weekend(date);

    return (
        <Grid xs={1} onClick={() => cycleWorkedTime(date.format('DDMMYYYY'))}>
            <Card variant="outlined" sx={{ padding: 0}}>
                <CardContent sx={{ padding: 0}}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ backgroundColor: isWeekend ? 'red' : '#34b4eb', padding: 1 }}>
                        <b>{date.format('DD')}</b>
                    </Typography>
                    <Typography gutterBottom component="div">
                        <input type="hidden" value={workedTime.label} name={date.format('DDMMYYYY')} />
                        {workedTime.label}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

function reducer(state, action) {
    switch (action.type){
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
    return index === 4 ? WorkingTime[0] : WorkingTime[index+1];
}

function workedTimee(monthYear) {
    return Array(monthYear.daysInMonth()).fill(0)
        .map((_, i) => i + 1)
        .map(day => monthYear.date(day))
        .reduce((accu, value) => ({
                ...accu,
                [value.format("DDMMYYYY")]: weekend(value) ? WorkingTime[4] : WorkingTime[0]}),
            {}
        );
}

function Calendar() {

    const navigate = useNavigate();
    const form = useRef(null);
    const [aaaa, dispatch] = useReducer(reducer, { monthYear: dayjs().date(1), workedTime: workedTimee(dayjs().date(1)) });

    const dayShift = (monthDate) => {
        const weekday = monthDate.weekday();
        return weekday === 0 ? 6 : weekday - 1;
    }

    function submit() {
        const formData = new FormData(form.current);
        navigate('/summary', {state: formData})
    }

    return (
        <>
            <Grid container>
                <Grid xsOffset={3} xs={1}>
                    <IconButton onClick={() => dispatch({ type: 'PREVIOUS'})} >
                        <LeftArrowIcon sx={{ fontSize: 50}} />
                    </IconButton>
                </Grid>
                <Grid xs={4}><Typography fontSize={40}>{aaaa.monthYear.format('MMMM YYYY')}</Typography></Grid>
                <Grid xs={1}>
                    <IconButton onClick={() => dispatch({ type: 'NEXT'})} >
                        <RightArrowIcon sx={{ fontSize: 50}} />
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
                        [...Array(dayShift(aaaa.monthYear))]
                            .map((a, i)  => <Grid key={i} xs={1}></Grid>)
                    }
                    <DayBoxes monthYear={aaaa.monthYear} workedTime={aaaa.workedTime} setWorkedTime={(day) => dispatch({ type: 'CYCLE', day: day})} />
                </Grid>
                <IconButton color={'success'} onClick={submit}>
                    <DoneIcon sx={{ fontSize: 50 }} /> Next
                </IconButton>
            </Form>
        </>
    );
}
export default Calendar
