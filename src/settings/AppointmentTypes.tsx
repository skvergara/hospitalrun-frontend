import { Container, Row, Table, Button } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'


import { useButtonToolbarSetter } from '../page-header/button-toolbar/ButtonBarProvider'
import useTranslator from '../shared/hooks/useTranslator'

const AppointmentList = () => {
    const { t } = useTranslator()
    const history = useHistory()

    const setButtonToolBar = useButtonToolbarSetter()

    useEffect(() => {
        setButtonToolBar([
            <Button
                key="newAppointmentTypeButton"
                outlined
                color="success"
                icon="patient-add"
            //onClick={() => history.push('/patients/new')}
            >
                {'Nuevo tipo de cita'}
            </Button>,
        ])
        return () => {
            setButtonToolBar([])
        }
    }, [setButtonToolBar, t, history])

    const table = (
        <Table
            data={[
                { id: 1, type: 'Control', detail: 'Never gonna', price: 5000 },
                { id: 2, type: 'Seguimiento', detail: 'give you up', price: 12000 },
                { id: 3, type: 'Evaluación', detail: 'let you down', price: 7000 },
            ]}
            getID={(row) => row.id}
            columns={[
                { label: 'Tipo de cita', key: 'type' },
                { label: 'Detalle', key: 'detail' },
                { label: 'Precio', key: 'price' }
            ]}
            actionsHeaderText={t('actions.label')}
            actions={[{
                label: t('actions.edit'),
                action: () => []//history.push(`/patients/new`)
            }]}
        />
    )

    return (
        <div>
            <Container>
                <Row> {table}</Row>
            </Container>
        </div>
    )
}

export default AppointmentList
