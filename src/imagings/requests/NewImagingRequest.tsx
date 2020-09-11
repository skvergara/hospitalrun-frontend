import { Typeahead, Label, Button, Alert, Column, Row } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import useRequestImaging, { ImagingRequest } from '../hooks/useRequestImaging'
import { ImagingRequestError } from '../util/validate-imaging-request'

const NewImagingRequest = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const [mutate] = useRequestImaging()
  useTitle(t('imagings.requests.new'))
  const [error, setError] = useState<ImagingRequestError>()
  const [visitOption, setVisitOption] = useState([] as Option[])

  const statusOptions: Option[] = [
    { label: t('imagings.status.requested'), value: 'requested' },
    { label: t('imagings.status.completed'), value: 'completed' },
    { label: t('imagings.status.canceled'), value: 'canceled' },
  ]

  const [newImagingRequest, setNewImagingRequest] = useState<ImagingRequest>({
    patient: '',
    fullName: '',
    status: 'requested',
    notes: '',
    type: '',
    visitId: '',
  })

  const breadcrumbs = [
    {
      i18nKey: 'imagings.requests.new',
      location: `/imaging/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const onPatientChange = (patient: Patient) => {
    if (patient) {
      setNewImagingRequest((previousNewImagingRequest) => ({
        ...previousNewImagingRequest,
        patient: patient.id,
        fullName: patient.fullName as string,
      }))

      const visits = patient.visits?.map((v) => ({
        label: `${v.type} at ${format(new Date(v.startDateTime), 'yyyy-MM-dd hh:mm a')}`,
        value: v.id,
      })) as Option[]

      setVisitOption(visits)
    } else {
      setNewImagingRequest((previousNewImagingRequest) => ({
        ...previousNewImagingRequest,
        patient: '',
        fullName: '',
        visitId: '',
      }))
      setVisitOption([])
    }
  }

  const onImagingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.currentTarget.value
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      type,
    }))
  }

  const onStatusChange = (value: string) => {
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      status: value as 'completed' | 'canceled' | 'requested',
    }))
  }

  const onVisitChange = (value: string) => {
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      visitId: value,
    }))
  }

  const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    setNewImagingRequest((previousNewImagingRequest) => ({
      ...previousNewImagingRequest,
      notes,
    }))
  }

  const onSave = async () => {
    try {
      await mutate(newImagingRequest)
      history.push(`/imaging`)
    } catch (e) {
      setError(e)
    }
  }

  const onCancel = () => {
    history.push('/imaging')
  }

  const defaultSelectedVisitsOption = () => {
    if (visitOption !== undefined) {
      return visitOption.filter(({ value }) => value === newImagingRequest.visitId)
    }
    return []
  }

  return (
    <>
      {error !== undefined && (
        <Alert color="danger" title={t('states.error')} message={t(error.message)} />
      )}
      <form>
        <Row>
          <Column>
            <div className="form-group patient-typeahead">
              <Label htmlFor="patientTypeahead" isRequired text={t('imagings.imaging.patient')} />
              <Typeahead
                id="patientTypeahead"
                placeholder={t('imagings.imaging.patient')}
                onChange={(p: Patient[]) => {
                  onPatientChange(p[0])
                }}
                onSearch={async (query: string) => PatientRepository.search(query)}
                searchAccessor="fullName"
                renderMenuItemChildren={(p: Patient) => <div>{`${p.fullName} (${p.code})`}</div>}
                isInvalid={!!error?.patient}
                feedback={t(error?.patient)}
              />
            </div>
          </Column>
          <Column>
            <div className="visits">
              <SelectWithLabelFormGroup
                name="visit"
                label={t('patient.visits.label')}
                isRequired
                isEditable={newImagingRequest.patient !== undefined}
                options={visitOption || []}
                defaultSelected={defaultSelectedVisitsOption()}
                onChange={(values) => {
                  onVisitChange(values[0])
                }}
              />
            </div>
          </Column>
        </Row>

        <TextInputWithLabelFormGroup
          name="imagingType"
          label={t('imagings.imaging.type')}
          isRequired
          isEditable
          isInvalid={!!error?.type}
          feedback={t(error?.type)}
          value={newImagingRequest.type}
          onChange={onImagingTypeChange}
        />
        <div className="imaging-status">
          <SelectWithLabelFormGroup
            name="status"
            label={t('imagings.imaging.status')}
            options={statusOptions}
            isRequired
            isEditable
            defaultSelected={statusOptions.filter(
              ({ value }) => value === newImagingRequest.status,
            )}
            onChange={(values) => onStatusChange(values[0])}
          />
        </div>
        <div className="form-group">
          <TextFieldWithLabelFormGroup
            name="ImagingNotes"
            label={t('imagings.imaging.notes')}
            isEditable
            value={newImagingRequest.notes}
            onChange={onNoteChange}
          />
        </div>
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('actions.save')}
            </Button>
            <Button color="danger" onClick={onCancel}>
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default NewImagingRequest
