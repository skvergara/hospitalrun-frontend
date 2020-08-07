import { Button } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import FullCalendar/*, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate }*/ from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../../page-header/title/useTitle'
import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import { RootState } from '../../shared/store'
import { fetchAppointments } from './appointments-slice'
import Appointment from './../../shared/model/Appointment'
import { updateAppointment } from './appointment-slice'

interface Event {
  id: string
  start: Date
  end: Date
  title: string
  allDay: boolean
}

const esLocale = require('../../../node_modules/@fullcalendar/core/locales/es.js')

const breadcrumbs = [{ i18nKey: 'scheduling.appointments.label', location: '/appointments' }]

const ViewAppointments = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const location = useLocation()
  useTitle(t('scheduling.appointments.label'))
  const dispatch = useDispatch()
  const { appointments } = useSelector((state: RootState) => state.appointments)
  const [events, setEvents] = useState<Event[]>([])
  const setButtonToolBar = useButtonToolbarSetter()
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    dispatch(fetchAppointments())
    setButtonToolBar([
      <Button
        key="newAppointmentButton"
        outlined
        color="success"
        icon="appointment-add"
        onClick={() => history.push('/appointments/new')}
      >
        {t('scheduling.appointments.new')}
      </Button>,
    ])

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar, history, t])

  useEffect(() => {
    const getAppointments = async () => {
      const newEvents = await Promise.all(
        appointments.map(async (a) => {
          const patient = await PatientRepository.find(a.patient)
          return {
            id: a.id,
            start: new Date(a.startDateTime),
            end: new Date(a.endDateTime),
            title: patient.fullName || '',
            allDay: false,
          }
        }),
      )

      setEvents(newEvents)
    }

    if (appointments) {
      getAppointments()
    }
  }, [appointments])

  const state = location.state
  const selectedView = (state as any)?.selectedView
    ? (state as any)?.selectedView
    : 'timeGridWeek'

  const calendarRef = React.createRef<FullCalendar>()

  return (
    <div>
      <FullCalendar 
      ref={calendarRef}
      locale={esLocale}
      events={events}
      defaultView={selectedView}
      plugins={ [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin] }
      editable={true}
      //eventResizableFromStart={true} //not working
      selectable={true}
      //scrollTime={'10:00:00'}
      minTime={'08:00:00'}
      maxTime={'22:00:00'}
      height={'auto'}
      selectMirror={true}
      //nowIndicator={true}
      header={
        {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
        }
      }
      eventClick={(arg) => {
        history.push(`/appointments/${arg.event.id}`)
      }}
      dateClick={(arg) => {
        history.push({
          pathname:`/appointments/new`,
          state: {startDateTime: arg.date}
        })
      }}
      select={(arg) =>{
        history.push({
          pathname:`/appointments/new`,
          state: {startDateTime: arg.start, endDateTime:arg.end}
        })
      }}
      eventDrop={(arg) => {
        const selectedAppointment = appointments.find(appointment => appointment.id === arg.event.id)

        const toUpdateAppointment = {
          ...selectedAppointment,
          startDateTime: (arg as any).event.start.toISOString(),
          endDateTime: (arg as any).event.end.toISOString()
        }

        let calendarApi = (calendarRef as any).current.getApi()
        let selectedView = calendarApi.view.type
        
        const onDragSuccess = () => {
          history.push(`/appointments/${arg.event.id}`)
          history.push({
            pathname:`/appointments`,
            state:{selectedView: selectedView}
          })
        }

        alert("La cita de " + arg.event.title + " se reagendó para: " + (arg as any).event.start.toUTCString());
        //if (!confirm("Are you sure about this change?")) {
          //info.revert();
        //}
        dispatch(updateAppointment(toUpdateAppointment as Appointment, onDragSuccess))
      }}
      eventResize={(arg) => {
        const selectedAppointment = appointments.find(appointment => appointment.id === arg.event.id)

        const toUpdateAppointment = {
          ...selectedAppointment,
          startDateTime: (arg as any).event.start.toISOString(),
          endDateTime: (arg as any).event.end.toISOString()
        }

        let calendarApi = (calendarRef as any).current.getApi()
        let selectedView = calendarApi.view.type

        const onDragSuccess = () => {
          history.push(`/appointments/${arg.event.id}`)
          history.push({
            pathname:`/appointments`,
            state:{selectedView: selectedView}
          })
        }
        //alert("La cita de " + event.title + " se extendió: " + event.start.toUTCString());
        dispatch(updateAppointment(toUpdateAppointment as Appointment, onDragSuccess))
      }}
      />
    </div>
  )
}

export default ViewAppointments
