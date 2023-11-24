import {Document, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import {formatAbsences, formatWeekends} from "../utils.js";

// Create styles
const styles = StyleSheet.create({
    page: {
        fontSize: 15,
    },
    header: {
        display: "flex",
        flexDirection: 'row',
        margin: 20,
        padding: 10,
        justifyContent: "center",
        fontSize: 20,
        color: 'grey'
    },
    title: {
        display: "flex",
        flexDirection: 'row',
        margin: 30,
        justifyContent: "center",
        fontSize: 30,
    },
    company: {
        margin: 40,
        padding: 0,
        flexGrow: 1,
    },
    workedTime: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    validation: {
        margin: 10,
        paddingTop: 65,
        marginLeft: 45,
        flexGrow: 1
    },
    validationText: {
        marginVertical: 10,
    },
    footer: {
        fontSize: 13,
        color: 'grey',
        marginLeft: 45,
        marginRight: 45,
        marginBottom: 20,
        flexDirection: "row",
    },
    footerLeft: {
        width: "50%",
        alignSelf: "flex-start",
        alignItems: "flex-start",
        marginRight: 20,

    },
    footerRight: {
        width: "50%",
        alignSelf: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 80,
    },
    table: {
        display: "table",
        width: "500",
        borderStyle: "solid",
        borderWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginLeft: 45,
        fontSize: 20

    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
        fontSize: 20,
        marginTop: 5
    },
    tableCol: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        fontSize: 20
    },
    tableCell: {
        marginTop: 5,
        fontSize: 15,
        textAlign: "left",
        justifyContent: "flex-start",
        lineHeight: 1.3,
    },
    tableHeader: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 15
    },
    bold: {
        fontFamily: 'Helvetica-Bold'
    }
});

// Create Document Component
function CraPdf ({data}) {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text>{data.company.name}</Text>
                </View>
                <View style={styles.title}>
                    <Text style={{fontFamily: 'Helvetica-Bold'}}>Compte-Rendu d'Activité mensuel</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Entreprise</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.client.name}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Prestataire</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.client.contractor}</Text>
                        </View>
                    </View>
                </View>
                <View style={{margin: 20}}></View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Mois et année</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.reporting.monthYear}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.tableHeader]}>
                            <Text style={styles.tableCell}>Jours travaillés</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.reporting.workedTime}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Dont jours de weekends</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.reporting.weekend.time}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Détail</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell} render={() => (
                                formatWeekends(data.reporting.weekend)
                            )} />
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Jours d'absence</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{data.reporting.absence.time}</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Détail des absences</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell} render={() => (
                                formatAbsences(data.reporting.absence)
                            )} />
                        </View>
                    </View>
                </View>

                <View style={styles.validation}>
                    <Text style={styles.validationText}>Validé par :</Text>
                    <Text style={styles.validationText}>Le :</Text>
                    <Text style={styles.validationText}>Signature, précédée la mention « Bon pour facturation » :</Text>
                </View>


                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        <Text>{data.company.name}</Text>
                        <Text>{data.company.address}</Text>
                        <Text>{data.company.city}</Text>
                        <Text>{data.company.legal}</Text>
                    </View>
                    <View style={styles.footerRight}>
                        <Text>{data.company.phone}+33 6 29 62 80 43</Text>
                        <Text>{data.company.mail}</Text>
                        <Text>{data.company.other}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default CraPdf;