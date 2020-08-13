//import { Button, List, ListItem, Alert } from '@hospitalrun/components'
import { Button, List, ListItem, Alert/*, BarGraph, PieGraph*/ } from '@hospitalrun/components'
//import { Data, Dataset, Axis } from '@hospitalrun/components/dist/components/Graph/interfaces'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
//import Diagnosis from '../../shared/model/Diagnosis'
import MedicalRecord from '../../shared/model/MedicalRecord'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
//import AddDiagnosisModal from './AddDiagnosisModal'
import AddMedicalRecordModal from './AddMedicalRecordModal'

import { Line } from "react-chartjs-2"

interface Props {
  patient: Patient
}

const MedicalRecords = (props: Props) => {
  const { patient } = props
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false)

  const breadcrumbs = [
    {
      //i18nKey: 'patient.diagnoses.label',
      i18nKey: 'patient.medicalrecords.label', //check this
      //location: `/patients/${patient.id}/diagnoses`,
      location: `/patients/${patient.id}/medicalrecords`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onAddMedicalRecordModalClose = () => {
    setShowMedicalRecordModal(false)
  }

  /*let data1:Data[] = [{x:1,y:1},{x:2,y:2},{x:3,y:3}]
  let dataset:Dataset[] = [{label:'mydataset',data:data1}]
  let yAxes:Axis[] = [{type:'linear', label:'yaxis'}]
  let xAxes:Axis[] = [{type:'linear', label:'xaxis'}]*/

  const dataApertura = patient.medicalRecords?.map((a: MedicalRecord) => (
    {date: a.medicalRecordDate, ap:a.aperture}))
  console.log(dataApertura)
  console.log(dataApertura?.map(a => a.ap ))

  const data = {
    labels: dataApertura?.map(a => a.date),
    datasets: [
      {
        label: "First dataset",
        data: dataApertura?.map(a => a.ap),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddDiagnosis) && ( //check permisions
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowMedicalRecordModal(true)}
            >
              {t('patient.medicalrecords.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      {(!patient.medicalRecords || patient.medicalRecords.length === 0) && (
        <Alert
          color="warning"
          //title={t('patient.diagnoses.warning.noDiagnoses')}
          //message={t('patient.diagnoses.addDiagnosisAbove')}
          title={t('patient.medicalrecords.warning.noMedicalRecords')} //check this
          message={t('patient.medicalrecords.addMedicalRecordAbove')} //check this
        />
      )}
      <List>
        {patient.medicalRecords?.map((a: MedicalRecord) => (
          <ListItem key={a.id}>{a.name + ' ' + a.aperture}</ListItem>
        ))}
      </List>
      <AddMedicalRecordModal show={showMedicalRecordModal} onCloseButtonClick={onAddMedicalRecordModalClose} />
      <Line data={data} />
    </>
  )
}

export default MedicalRecords
