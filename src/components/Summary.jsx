import {useLocation} from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {Typography} from "@mui/material";
import {PDFDownloadLink} from "@react-pdf/renderer";
import CraPdf from "./CraPdf.jsx";
import {formatAbsences, formatWeekends} from "../utils.js";
import 'dayjs/locale/fr';

function Summary() {

    dayjs.extend(customParseFormat);
    dayjs.locale('fr')

    const location = useLocation();
    const data = location.state;

    return (
        <div>
            <div>
                <p><b>Entreprise:</b> {data.client.name}</p>
                <p><b>Prestataire:</b> {data.client.contractor}</p>
                <p><b>Mois et année</b> {data.reporting.monthYear}</p>
                <p><b>Jours travaillés:</b> {data.reporting.workedTime}</p>
                <p><b>Dont jours de week-ends travaillés:</b> {data.reporting.weekend.time}</p>
                <p><b>Détails des weekends: </b> {formatWeekends(data.reporting.weekend)}</p>
                <p><b>Absences:</b> {data.reporting.absence.time}</p>
                <p><b>Détail des absences:</b> {formatAbsences(data.reporting.absence)}</p>
            </div>
            <div>
                <Typography fontSize={30}>
                    <PDFDownloadLink document={<CraPdf data={data}/>} fileName="somename.pdf">
                        {({blob, url, loading, error}) =>
                            loading ? 'Loading document...' : 'Télécharger le CRA'
                        }
                    </PDFDownloadLink>
                </Typography>
            </div>
        </div>
    )
}

export default Summary