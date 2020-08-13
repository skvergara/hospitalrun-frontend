//import { Button, List, ListItem, Alert } from '@hospitalrun/components'
import { Panel, Button, Alert/*, BarGraph, PieGraph*/ } from '@hospitalrun/components'
//import { Data, Dataset, Axis } from '@hospitalrun/components/dist/components/Graph/interfaces'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
//import Diagnosis from '../../shared/model/Diagnosis'
import CloseAnamnesis from '../../shared/model/CloseAnamnesis'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
//import AddDiagnosisModal from './AddDiagnosisModal'
import AddCloseAnamnesisModal from './AddCloseAnamnesisModal'
import EditCloseAnamnesisModal from './EditCloseAnamnesisModal'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'

interface Props {
  patient: Patient
}

const CloseAnamneses = (props: Props) => {
  const { patient } = props
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showCloseAnamnesisModal, setShowCloseAnamnesisModal] = useState(false)
  const [showEditCloseAnamnesisModal, setShowEditCloseAnamnesisModal] = useState(false)
  const [editCloseAnamnesis, setEditCloseAnamnesis] = useState({
    id: '',
    name: '',
    closeAnamnesisDate: new Date().toISOString(),
    description: ''   
  })
  const [index, setIndex] = useState(0)

  const breadcrumbs = [
    {
      //i18nKey: 'patient.diagnoses.label',
      i18nKey: 'patient.medicalrecords.label', //check this
      //location: `/patients/${patient.id}/diagnoses`,
      location: `/patients/${patient.id}/closeanamneses`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onAddCloseAnamnesisModalClose = () => {
    setShowCloseAnamnesisModal(false)
  }

  const onEditCloseAnamnesisModalClose = () => {
    setShowEditCloseAnamnesisModal(false)
    setEditCloseAnamnesis({
      id: '',
      name: '',
      closeAnamnesisDate: new Date().toISOString(),
      description: ''
    })
  }

  const onClick = (entry: CloseAnamnesis, i: number) => {
    setEditCloseAnamnesis(entry)
    setIndex(i)
    console.log('entry: '+editCloseAnamnesis.name)
    setShowEditCloseAnamnesisModal(true)
  }

  const name='name'
  const description='description'
  
  /*let editCloseAnamnesis: CloseAnamnesis = {
    id: '',
    name: 'test!!!!',
    closeAnamnesisDate: new Date().toISOString(),
    description: ''   
  }*/

  /*const setEditCloseAnamnesis = (entry: CloseAnamnesis) => {
    editCloseAnamnesis = entry
  }*/

  const entries = patient.closeAnamneses?.map((entry:CloseAnamnesis, i) => {
    //const error = errors ? errors[i] : undefined
    return (
      <>
      <Panel key={entry.id} title={t('patient.basicInformation')} color="primary" collapsible >
        
        <div className="row">
          <div className="col-md-12 d-flex justify-content-end">
            {permissions.includes(Permissions.AddDiagnosis) && ( //check permisions
              <Button
                outlined
                color="success"
                icon="add"
                iconLocation="left"
                onClick={() => {onClick(entry, i); setShowEditCloseAnamnesisModal(true)}}
              >
                {'fix Edit'}
              </Button>
            )}
          </div>
          <div className="col-md-2">
            <TextInputWithLabelFormGroup key={entry.id}
              //label={t('Name')}
              label={'Name'}
              name={`${name}${i}`}
              //value={patient.closeAnamneses?.map((a:CloseAnamnesis) => (a.name))[0]}
              value={entry.name}
              //isEditable={isEditable}
              //onChange={(event) => onFieldChange('prefix', event.currentTarget.value)}
              //isInvalid={!!error?.prefix}
              //feedback={t(error?.prefix)}
            />
          </div>
          <div className="col-md-4">
            <TextInputWithLabelFormGroup key={entry.id}
              //label={t('Descripción')}
              label={'Descripción'}
              name={`${description}${i}`}
              //value={patient.closeAnamneses?.map((a:CloseAnamnesis) => (a.description))[0]}
              value={entry.description}
              //isEditable={isEditable}
              //onChange={(event) => onFieldChange('givenName', event.currentTarget.value)}
              //isRequired
              //isInvalid={!!error?.givenName}
              //feedback={t(error?.givenName)}
            />
          </div>
        </div>
      </Panel>
      
      </>
    )
  })

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
              onClick={() => setShowCloseAnamnesisModal(true)}
            >
              {t('patient.medicalrecords.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      {(!patient.closeAnamneses || patient.closeAnamneses.length === 0) && (
        <Alert
          color="warning"
          //title={t('patient.diagnoses.warning.noDiagnoses')}
          //message={t('patient.diagnoses.addDiagnosisAbove')}
          title={t('patient.medicalrecords.warning.noMedicalRecords')} //check this
          message={t('patient.medicalrecords.addMedicalRecordAbove')} //check this
        />
      )}
      <div>
        {entries}
      </div>
      <AddCloseAnamnesisModal show={showCloseAnamnesisModal} onCloseButtonClick={onAddCloseAnamnesisModalClose} />
      <EditCloseAnamnesisModal editCloseAnamnesis={editCloseAnamnesis} index={index} show={showEditCloseAnamnesisModal} onCloseButtonClick={onEditCloseAnamnesisModalClose} />
    </>
  )
}

export default CloseAnamneses
