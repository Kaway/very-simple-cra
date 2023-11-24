import dayjs from "dayjs";

export const DATE_KEY_FORMAT = 'DDMMYYYY';
export const DATE_DISPLAY_FORMAT = 'DD/MM/YYYY';
export const formatAbsences = (absence) => {
    if(absence.time === 0) {
        return "Aucune";
    }
    const days = absence.days;
    return formatDays(days);
};
export const formatWeekends = (weekend) => {
    if(weekend.time === 0) {
        return "Aucun";
    }
    const days = weekend.days;

    return formatDays(days);
};
const formatDays = (days) => {
    return Object.keys(days).map((key) => {
        return ' ' + dayjs(key, DATE_KEY_FORMAT).format(DATE_DISPLAY_FORMAT) + ' (' + days[key] + ')';
    }).toString().trim()
}