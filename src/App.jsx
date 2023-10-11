import {useState} from 'react'
import './App.css'
import Grid from '@mui/material/Unstable_Grid2';
import {Box, Card, CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import LeftArrowIcon from '@mui/icons-material/ArrowBack';
import RightArrowIcon from '@mui/icons-material/ArrowForward';

dayjs.extend(weekday)

const WorkingTime = {
    FULL: {
        label: 1,
        percent: 100
    },
    THIRD: {
        label: 0.75,
    },
    HALF: {
        label: 0.5,
    },
    QUARTER: {
        label: 0.25,
    },
    OFF: {
        label: 0,
    },
}

const workingTimes = Object.keys(WorkingTime);

function DayBoxes({monthYear}) {
    return Array(monthYear.daysInMonth()).fill(0)
        .map((_, i) => i + 1)
        .map(day => <DayBox key={day + monthYear} date={monthYear.date(day)} />);

}
function DayBox({date}) {
    const weekend = (date) => {
        return (date.weekday() === 0 || date.weekday() === 6);
    };

    const isWeekend = weekend(date);

    //console.log("day : " );
    //console.log(date.format(' DD MM YYYY'));
    const [workingTimeIndex, setWorkingTimeIndex] = useState(isWeekend ? workingTimes.length - 1 : 0);

    function changeWorkedTime() {
        let newIndex;
        newIndex = workingTimeIndex === (workingTimes.length - 1) ? 0 : (workingTimeIndex + 1);
        setWorkingTimeIndex(newIndex);
    }

    return (
        <Grid xs={1} onClick={changeWorkedTime}>
            <Card variant="outlined" sx={{ padding: 0}}>
                <CardContent sx={{ padding: 0}}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ backgroundColor: isWeekend ? 'red' : '#34b4eb', padding: 1 }}>
                        <b>{date.format('DD')}</b>
                    </Typography>
                    <Typography gutterBottom component="div">
                        {WorkingTime[workingTimes[workingTimeIndex]].label}
                    </Typography>
                    </CardContent>
            </Card>
        </Grid>
    )
}


function App() {

    const [monthYear, setMonthYear] = useState(dayjs().date(1))

    const dayShift = (monthDate) => {
        const weekday = monthDate.weekday();
        return weekday === 0 ? 6 : weekday - 1;
    }

    function nextMonth() {
        setMonthYear(my => my.add(1, 'month'));
    }
    function previousMonth() {
        setMonthYear(my => my.subtract(1, 'month'));
    }

    return (
        <>
            <Grid container>
                <Grid xsOffset={3} xs={1}>
                    <IconButton onClick={previousMonth} >
                        <LeftArrowIcon sx={{ fontSize: 50}} />
                    </IconButton>
                </Grid>
                <Grid xs={4}><Typography fontSize={40} sx={10}>{monthYear.format('MMMM YYYY')}</Typography></Grid>
                <Grid xs={1}>
                    <IconButton onClick={nextMonth} >
                        <RightArrowIcon sx={{ fontSize: 50}} />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container spacing={2} columns={7}>
                <Grid xs={1}><h2>Monday</h2></Grid>
                <Grid xs={1}><h2>Tuesday</h2></Grid>
                <Grid xs={1}><h2>Wednesday</h2></Grid>
                <Grid xs={1}><h2>Thursday</h2></Grid>
                <Grid xs={1}><h2>Friday</h2></Grid>
                <Grid xs={1}><h2>Saturday</h2></Grid>
                <Grid xs={1}><h2>Sunday</h2></Grid>
                {
                    [...Array(dayShift(monthYear))]
                        .map((a, i)  => <Grid key={i} xs={1}></Grid>)
                }
                <DayBoxes monthYear={monthYear} />
            </Grid>
        </>
    );
}

export default App
