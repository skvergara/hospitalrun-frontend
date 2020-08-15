import { Panel, Button, Alert, Toast, Modal } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import CloseAnamnesis from '../../shared/model/CloseAnamnesis'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import AddCloseAnamnesisModal from './AddCloseAnamnesisModal'
import EditCloseAnamnesisModal from './EditCloseAnamnesisModal'

import { updatePatient, removeCloseAnamnesisError } from '../patient-slice'
import CloseAnamnesisLayout from './CloseAnamnesisLayout'
import { CustomPanel} from '../../shared/components/custom/CustomPanel'
import { Line } from "react-chartjs-2"

interface Props {
  patient: Patient
}

const CloseAnamneses = (props: Props) => {
  const { patient } = props
  const { t } = useTranslator()
  const dispatch = useDispatch()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showCloseAnamnesisModal, setShowCloseAnamnesisModal] = useState(false)
  const [showEditCloseAnamnesisModal, setShowEditCloseAnamnesisModal] = useState(false)
  const [editCloseAnamnesis, setEditCloseAnamnesis] = useState({
    id: '',
    title: '',
    name: '',
    closeAnamnesisDate: new Date().toISOString(),
    size: ''   
  })
  const [index, setIndex] = useState(0)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  //const setButtonToolBar = useButtonToolbarSetter()

  const breadcrumbs = [
    {
      i18nKey: 'patient.closeAnamneses.label',
      location: `/patients/${patient.id}/closeanamneses`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onAddCloseAnamnesisModalClose = () => {
    setShowCloseAnamnesisModal(false)
    dispatch(removeCloseAnamnesisError())
  }

  const onEditCloseAnamnesisModalClose = () => {
    setShowEditCloseAnamnesisModal(false)
    setEditCloseAnamnesis({
      id: '',
      title: '',
      name: '',
      closeAnamnesisDate: new Date().toISOString(),
      size: ''
    })
  }

  const onClick = (entry: CloseAnamnesis, i: number) => {
    setEditCloseAnamnesis(entry)
    setIndex(i)
    setShowEditCloseAnamnesisModal(true)
  }

  const getIndex = (i: number) => {
    setIndex(i)
  }

  const onCloseAnamnesisDeleteButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setShowDeleteConfirmation(true)
  }

  const onDeleteSuccess = () => {
    Toast('success', t('states.success'), t('scheduling.appointment.successfullyDeleted')) //check this
  }

  const onDeleteConfirmationButtonClick = () => {
    const newCloseAnamneses = [...data]
    newCloseAnamneses.splice(index, 1)
    onFieldChange('closeAnamneses', newCloseAnamneses)
    setShowDeleteConfirmation(false)
  }

  const data = (patient.closeAnamneses as CloseAnamnesis[])

  const onFieldChange = (name: string, value: string | boolean | CloseAnamnesis[]) => {
      const newPatient = {
        ...patient,
        [name]: value,
      }
      dispatch(updatePatient(newPatient, onDeleteSuccess))
  }

  const dataSize = patient.closeAnamneses?.map((a: CloseAnamnesis) => (
    {date: a.closeAnamnesisDate, size:a.size}))

  const graphData = {
    labels: dataSize?.map(a => a.date),
    datasets: [
      {
        label: "First dataset",
        data: dataSize?.map(a => a.size),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  }

  const entries = patient.closeAnamneses?.map((entry:CloseAnamnesis, i) => {
    const buttonEdit = <Button
      outlined
      color="success"
      icon="edit"
      iconLocation="left"
      size="small"
      onClick={() => {onClick(entry, i); setShowEditCloseAnamnesisModal(true)}}
    >
      {t('actions.edit')}
    </Button>
    const buttonDelete = <Button
      color="danger"
      icon="remove"
      iconLocation="left"
      size="small"
      onClick={(event) => {getIndex(i); onCloseAnamnesisDeleteButtonClick(event)}}
    >
      {t('actions.delete')}
    </Button>
    const buttons = [buttonEdit, buttonDelete]
    const footer = <div className="row d-flex justify-content-between">
      <div className="col-4">
        {'Date: '+entry.closeAnamnesisDate}
      </div>
      <div className="button-toolbar">
        {permissions.includes(Permissions.AddDiagnosis) && ( //check permisions 
        buttons
        )}
      </div>
    </div>

    //const error = errors ? errors[i] : undefined
    //creo que va algo en la linea entre Panel y div abajo en return
    return (
      <>
      
      <CustomPanel key={entry.id} footer={footer} title={entry.title} color="primary" collapsible >
        <CloseAnamnesisLayout key={entry.id}
          closeAnamnesis={entry}
          isEditable={false}
          isRequired={false}
          index={i}
          forPanel={true}
        />
      </CustomPanel>
      <br />
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
              {t('patient.closeAnamneses.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      {(!patient.closeAnamneses || patient.closeAnamneses.length === 0) && (
        <Alert
          color="warning"
          title={t('patient.closeAnamneses.warning.noCloseAnamneses')} 
          message={t('patient.closeAnamneses.addCloseAnamnesisAbove')} 
        />
      )}
      <div>
        {entries}
      </div>
      <div>
        <Panel title={'Data Plot'} color={'primary'} collapsible>
          <Line data={graphData} />
        </Panel> 
      </div>
      <AddCloseAnamnesisModal show={showCloseAnamnesisModal} onCloseButtonClick={onAddCloseAnamnesisModalClose} />
      <EditCloseAnamnesisModal editCloseAnamnesis={editCloseAnamnesis} index={index} show={showEditCloseAnamnesisModal} onCloseButtonClick={onEditCloseAnamnesisModalClose} />
      <Modal
        //body={t('scheduling.appointment.deleteConfirmationMessage')} //check trans
        body={t('patient.closeAnamneses.deleteConfirmationMessage')} //check trans
        buttonsAlignment="right"
        show={showDeleteConfirmation}
        closeButton={{
          children: t('actions.delete'),
          color: 'danger',
          onClick: onDeleteConfirmationButtonClick,
        }}
        title={t('actions.confirmDelete')}
        toggle={() => setShowDeleteConfirmation(false)}
      />
    </>
  )
}

export default CloseAnamneses
