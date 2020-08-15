import React, { useState } from 'react'
import { Card, Collapse } from 'react-bootstrap'

import { ColorVariant } from '@hospitalrun/components/dist/interfaces'
import { Icon } from '@hospitalrun/components'

interface Props {
    color?: ColorVariant
    children?: React.ReactNode
    title?: string
    //footer?: JSX.IntrinsicElements.div
    footer?: any
    collapsible?: boolean
    collapsed?: boolean
    className?: string
}

const CustomPanel = (props: Props) => {
    const { color, children, footer, title, collapsible, collapsed, className } = props
    const [open, setOpen] = useState(!collapsed || !collapsible)
  
    const collapseIcon = (
      <span style={{ float: 'right', cursor: 'pointer' }}>
        <Icon
          icon={open ? 'up-arrow' : 'down-arrow'}
          onClick={() => setOpen(!open)}
          aria-controls="collapse-body"
          aria-expanded={open}
        />
      </span>
    )
  
    return (
      <Card className={className} border={color}>
        {title && (
          <Card.Header
            style={collapsible ? { cursor: 'pointer', textAlign: 'left' } : { textAlign: 'left' }}
            onClick={() => collapsible && setOpen(!open)}
          >
            {title}
            {collapsible && collapseIcon}
          </Card.Header>
        )}
        <Card.Body style={{ textAlign: 'left' }}>
          {collapsible && !title && collapseIcon}
          <Collapse in={open}>
            <div id="collapse-body">{children}</div>
          </Collapse>
        </Card.Body>
        {footer && (
          <Card.Footer style={{ textAlign: 'left', fontSize: 'smaller' }}>{footer}</Card.Footer>
        )}
      </Card>
    )
  }

export { CustomPanel }

