import { Button, Modal } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
// import {findDOMNode} from 'react-dom'

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
import Appointment, { AppointmentStatus, PaymentStatus, statusBackgroundColors, statusBorderColors } from './../../shared/model/Appointment'
import { updateAppointment, deleteAppointment } from './appointment-slice'

import ReactTooltip from 'react-tooltip'

//import CustomContext from '../../shared/components/custom/CustomContext'

interface Event {
  id: string
  start: Date
  end: Date
  title: string
  allDay: boolean
  backgroundColor: string
  borderColor: string
}

interface Item {
  label: string
  onClick?: (event: Event) => void
}

const esLocale = require('../../../node_modules/@fullcalendar/core/locales/es.js')

const breadcrumbs = [{ i18nKey: 'scheduling.appointments.label', location: '/appointments' }]

const ViewAppointments = () => {
  const { t } = useTranslator()
  const history = useHistory()
  useTitle(t('scheduling.appointments.label'))
  const dispatch = useDispatch()
  const { appointments } = useSelector((state: RootState) => state.appointments) 
  const [events, setEvents] = useState<Event[]>([])
  const setButtonToolBar = useButtonToolbarSetter()
  useAddBreadcrumbs(breadcrumbs, true)

  const [clickedEvent, setClickedEvent] = useState<Event>()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)

  const getBackgroundColor = (appointmentStatus: AppointmentStatus) => (statusBackgroundColors as any)[appointmentStatus]
  const getBorderColor = (paymentStatus: PaymentStatus) => (statusBorderColors as any)[paymentStatus]

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
            backgroundColor: getBackgroundColor(a.appointmentStatus as AppointmentStatus),
            borderColor: getBorderColor(a.paymentStatus as PaymentStatus)
          }
        }),
      )

      setEvents(newEvents)
    }

    if (appointments) {
      getAppointments()
    }
  }, [appointments])

  const calendarRef = React.createRef<FullCalendar>()

  const handleEventDrop = async (arg: any) => {
    const selectedAppointment = appointments.find(appointment => appointment.id === arg.event.id)
        
    const toUpdateAppointment = {
      ...(selectedAppointment as Appointment),
      startDateTime: (arg as any).event.start.toISOString(),
      endDateTime: (arg as any).event.end.toISOString()
    }

    //alert("La cita de " + arg.event.title + " se reagendó para: " + (arg as any).event.start.toUTCString());
    //if (!confirm("Are you sure about this change?")) {
      //info.revert();
    //}
    await dispatch(updateAppointment(toUpdateAppointment as Appointment))
    dispatch(fetchAppointments())
  }

  const handleEventResize = async (arg: any) => {
    const selectedAppointment = appointments.find(appointment => appointment.id === arg.event.id)

    const toUpdateAppointment = {
      ...selectedAppointment,
      startDateTime: (arg as any).event.start.toISOString(),
      endDateTime: (arg as any).event.end.toISOString()
    }

    //alert("La cita de " + event.title + " se extendió: " + event.start.toUTCString());
    await dispatch(updateAppointment(toUpdateAppointment as Appointment))
    dispatch(fetchAppointments())
  }

  const item1: Item = {
    label: 'View',
    onClick: (event: Event) => history.push(`/appointments/${event.id}`)
  }
  const item2: Item = {
    label: 'Confirm',
    onClick: async (event: Event) => {
      const selectedAppointment = appointments.find(appointment => appointment.id === event.id)
      const toUpdateAppointment = {
        ...(selectedAppointment as Appointment),
        appointmentStatus: 'confirmed'
      }

      await dispatch(updateAppointment(toUpdateAppointment as Appointment))
      dispatch(fetchAppointments())
    }
  }
  const item3: Item = {
    label: 'Cancel',
    onClick: async (event: Event) => {
      const selectedAppointment = appointments.find(appointment => appointment.id === event.id)
      const toUpdateAppointment = {
        ...(selectedAppointment as Appointment),
        appointmentStatus: 'cancelled'
      }

      await dispatch(updateAppointment(toUpdateAppointment as Appointment))
      dispatch(fetchAppointments())
    }
  }
  const item4: Item = {
    label: 'Delete',
    onClick: () => {
      setShowDeleteConfirmation(true)
    }
  }

  const onDeleteConfirmationButtonClick = async (event: Event) => {
    const selectedAppointment = appointments.find(appointment => appointment.id === event.id)
    await dispatch(deleteAppointment(selectedAppointment as Appointment))
    setShowDeleteConfirmation(false)
    dispatch(fetchAppointments())
  }

  const menu = [item1, item2, item3, item4]

  const handleEventPositioned = (el: HTMLElement) => {
    el.setAttribute("data-tip",'true')
    el.setAttribute('data-for','testTip')
    el.setAttribute('data-event','click')
    ReactTooltip.rebuild()
   }

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        locale={esLocale}
        events={events}
        defaultView={'timeGridWeek'}
        plugins={ [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin] }
        editable={true}
        //eventResizableFromStart={true} //not working
        selectable={true}
        //scrollTime={'10:00:00'}
        minTime={'08:00:00'}
        maxTime={'22:00:00'}
        height={'auto'}
        selectMirror={true}
        nowIndicator={true}
        header={
          {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth'
          }
        }
        eventClick={(arg) => {
          //history.push(`/appointments/${arg.event.id}`)
          setClickedEvent(events.find(event => event.id === arg.event.id))
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
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventMouseEnter={(arg) => {
          setClickedEvent(events.find(event => event.id === arg.event.id))
        }}
        
        eventPositioned={(arg) => handleEventPositioned(arg.el)}
      />

      <ReactTooltip id="testTip" place="right" effect="solid" globalEventOff='click' clickable>
        <div className='custom-context' id='customcontext' /* style={myStyle} */ >
          {menu.map((item, index, arr) =>{
            if(arr.length-1===index){
              return <div key={index} className='custom-context-item-last' onClick={() => {
                if (item.onClick)
                  item.onClick(clickedEvent as Event)
              }}>
                {item.label}</div>
            }
            else{
              return <div key={index} className='custom-context-item' onClick={() => {
                if (item.onClick)
                  item.onClick(clickedEvent as Event)
              }}>
                {item.label}</div>
              }
            })
          }
        </div>
      </ReactTooltip>
      <Modal
        body={t('scheduling.appointment.deleteConfirmationMessage')}
        buttonsAlignment="right"
        show={showDeleteConfirmation}
        closeButton={{
          children: t('actions.delete'),
          color: 'danger',
          onClick: () => onDeleteConfirmationButtonClick(clickedEvent as Event),
        }}
        title={t('actions.confirmDelete')}
        toggle={() => setShowDeleteConfirmation(false)}
      />
      
      {/* <CustomContext menu={menu} />       */}
    </div>
  )

}

export default ViewAppointments
