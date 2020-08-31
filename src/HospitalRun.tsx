import { Toaster } from '@hospitalrun/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'

import Dashboard from './dashboard/Dashboard'
import Imagings from './imagings/Imagings'
import Incidents from './incidents/Incidents'
import Labs from './labs/Labs'
import Breadcrumbs from './page-header/breadcrumbs/Breadcrumbs'
import { ButtonBarProvider } from './page-header/button-toolbar/ButtonBarProvider'
import ButtonToolBar from './page-header/button-toolbar/ButtonToolBar'
import Patients from './patients/Patients'
import Appointments from './scheduling/appointments/Appointments'
//import Settings from './settings/Settings'
import Settings2 from './settings/Settings2'

import Navbar from './shared/components/navbar/Navbar'
import { NetworkStatusMessage } from './shared/components/network-status'
import Sidebar from './shared/components/Sidebar'
import { RootState } from './shared/store'

const HospitalRun = () => {
  const { title } = useSelector((state: RootState) => state.title)
  const { sidebarCollapsed } = useSelector((state: RootState) => state.components)
  const { user } = useSelector((root: RootState) => root.user)

  if (user === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <NetworkStatusMessage />
      <Navbar />
      <div className="container-fluid">
        <Sidebar />
        <ButtonBarProvider>
          <div className="row">
            <main
              role="main"
              className={`${
                sidebarCollapsed ? 'col-md-10 col-lg-11' : 'col-md-9 col-lg-10'
                } ml-sm-auto px-4`}
            >
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{title}</h1>
                <ButtonToolBar />
              </div>
              <Breadcrumbs />
              <div>
                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/appointments" component={Appointments} />
                  <Route path="/patients" component={Patients} />
                  <Route path="/labs" component={Labs} />
                  <Route path="/incidents" component={Incidents} />
                  <Route path="/settings" component={Settings2} />
                  <Route path="/imaging" component={Imagings} />
                </Switch>
              </div>
              <Toaster autoClose={5000} hideProgressBar draggable />
            </main>
          </div>
        </ButtonBarProvider>
      </div>
    </div>
  )
}

export default HospitalRun
