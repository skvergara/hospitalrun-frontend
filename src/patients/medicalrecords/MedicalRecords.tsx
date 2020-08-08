import { Button, List, ListItem, Alert } from '@hospitalrun/components'
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
          <ListItem key={a.id}>{a.name}</ListItem>
        ))}
      </List>
      <AddMedicalRecordModal show={showMedicalRecordModal} onCloseButtonClick={onAddMedicalRecordModalClose} />
    </>
  )
}

export default MedicalRecords
